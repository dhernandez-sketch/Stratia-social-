from app.workers.celery_app import celery_app
from app.core.database import SessionLocal
from app.models.models import Document
from app.services.document_processor import DocumentProcessor
from app.services.ai_service import AIService
import traceback

@celery_app.task(bind=True, max_retries=3)
def process_document_task(self, document_id: int):
    """Tarea asíncrona para procesar documentos"""
    db = SessionLocal()
    try:
        # Obtener documento
        document = db.query(Document).filter(Document.id == document_id).first()
        if not document:
            raise ValueError(f"Document {document_id} not found")
        
        # Actualizar estado
        document.status = "processing"
        db.commit()
        
        # Procesar documento
        result = DocumentProcessor.process_document(document.file_path, document.file_type)
        
        if "error" in result:
            document.status = "failed"
            document.error_message = result["error"]
        else:
            document.status = "completed"
            document.extracted_data = result
            if "text" in result:
                document.extracted_text = result["text"]
            
            # Analizar con IA si hay texto
            if "text" in result and len(result["text"]) > 100:
                ai_service = AIService()
                analysis = ai_service.analyze_document(
                    content=result["text"],
                    document_type=document.document_type or "general"
                )
                document.extracted_data["ai_analysis"] = analysis
        
        db.commit()
        return {"status": "success", "document_id": document_id}
        
    except Exception as exc:
        db.rollback()
        document.status = "failed"
        document.error_message = str(exc)
        db.commit()
        
        # Reintentar con backoff
        raise self.retry(exc=exc, countdown=60 * (2 ** self.request.retries))
    
    finally:
        db.close()

@celery_app.task
def generate_embeddings_task(document_id: int):
    """Genera embeddings para búsqueda semántica"""
    db = SessionLocal()
    try:
        document = db.query(Document).filter(Document.id == document_id).first()
        if not document or not document.extracted_text:
            return {"status": "skipped", "reason": "No text to embed"}
        
        ai_service = AIService()
        
        # Dividir texto en chunks
        chunks = ai_service.split_text(document.extracted_text)
        
        # Generar embeddings
        embeddings = ai_service.generate_embeddings(chunks)
        
        # Guardar en base de datos (implementar tabla de embeddings)
        # Por ahora solo retornamos los embeddings
        return {
            "status": "success",
            "document_id": document_id,
            "chunks": len(chunks),
            "embeddings_count": len(embeddings)
        }
        
    except Exception as e:
        return {"status": "error", "error": str(e)}
    
    finally:
        db.close()
