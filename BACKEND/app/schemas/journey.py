# schemas/journey.py

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

# Temel Şema: Veri oluşturma ve okuma için ortak alanlar
class JourneyPersonBase(BaseModel):
    year: int
    name: str = Field(min_length=2, max_length=100)
    role: str = Field(min_length=2, max_length=100)
    description: str = Field(min_length=5, max_length=255)
    photo_url: Optional[str] = None

# Veri Oluşturma Şeması (Admin panelinden gelecek veri)
class JourneyPersonCreate(JourneyPersonBase):
    pass

# Veri Okuma Şeması (API'den dönecek veri)
class JourneyPersonRead(JourneyPersonBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class JourneyPersonUpdate(BaseModel):
    year: Optional[int] = None
    name: Optional[str] = Field(None, min_length=2, max_length=100)
    role: Optional[str] = Field(None, min_length=2, max_length=100)
    description: Optional[str] = Field(None, min_length=5, max_length=255)
    photo_url: Optional[str] = None
