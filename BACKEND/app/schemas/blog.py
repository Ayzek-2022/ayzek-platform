# app/schemas/blog.py
import datetime as dt
from typing import Optional
from pydantic import BaseModel, field_validator, ConfigDict

# ---------- Base ----------
class BlogBase(BaseModel):
    title: str
    content: str
    author: str
    category: str
    cover_image: Optional[str] = None
    date: dt.date
    preview: Optional[str] = None

    # "gg.aa.yyyy" veya "yyyy-mm-dd" kabul et
    @field_validator("date", mode="before")
    def parse_tr_date(cls, v):
        if isinstance(v, dt.date):
            return v
        if isinstance(v, str):
            v = v.strip()
            for fmt in ("%d.%m.%Y", "%Y-%m-%d"):
                try:
                    return dt.datetime.strptime(v, fmt).date()
                except ValueError:
                    continue
        raise ValueError("Geçersiz tarih formatı. 'gg.aa.yyyy' veya 'yyyy-mm-dd' gönderin.")

# ---------- Create ----------
class BlogCreate(BlogBase):
    pass

# ---------- Update ----------
class BlogUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    author: Optional[str] = None
    category: Optional[str] = None
    cover_image: Optional[str] = None
    date: Optional[dt.date] = None
    preview: Optional[str] = None

    @field_validator("date", mode="before")
    def parse_tr_date_update(cls, v):
        if v is None:
            return v
        if isinstance(v, dt.date):
            return v
        if isinstance(v, str):
            v = v.strip()
            for fmt in ("%d.%m.%Y", "%Y-%m-%d"):
                try:
                    return dt.datetime.strptime(v, fmt).date()
                except ValueError:
                    continue
        raise ValueError("Geçersiz tarih formatı.")

# ---------- Out (Response) ----------
class BlogOut(BlogBase):
    id: int
    # Pydantic v2:
    model_config = ConfigDict(from_attributes=True)

# ---------- Out (Response) ----------
class BlogOut(BlogBase):
    id: int
    # Pydantic v2:
    model_config = ConfigDict(from_attributes=True)