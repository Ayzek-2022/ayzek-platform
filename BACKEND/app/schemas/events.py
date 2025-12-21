from pydantic import BaseModel
from typing import Optional
from datetime import datetime

# Ortak Temel Model
class EventBase(BaseModel):
    title: str
    description: str
    cover_image_url: Optional[str] = None
    start_at: datetime
    location: str
    category: str
    capacity: int
    whatsapp_link: Optional[str] = None # Link girilmezse hata vermesin
    tags: Optional[str] = None # Veritabanında string olarak tutuyoruz "AI, Python"
    slug: Optional[str] = None # Slug opsiyonel olsun, backend üretiyor

# Veri Oluştururken Kullanılan Model
class EventCreate(EventBase):
    pass

# Veri Güncellerken Kullanılan Model (HER ŞEY OPSİYONEL OLMALI)
class EventUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    cover_image_url: Optional[str] = None
    start_at: Optional[datetime] = None
    location: Optional[str] = None
    category: Optional[str] = None
    capacity: Optional[int] = None
    whatsapp_link: Optional[str] = None
    tags: Optional[str] = None
    slug: Optional[str] = None

# API'den Dönen Yanıt Modeli (ORM Modu açık)
class Event(EventBase):
    id: int
    registered: int = 0 # Katılımcı sayısı, default 0
    created_at: datetime = None # Veritabanından gelmezse hata vermesin diye default atadık
    
    class Config:
        from_attributes = True # Pydantic v2 için (eski v1 ise orm_mode = True)