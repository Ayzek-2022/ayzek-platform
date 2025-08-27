from pydantic import BaseModel, HttpUrl, Field
from datetime import date as Date

class GalleryEventBase(BaseModel):
    category: str = Field(..., max_length=50)
    image_url: HttpUrl | str
    title: str
    description: str
    date: Date
    location: str

class GalleryEventCreate(GalleryEventBase):
    pass

class GalleryEventUpdate(BaseModel):
    category: str | None = None
    image_url: HttpUrl | str | None = None
    title: str | None = None
    description: str | None = None
    date: Date | None = None
    location: str | None = None

class GalleryEventOut(GalleryEventBase):
    id: int
    class Config:
        from_attributes = True  # pydantic v2

