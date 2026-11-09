from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional
import os
import uuid
from app.core.database import get_db
from app.models.models import Document
from app.schemas.schemas import DocumentCreate, Document
from app.services.document_processor import DocumentProcessor

router = APIRouter()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/", response_model=Document)
async def upload_document(
    file: UploadFile = File(...),
    document_type: Optional[str] = Form(None),
    organization_id: int = Form(...),
    uploaded_by: int = Form(...),
    db: Session = Depends(get_db)
):
    # Generar nombre único para el archivo
    file_extension = file.filename.split('.')[-1]
    unique_filename = f"{uuid.uuid4()}.{file_extension}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)
    
    # Guardar archivo
    with open(file_path, "wb") as buffer:
        content = await file.read()
        buffer.write(content)
    
    file_size = len(content)
    
    # Crear registro en base de datos
    db_document = Document(
        filename=file.filename,
        file_path=file_path,
        file_type=file_extension,
        file_size=file_size,
        document_type=document_type,
        organization_id=organization_id,
        uploaded_by=uploaded_by,
        status="pending"
    )
    
    db.add(db_document)
    db.commit()
    db.refresh(db_document)
    
    return db_document

@router.post("/{document_id}/process", response_model=Document)
def process_document(document_id: int, db: Session = Depends(get_db)):
    document = db.query(Document).filter(Document.id == document_id).first()
    if document is None:
        raise HTTPException(status_code=404, detail="Document not found")
    
    # Procesar documento
    result = DocumentProcessor.process_document(document.file_path, document.file_type)
    
    if "error" in result:
        document.status = "failed"
        document.error_message = result["error"]
    else:
        document.status = "completed"
        document.extracted_data = result
        
        # Si es texto, guardarlo
        if "text" in result:
            document.extracted_text = result["text"]
    
    db.commit()
    db.refresh(document)
    return document

@router.get("/", response_model=List[Document])
def read_documents(
    skip: int = 0,
    limit: int = 100,
    organization_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Document)
    if organization_id:
        query = query.filter(Document.organization_id == organization_id)
    
    documents = query.offset(skip).limit(limit).all()
    return documents

@router.get("/{document_id}", response_model=Document)
def read_document(document_id: int, db: Session = Depends(get_db)):
    document = db.query(Document).filter(Document.id == document_id).first()
    if document is None:
        raise HTTPException(status_code=404, detail="Document not found")
    return document

@router.delete("/{document_id}")
def delete_document(document_id: int, db: Session = Depends(get_db)):
    document = db.query(Document).filter(Document.id == document_id).first()
    if document is None:
        raise HTTPException(status_code=404, detail="Document not found")
    
    # Eliminar archivo físico
    try:
        if os.path.exists(document.file_path):
            os.remove(document.file_path)
    except Exception as e:
        pass  # Continuar aunque falle eliminación de archivo
    
    db.delete(document)
    db.commit()
    return {"message": "Document deleted successfully"}
