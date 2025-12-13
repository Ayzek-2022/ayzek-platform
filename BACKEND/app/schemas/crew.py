# schemas/crew.py

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

# Temel Şema
class CrewMemberBase(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    role: str = Field(min_length=2, max_length=100)
    description: Optional[str] = None
    category: str
    photo_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    github_url: Optional[str] = None
    # ÖNEMLİ: opsiyonel yapıldı ki create'te gönderilmezse backend max+1 atayabilsin
    order_index: Optional[int] = None

# Veri Oluşturma Şeması
class CrewMemberCreate(CrewMemberBase):
    pass

# Veri Güncelleme Şeması (tüm alanlar opsiyonel)
class CrewMemberUpdate(BaseModel):
    name: Optional[str] = None
    role: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    photo_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    github_url: Optional[str] = None
    order_index: Optional[int] = None

# Veri Okuma Şeması (API'den dönecek)
class CrewMemberRead(CrewMemberBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
