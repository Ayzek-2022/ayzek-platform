from pydantic import BaseModel, Field
from typing import Optional


class TimelineEventBase(BaseModel):
    title: str = Field(..., min_length=1)
    description: str = Field(..., min_length=1)
    category: str = Field(..., min_length=1)
    # "Mart 2024", "2022 Q2-Q3" gibi serbest etiket:
    date_label: str = Field(..., min_length=1)


class TimelineEventCreate(TimelineEventBase):
    # image upload multipart ile gelecek; burada sadece şema tarafı
    pass


class TimelineEventUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    date_label: Optional[str] = None
    # image yine multipart ile; burada url doğrudan set etmek istersen opsiyonel:
    image_url: Optional[str] = None


class TimelineEventOut(TimelineEventBase):
    id: int
    image_url: Optional[str] = None

    class Config:
        from_attributes = True  # SQLAlchemy -> Pydantic v2 uyumu
