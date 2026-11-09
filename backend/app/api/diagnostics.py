from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.models.models import DiagnosticResult, Organization, Document
from app.schemas.schemas import DiagnosticResultCreate, DiagnosticResult
from app.services.ai_service import AIService

router = APIRouter()
ai_service = AIService()

@router.post("/", response_model=DiagnosticResult)
def create_diagnostic(diagnostic: DiagnosticResultCreate, db: Session = Depends(get_db)):
    db_diagnostic = DiagnosticResult(**diagnostic.model_dump())
    db.add(db_diagnostic)
    db.commit()
    db.refresh(db_diagnostic)
    return db_diagnostic

@router.post("/foda/{organization_id}", response_model=DiagnosticResult)
def generate_foda_diagnostic(organization_id: int, db: Session = Depends(get_db)):
    organization = db.query(Organization).filter(Organization.id == organization_id).first()
    if organization is None:
        raise HTTPException(status_code=404, detail="Organization not found")
    
    # Obtener documentos de la organización
    documents = db.query(Document).filter(
        Document.organization_id == organization_id,
        Document.status == "completed"
    ).all()
    
    # Preparar contexto
    organization_context = f"""
    Nombre: {organization.name}
    Misión: {organization.mission or 'No especificada'}
    Visión: {organization.vision or 'No especificada'}
    Descripción: {organization.description or 'No especificada'}
    Estatus legal: {organization.legal_status or 'No especificado'}
    """
    
    documents_summary = ""
    for doc in documents:
        if doc.extracted_text:
            documents_summary += f"\n\n--- {doc.filename} ---\n{doc.extracted_text[:2000]}"
    
    # Generar análisis FODA
    foda_result = ai_service.generate_foda_analysis(organization_context, documents_summary)
    
    # Calcular score general
    scores = foda_result.get("score", {})
    overall_score = sum(scores.values()) / len(scores) if scores else 0
    
    # Crear resultado de diagnóstico
    db_diagnostic = DiagnosticResult(
        organization_id=organization_id,
        diagnostic_type="foda",
        results=foda_result,
        recommendations=[{"action": strategy, "priority": "high"} for strategy in foda_result.get("estrategias", {}).get("FO", [])],
        score=overall_score
    )
    
    db.add(db_diagnostic)
    db.commit()
    db.refresh(db_diagnostic)
    
    return db_diagnostic

@router.post("/strategic-plan/{organization_id}", response_model=DiagnosticResult)
def generate_strategic_plan(
    organization_id: int,
    timeframe_years: int = 3,
    db: Session = Depends(get_db)
):
    organization = db.query(Organization).filter(Organization.id == organization_id).first()
    if organization is None:
        raise HTTPException(status_code=404, detail="Organization not found")
    
    # Obtener diagnósticos previos
    diagnostics = db.query(DiagnosticResult).filter(
        DiagnosticResult.organization_id == organization_id
    ).all()
    
    diagnostic_results = {d.diagnostic_type: d.results for d in diagnostics}
    
    organization_context = f"""
    Nombre: {organization.name}
    Misión: {organization.mission or 'No especificada'}
    Visión: {organization.vision or 'No especificada'}
    Descripción: {organization.description or 'No especificada'}
    """
    
    # Generar plan estratégico
    plan = ai_service.generate_strategic_plan(
        organization_context=organization_context,
        diagnostic_results=diagnostic_results,
        timeframe_years=timeframe_years
    )
    
    # Crear resultado
    db_diagnostic = DiagnosticResult(
        organization_id=organization_id,
        diagnostic_type="strategic_plan",
        results=plan,
        recommendations=[{"project": p["nombre"], "priority": "high"} for p in plan.get("proyectos_prioritarios", [])],
        score=None
    )
    
    db.add(db_diagnostic)
    db.commit()
    db.refresh(db_diagnostic)
    
    return db_diagnostic

@router.get("/", response_model=List[DiagnosticResult])
def read_diagnostics(
    skip: int = 0,
    limit: int = 100,
    organization_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    query = db.query(DiagnosticResult)
    if organization_id:
        query = query.filter(DiagnosticResult.organization_id == organization_id)
    
    diagnostics = query.offset(skip).limit(limit).all()
    return diagnostics

@router.get("/{diagnostic_id}", response_model=DiagnosticResult)
def read_diagnostic(diagnostic_id: int, db: Session = Depends(get_db)):
    diagnostic = db.query(DiagnosticResult).filter(DiagnosticResult.id == diagnostic_id).first()
    if diagnostic is None:
        raise HTTPException(status_code=404, detail="Diagnostic not found")
    return diagnostic
