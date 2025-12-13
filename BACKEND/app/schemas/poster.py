from typing import Optional
from pydantic import BaseModel, Field

class PosterBase(BaseModel):
    title: str = Field(..., max_length=200)
    subtitle: Optional[str] = Field(None, max_length=250)
    content: Optional[str] = None
    image_url: Optional[str] = None
    is_active: Optional[bool] = True
    # ÖNEMLİ: Opsiyonel yapıldı. Gönderilmezse backend max+1 atayacak.
    order_index: Optional[int] = None

class PosterCreate(PosterBase):
    pass

class PosterUpdate(BaseModel):
    title: Optional[str] = Field(None, max_length=200)
    subtitle: Optional[str] = Field(None, max_length=250)
    content: Optional[str] = None
    image_url: Optional[str] = None
    is_active: Optional[bool] = None
    order_index: Optional[int] = None

class PosterOut(PosterBase):
    id: int
    class Config:
        from_attributes = True
