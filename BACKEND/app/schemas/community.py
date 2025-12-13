from typing import List, Optional
from pydantic import BaseModel, EmailStr, field_validator
from datetime import datetime


# ---- Create (user form) ----
class CommunityApplicationCreate(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    phone: Optional[str] = None

    interests: List[str]             # en az 1 seçim şart
    heard_from: str                  # dropdown

    motivation: str                  # textarea
    contribution: str                # textarea

    # boş-string engelle
    @field_validator("first_name", "last_name", "heard_from", "motivation", "contribution")
    @classmethod
    def not_blank(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError("Bu alan boş bırakılamaz.")
        return v.strip()

    @field_validator("interests")
    @classmethod
    def at_least_one_interest(cls, v: List[str]) -> List[str]:
        if not v or len(v) == 0:
            raise ValueError("En az bir ilgi alanı seçmelisiniz.")
        return [i.strip() for i in v if i and i.strip()]


# ---- Read (response) ----
class CommunityApplicationResponse(BaseModel):
    id: int
    first_name: str
    last_name: str
    email: EmailStr
    phone: Optional[str] = None
    interests: List[str]
    heard_from: str
    motivation: str
    contribution: str
    status: str
    created_at: datetime | None = None

    class Config:
        from_attributes = True


# ---- Admin: status update ----
class CommunityApplicationStatusUpdate(BaseModel):
    status: str  # "pending" | "reviewed" | "accepted" | "rejected"

    @field_validator("status")
    @classmethod
    def valid_status(cls, v: str) -> str:
        allowed = {"pending", "reviewed", "accepted", "rejected"}
        if v not in allowed:
            raise ValueError(f"Geçersiz durum: {v}")
        return v
