from typing import List, Optional, Union
from pydantic import BaseModel, AnyHttpUrl, ConfigDict, field_validator

class TeamMemberBase(BaseModel):
    full_name: str
    role: str
    description: Optional[str] = None
    # Girişte esnek ol: liste de kabul et, virgüllü string de
    tags: Union[List[str], str, None] = None

    linkedin_url: Optional[AnyHttpUrl] = None
    github_url: Optional[AnyHttpUrl] = None

    # http(s) ya da "/" ile relative yol kabul et
    image_url: Optional[str] = None

    @field_validator("image_url")
    @classmethod
    def _validate_image_url(cls, v: Optional[str]) -> Optional[str]:
        if not v:
            return v
        v = v.strip()
        if v.startswith("http://") or v.startswith("https://") or v.startswith("/"):
            return v
        raise ValueError("image_url http(s) ile başlamalı veya '/' ile relative yol olmalı")

class TeamMemberCreate(TeamMemberBase):
    pass

class TeamMemberUpdate(BaseModel):
    full_name: Optional[str] = None
    role: Optional[str] = None
    description: Optional[str] = None
    tags: Union[List[str], str, None] = None
    image_url: Optional[str] = None
    linkedin_url: Optional[AnyHttpUrl] = None
    github_url: Optional[AnyHttpUrl] = None

    @field_validator("image_url")
    @classmethod
    def _validate_image_url_update(cls, v: Optional[str]) -> Optional[str]:
        if not v:
            return v
        v = v.strip()
        if v.startswith("http://") or v.startswith("https://") or v.startswith("/"):
            return v
        raise ValueError("image_url http(s) ile başlamalı veya '/' ile relative yol olmalı")

# ÇIKIŞ MODELİ: her zaman List[str] döndür (UI 3. görseldeki gibi rozetler)
class TeamMemberOut(BaseModel):
    id: int
    full_name: str
    role: str
    description: Optional[str] = None
    tags: Optional[List[str]] = None
    image_url: Optional[str] = None
    linkedin_url: Optional[AnyHttpUrl] = None
    github_url: Optional[AnyHttpUrl] = None

    model_config = ConfigDict(from_attributes=True)

    @field_validator("tags", mode="before")
    @classmethod
    def _coerce_tags_to_list(cls, v):
        # None → None
        if v is None:
            return None
        # DB string ise "a, b, c" → ["a","b","c"]
        if isinstance(v, str):
            return [t.strip() for t in v.split(",") if t.strip()]
        # Bazen Pydantic stringi listeye harf harf çevirebilir: ["L","i","d",...]
        if isinstance(v, list):
            if all(isinstance(x, str) and len(x) == 1 for x in v) and "," in "".join(v):
                joined = "".join(v)
                return [t.strip() for t in joined.split(",") if t.strip()]
            # normal listeyse dokunma
            return v
        # başka tip gelirse tek etiket yap
        return [str(v)]
