from datetime import datetime
from typing import Literal
from pydantic import BaseModel, Field
from pydantic import ConfigDict  # Pydantic v2

# ---------- Inbound (create) ----------
class EventSuggestionCreate(BaseModel):
    title: str = Field(..., min_length=3, max_length=200)
    description: str = Field(..., min_length=10)
    contact: str  # e-posta/iletişim

# ---------- Outbound (response) ----------
class EventSuggestionOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)  # ORM -> schema

    id: int
    title: str
    description: str
    contact: str
    status: Literal["pending", "reviewed", "accepted", "rejected"]
    created_at: datetime

# ---------- Status update ----------
class EventSuggestionStatusUpdate(BaseModel):
    status: Literal["pending", "reviewed", "accepted", "rejected"]


