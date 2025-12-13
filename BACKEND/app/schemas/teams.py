from typing import List, Optional
from pydantic import BaseModel, Field
from datetime import datetime

# Üye Şeması - Base
class TeamMemberBase(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    role: str = Field(min_length=1, max_length=100)
    linkedin_url: Optional[str] = Field(None, max_length=255)

# Üye Şeması - Read
class TeamMemberRead(TeamMemberBase):
    id: int

    class Config:
        from_attributes = True


# Takım Şeması - CREATE (Admin Panelinden Gelen Veri)
class TeamCreate(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    project_name: str = Field(min_length=2, max_length=150)
    category: str = Field(min_length=2, max_length=100)
    description: str = Field(min_length=10)
    photo_url: Optional[str] = None
    is_featured: bool = False
    
    # Üyeler
    members: List[TeamMemberBase] = []


# Takım Şeması - READ (API'dan Dönen Veri)
class TeamRead(BaseModel):
    id: int
    name: str
    slug: str
    project_name: str
    category: str
    description: str
    photo_url: Optional[str]
    is_featured: bool
    created_at: datetime
    updated_at: datetime
    
    # Üyeler listesi dahil edilir
    members: List[TeamMemberRead] = []

    class Config:
        from_attributes = True

class TeamUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=2, max_length=100)
    project_name: Optional[str] = Field(None, min_length=2, max_length=150)
    category: Optional[str] = Field(None, min_length=2, max_length=100)
    description: Optional[str] = Field(None, min_length=10)
    photo_url: Optional[str] = None
    is_featured: Optional[bool] = None