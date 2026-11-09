from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models.models import Organization
from app.schemas.schemas import OrganizationCreate, Organization

router = APIRouter()

@router.post("/", response_model=Organization)
def create_organization(organization: OrganizationCreate, db: Session = Depends(get_db)):
    db_organization = Organization(**organization.model_dump())
    db.add(db_organization)
    db.commit()
    db.refresh(db_organization)
    return db_organization

@router.get("/", response_model=List[Organization])
def read_organizations(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    organizations = db.query(Organization).offset(skip).limit(limit).all()
    return organizations

@router.get("/{organization_id}", response_model=Organization)
def read_organization(organization_id: int, db: Session = Depends(get_db)):
    organization = db.query(Organization).filter(Organization.id == organization_id).first()
    if organization is None:
        raise HTTPException(status_code=404, detail="Organization not found")
    return organization

@router.put("/{organization_id}", response_model=Organization)
def update_organization(
    organization_id: int,
    organization_update: OrganizationCreate,
    db: Session = Depends(get_db)
):
    organization = db.query(Organization).filter(Organization.id == organization_id).first()
    if organization is None:
        raise HTTPException(status_code=404, detail="Organization not found")
    
    for key, value in organization_update.model_dump().items():
        setattr(organization, key, value)
    
    db.commit()
    db.refresh(organization)
    return organization

@router.delete("/{organization_id}")
def delete_organization(organization_id: int, db: Session = Depends(get_db)):
    organization = db.query(Organization).filter(Organization.id == organization_id).first()
    if organization is None:
        raise HTTPException(status_code=404, detail="Organization not found")
    
    db.delete(organization)
    db.commit()
    return {"message": "Organization deleted successfully"}
