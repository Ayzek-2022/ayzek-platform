from pydantic import BaseModel
from typing import Optional

class AdminLogin(BaseModel):
    email: str
    password: str

class Admin(BaseModel):
    email: str
    name: Optional[str] = None
    
    class Config:
        from_attributes = True