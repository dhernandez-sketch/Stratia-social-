from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict, Any
from datetime import datetime

# Organization schemas
class OrganizationBase(BaseModel):
    name: str
    description: Optional[str] = None
    mission: Optional[str] = None
    vision: Optional[str] = None
    legal_status: Optional[str] = None
    location: Optional[str] = None
    website: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None

class OrganizationCreate(OrganizationBase):
    pass

class Organization(OrganizationBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# User schemas
class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None
    role: Optional[str] = "user"

class UserCreate(UserBase):
    password: str
    organization_id: int

class User(UserBase):
    id: int
    is_active: int
    organization_id: int
    created_at: datetime

    class Config:
        from_attributes = True

# Document schemas
class DocumentBase(BaseModel):
    filename: str
    file_type: str
    document_type: Optional[str] = None

class DocumentCreate(DocumentBase):
    pass

class Document(DocumentBase):
    id: int
    file_path: str
    file_size: Optional[int] = None
    extracted_text: Optional[str] = None
    extracted_data: Optional[Dict[str, Any]] = None
    organization_id: int
    uploaded_by: int
    status: str
    error_message: Optional[str] = None
    created_at: datetime
    processed_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Report schemas
class ReportBase(BaseModel):
    title: str
    report_type: str
    content: Optional[str] = None
    template_used: Optional[str] = None

class ReportCreate(ReportBase):
    structured_data: Optional[Dict[str, Any]] = None
    organization_id: int

class Report(ReportBase):
    id: int
    structured_data: Optional[Dict[str, Any]] = None
    organization_id: int
    created_by: int
    status: str
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Convocatoria schemas
class ConvocatoriaBase(BaseModel):
    title: str
    funder: Optional[str] = None
    description: Optional[str] = None
    requirements: Optional[str] = None
    deadline: Optional[datetime] = None
    amount: Optional[float] = None
    currency: Optional[str] = "MXN"
    thematic_area: Optional[str] = None
    eligibility_criteria: Optional[str] = None
    url: Optional[str] = None

class ConvocatoriaCreate(ConvocatoriaBase):
    organization_id: int

class Convocatoria(ConvocatoriaBase):
    id: int
    organization_id: int
    compatibility_score: Optional[float] = None
    compatibility_analysis: Optional[Dict[str, Any]] = None
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

# Diagnostic schemas
class DiagnosticResultBase(BaseModel):
    diagnostic_type: str
    results: Dict[str, Any]
    recommendations: Optional[List[Dict[str, Any]]] = None
    score: Optional[float] = None

class DiagnosticResultCreate(DiagnosticResultBase):
    organization_id: int

class DiagnosticResult(DiagnosticResultBase):
    id: int
    organization_id: int
    created_at: datetime

    class Config:
        from_attributes = True
