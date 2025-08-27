from typing import List, Optional, Union
from sqlalchemy.orm import Session
from app import models
from app.schemas.team import TeamMemberCreate, TeamMemberUpdate

def _to_string(data: Union[List[str], str, None]) -> Optional[str]:
    """Bir listeyi virgülle ayrılmış tek bir metne dönüştürür."""
    if isinstance(data, list):
        # Liste ise, elemanları virgül ve boşlukla birleştir.
        return ", ".join([item.strip() for item in data if item and item.strip()])
    if isinstance(data, str):
        # String ise zaten doğru formatta
        return data.strip()
    return None

def get_team_members(db: Session) -> List[models.TeamMember]:
    return db.query(models.TeamMember).order_by(models.TeamMember.id.asc()).all()

def get_team_member(db: Session, member_id: int) -> Optional[models.TeamMember]:
    return db.query(models.TeamMember).filter(models.TeamMember.id == member_id).first()

def create_team_member(db: Session, member_in: TeamMemberCreate) -> models.TeamMember:
    # `model_dump(mode='json')` ile Pydantic modelini JSON uyumlu bir dictionary'ye çeviriyoruz.
    # Bu işlem, AnyHttpUrl gibi tipleri otomatik olarak string'e dönüştürür.
    payload = member_in.model_dump(mode='json', exclude_none=True)

    # tags alanını veritabanına uygun metin formatına dönüştürüyoruz.
    if "tags" in payload:
        payload["tags"] = _to_string(payload["tags"])

    db_member = models.TeamMember(**payload)
    db.add(db_member)
    db.commit()
    db.refresh(db_member)
    return db_member

def update_team_member(db: Session, member_id: int, member_in: TeamMemberUpdate) -> Optional[models.TeamMember]:
    db_member = get_team_member(db, member_id)
    if not db_member:
        return None
    
    incoming_data = member_in.model_dump(mode='json', exclude_unset=True)

    if "tags" in incoming_data:
        incoming_data["tags"] = _to_string(incoming_data["tags"])

    for k, v in incoming_data.items():
        setattr(db_member, k, v)

    db.add(db_member)
    db.commit()
    db.refresh(db_member)
    return db_member

def delete_team_member(db: Session, member_id: int) -> bool:
    db_member = get_team_member(db, member_id)
    if not db_member:
        return False
    db.delete(db_member)
    db.commit()
    return True