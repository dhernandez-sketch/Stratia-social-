from fastapi import APIRouter
from app.api import organizations, documents, reports, diagnostics, convocatorias

api_router = APIRouter()
api_router.include_router(organizations.router, prefix="/organizations", tags=["organizations"])
api_router.include_router(documents.router, prefix="/documents", tags=["documents"])
api_router.include_router(reports.router, prefix="/reports", tags=["reports"])
api_router.include_router(diagnostics.router, prefix="/diagnostics", tags=["diagnostics"])
api_router.include_router(convocatorias.router, prefix="/convocatorias", tags=["convocatorias"])
