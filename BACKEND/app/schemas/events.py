from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel

class EventBase(BaseModel):
    title: str
    description: str
    cover_image_url: Optional[str] = None
    start_at: datetime
    location: str
    category: str
    capacity: int
    whatsapp_link: str
    slug: str
    tags: Optional[str] = None

class EventCreate(EventBase):
    pass

class EventUpdate(EventBase):
    pass

class Event(EventBase):
    id: int
    created_at: datetime
    registered: int

    class Config:
       from_attributes = True

