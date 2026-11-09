from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.models.models import Convocatoria, Organization
from app.schemas.schemas import ConvocatoriaCreate, Convocatoria
from app.services.ai_service import AIService

router = APIRouter()
ai_service = AIService()

@router.post("/", response_model=Convocatoria)
def create_convocatoria(convocatoria: ConvocatoriaCreate, db: Session = Depends(get_db)):
    db_convocatoria = Convocatoria(**convocatoria.model_dump())
    db.add(db_convocatoria)
    db.commit()
    db.refresh(db_convocatoria)
    return db_convocatoria

@router.post("/{convocatoria_id}/evaluate/{organization_id}", response_model=Convocatoria)
def evaluate_compatibility(
    convocatoria_id: int,
    organization_id: int,
    db: Session = Depends(get_db)
):
    convocatoria = db.query(Convocatoria).filter(Convocatoria.id == convocatoria_id).first()
    if convocatoria is None:
        raise HTTPException(status_code=404, detail="Convocatoria not found")
    
    organization = db.query(Organization).filter(Organization.id == organization_id).first()
    if organization is None:
        raise HTTPException(status_code=404, detail="Organization not found")
    
    # Preparar perfil de la organización
    organization_profile = {
        "name": organization.name,
        "description": organization.description,
        "mission": organization.mission,
        "vision": organization.vision,
        "legal_status": organization.legal_status,
        "location": organization.location,
        "thematic_areas": ["desarrollo social", "educación", "salud"]  # Esto se extraería de documentos
    }
    
    # Preparar datos de la convocatoria
    convocatoria_data = {
        "title": convocatoria.title,
        "funder": convocatoria.funder,
        "description": convocatoria.description,
        "requirements": convocatoria.requirements,
        "deadline": convocatoria.deadline.isoformat() if convocatoria.deadline else None,
        "amount": convocatoria.amount,
        "currency": convocatoria.currency,
        "thematic_area": convocatoria.thematic_area,
        "eligibility_criteria": convocatoria.eligibility_criteria
    }
    
    # Evaluar compatibilidad
    evaluation = ai_service.evaluate_convocatoria_compatibility(
        organization_profile=organization_profile,
        convocatoria_data=convocatoria_data
    )
    
    # Actualizar convocatoria con resultados
    convocatoria.compatibility_score = evaluation.get("overall_score")
    convocatoria.compatibility_analysis = evaluation
    
    db.commit()
    db.refresh(convocatoria)
    
    return convocatoria

@router.post("/bulk-import")
def bulk_import_convocatorias(
    convocatorias: List[ConvocatoriaCreate],
    db: Session = Depends(get_db)
):
    """Importa múltiples convocatorias de una vez"""
    created = []
    for convocatoria_data in convocatorias:
        db_convocatoria = Convocatoria(**convocatoria_data.model_dump())
        db.add(db_convocatoria)
        created.append(db_convocatoria)
    
    db.commit()
    for c in created:
        db.refresh(c)
    
    return {"message": f"{len(created)} convocatorias importadas", "data": created}

@router.get("/", response_model=List[Convocatoria])
def read_convocatorias(
    skip: int = 0,
    limit: int = 100,
    organization_id: Optional[int] = None,
    min_score: Optional[float] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Convocatoria)
    
    if organization_id:
        query = query.filter(Convocatoria.organization_id == organization_id)
    
    if min_score is not None:
        query = query.filter(Convocatoria.compatibility_score >= min_score)
    
    convocatorias = query.offset(skip).limit(limit).all()
    return convocatorias

@router.get("/{convocatoria_id}", response_model=Convocatoria)
def read_convocatoria(convocatoria_id: int, db: Session = Depends(get_db)):
    convocatoria = db.query(Convocatoria).filter(Convocatoria.id == convocatoria_id).first()
    if convocatoria is None:
        raise HTTPException(status_code=404, detail="Convocatoria not found")
    return convocatoria

@router.get("/top-matches/{organization_id}")
def get_top_matches(
    organization_id: int,
    limit: int = 10,
    db: Session = Depends(get_db)
):
    """Obtiene las convocatorias con mayor compatibilidad para una organización"""
    convocatorias = db.query(Convocatoria).filter(
        Convocatoria.organization_id == organization_id,
        Convocatoria.compatibility_score.isnot(None)
    ).order_by(Convocatoria.compatibility_score.desc()).limit(limit).all()
    
    return {
        "organization_id": organization_id,
        "matches": convocatorias,
        "total": len(convocatorias)
    }

@router.delete("/{convocatoria_id}")
def delete_convocatoria(convocatoria_id: int, db: Session = Depends(get_db)):
    convocatoria = db.query(Convocatoria).filter(Convocatoria.id == convocatoria_id).first()
    if convocatoria is None:
        raise HTTPException(status_code=404, detail="Convocatoria not found")
    
    db.delete(convocatoria)
    db.commit()
    return {"message": "Convocatoria deleted successfully"}
