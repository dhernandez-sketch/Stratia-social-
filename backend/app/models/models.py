from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Float, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class Organization(Base):
    __tablename__ = "organizations"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text)
    mission = Column(Text)
    vision = Column(Text)
    legal_status = Column(String(100))  # A.C., A.C., ONG, etc.
    location = Column(String(255))
    website = Column(String(255))
    email = Column(String(255))
    phone = Column(String(50))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    users = relationship("User", back_populates="organization")
    documents = relationship("Document", back_populates="organization")
    reports = relationship("Report", back_populates="organization")
    convocatorias = relationship("Convocatoria", back_populates="organization")

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255))
    role = Column(String(50), default="user")  # admin, user, viewer
    organization_id = Column(Integer, ForeignKey("organizations.id"))
    is_active = Column(Integer, default=1)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    organization = relationship("Organization", back_populates="users")

class Document(Base):
    __tablename__ = "documents"
    
    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=False)
    file_type = Column(String(50))  # pdf, xlsx, pptx, docx
    file_size = Column(Integer)
    document_type = Column(String(100))  # acta, informe, estado_financiero, etc.
    extracted_text = Column(Text)
    extracted_data = Column(JSON)
    organization_id = Column(Integer, ForeignKey("organizations.id"))
    uploaded_by = Column(Integer, ForeignKey("users.id"))
    status = Column(String(50), default="pending")  # pending, processing, completed, failed
    error_message = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    processed_at = Column(DateTime(timezone=True))
    
    # Relationships
    organization = relationship("Organization", back_populates="documents")
    uploaded_by_user = relationship("User")

class Report(Base):
    __tablename__ = "reports"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(500), nullable=False)
    report_type = Column(String(100))  # diagnostico, convocatorias, planeacion, etc.
    content = Column(Text)
    structured_data = Column(JSON)
    template_used = Column(String(255))
    organization_id = Column(Integer, ForeignKey("organizations.id"))
    created_by = Column(Integer, ForeignKey("users.id"))
    status = Column(String(50), default="draft")  # draft, published, archived
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    organization = relationship("Organization", back_populates="reports")
    creator = relationship("User")

class Convocatoria(Base):
    __tablename__ = "convocatorias"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(500), nullable=False)
    funder = Column(String(255))
    description = Column(Text)
    requirements = Column(Text)
    deadline = Column(DateTime(timezone=True))
    amount = Column(Float)
    currency = Column(String(10), default="MXN")
    thematic_area = Column(String(255))
    eligibility_criteria = Column(Text)
    url = Column(String(500))
    organization_id = Column(Integer, ForeignKey("organizations.id"))
    compatibility_score = Column(Float)
    compatibility_analysis = Column(JSON)
    status = Column(String(50), default="active")  # active, expired, applied
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    organization = relationship("Organization", back_populates="convocatorias")

class DiagnosticResult(Base):
    __tablename__ = "diagnostic_results"
    
    id = Column(Integer, primary_key=True, index=True)
    organization_id = Column(Integer, ForeignKey("organizations.id"))
    diagnostic_type = Column(String(100))  # foda, institucional, cadena_valor, etc.
    results = Column(JSON)
    recommendations = Column(JSON)
    score = Column(Float)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    organization = relationship("Organization")
