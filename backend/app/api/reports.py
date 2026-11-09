from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import get_db
from app.models.models import Report, Organization, Document
from app.schemas.schemas import ReportCreate, Report
from app.services.ai_service import AIService
from app.services.report_generator import ReportGenerator

router = APIRouter()
ai_service = AIService()
report_generator = ReportGenerator()

@router.post("/", response_model=Report)
def create_report(report: ReportCreate, db: Session = Depends(get_db)):
    db_report = Report(**report.model_dump())
    db.add(db_report)
    db.commit()
    db.refresh(db_report)
    return db_report

@router.post("/{report_id}/generate", response_model=Report)
def generate_report_content(
    report_id: int,
    organization_id: int,
    db: Session = Depends(get_db)
):
    report = db.query(Report).filter(Report.id == report_id).first()
    if report is None:
        raise HTTPException(status_code=404, detail="Report not found")
    
    organization = db.query(Organization).filter(Organization.id == organization_id).first()
    if organization is None:
        raise HTTPException(status_code=404, detail="Organization not found")
    
    # Obtener documentos de la organización
    documents = db.query(Document).filter(
        Document.organization_id == organization_id,
        Document.status == "completed"
    ).all()
    
    # Preparar contexto
    documents_summary = ""
    for doc in documents:
        if doc.extracted_text:
            documents_summary += f"\n\n--- {doc.filename} ---\n{doc.extracted_text[:2000]}"
    
    organization_context = f"""
    Nombre: {organization.name}
    Misión: {organization.mission or 'No especificada'}
    Visión: {organization.vision or 'No especificada'}
    Descripción: {organization.description or 'No especificada'}
    """
    
    # Generar contenido narrativo
    content = ai_service.generate_narrative_report(
        report_type=report.report_type,
        structured_data={"documents": documents_summary},
        organization_name=organization.name
    )
    
    report.content = content
    report.status = "published"
    
    db.commit()
    db.refresh(report)
    return report

@router.post("/{report_id}/export/{format}")
def export_report(
    report_id: int,
    format: str,
    organization_name: str,
    db: Session = Depends(get_db)
):
    report = db.query(Report).filter(Report.id == report_id).first()
    if report is None:
        raise HTTPException(status_code=404, detail="Report not found")
    
    if not report.content:
        raise HTTPException(status_code=400, detail="Report content not generated yet")
    
    # Generar HTML
    html_content = report_generator.generate_html_report(
        content=report.content,
        title=report.title,
        organization_name=organization_name
    )
    
    # Exportar en formato solicitado
    if format == "html":
        return {"content": html_content, "format": "html"}
    elif format == "pdf":
        # Aquí se generaría el PDF
        return {"content": html_content, "format": "pdf", "note": "PDF generation pending"}
    elif format == "md":
        md_content = report_generator.generate_markdown_report(
            content=report.content,
            title=report.title,
            organization_name=organization_name
        )
        return {"content": md_content, "format": "md"}
    else:
        raise HTTPException(status_code=400, detail="Unsupported format")

@router.get("/", response_model=List[Report])
def read_reports(
    skip: int = 0,
    limit: int = 100,
    organization_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Report)
    if organization_id:
        query = query.filter(Report.organization_id == organization_id)
    
    reports = query.offset(skip).limit(limit).all()
    return reports

@router.get("/{report_id}", response_model=Report)
def read_report(report_id: int, db: Session = Depends(get_db)):
    report = db.query(Report).filter(Report.id == report_id).first()
    if report is None:
        raise HTTPException(status_code=404, detail="Report not found")
    return report

@router.delete("/{report_id}")
def delete_report(report_id: int, db: Session = Depends(get_db)):
    report = db.query(Report).filter(Report.id == report_id).first()
    if report is None:
        raise HTTPException(status_code=404, detail="Report not found")
    
    db.delete(report)
    db.commit()
    return {"message": "Report deleted successfully"}
