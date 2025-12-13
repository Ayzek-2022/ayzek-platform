# crud/crew.py

from sqlalchemy import func
from sqlalchemy.orm import Session
from typing import List, Dict
from collections import defaultdict

from ..models import CrewMember
from ..schemas.crew import CrewMemberCreate, CrewMemberUpdate

# YENİ BİR EKİP ÜYESİ OLUŞTUR
# - order_index verilmezse: aynı kategorideki max(order_index)+1 atanır → en sona gelir
def create_crew_member(db: Session, member: CrewMemberCreate) -> CrewMember:
    data = member.model_dump()
    if data.get("order_index") is None:
        max_idx = (
            db.query(func.coalesce(func.max(CrewMember.order_index), 0))
            .filter(CrewMember.category == data["category"])
            .scalar()
        )
        data["order_index"] = int(max_idx) + 1

    db_member = CrewMember(**data)
    db.add(db_member)
    db.commit()
    db.refresh(db_member)
    return db_member

# TÜM EKİP ÜYELERİNİ KATEGORİYE GÖRE GRUPLANMIŞ GETİR
# - Stabil sıralama: category, order_index (NULLS LAST), created_at, id
def get_all_crew_members_grouped(db: Session) -> Dict[str, List[CrewMember]]:
    members = (
        db.query(CrewMember)
        .order_by(
            CrewMember.category.asc(),
            CrewMember.order_index.asc().nulls_last(),
            CrewMember.created_at.asc(),
            CrewMember.id.asc(),
        )
        .all()
    )
    grouped_members = defaultdict(list)
    for member in members:
        grouped_members[member.category].append(member)
    return dict(grouped_members)

# BİR EKİP ÜYESİNİ GÜNCELLE
# - Kategori değiştiyse ve order_index verilmediyse: yeni kategoride en sona al
# - order_index açıkça verilmişse: doğrudan uygula
def update_crew_member(db: Session, member_id: int, member_update: CrewMemberUpdate) -> CrewMember | None:
    db_member = db.query(CrewMember).filter(CrewMember.id == member_id).first()
    if not db_member:
        return None

    old_category = db_member.category
    update_data = member_update.model_dump(exclude_unset=True)

    # Alanları uygula (category dahil)
    for key, value in update_data.items():
        setattr(db_member, key, value)

    # Kategori değişti ve order_index verilmedi → yeni kategoride en sona
    if (
        "category" in update_data
        and update_data["category"] != old_category
        and "order_index" not in update_data
    ):
        max_idx = (
            db.query(func.coalesce(func.max(CrewMember.order_index), 0))
            .filter(CrewMember.category == db_member.category)
            .scalar()
        )
        db_member.order_index = int(max_idx) + 1

    db.add(db_member)
    db.commit()
    db.refresh(db_member)
    return db_member

# BİR EKİP ÜYESİNİ SİL
def delete_crew_member(db: Session, member_id: int) -> bool:
    db_member = db.query(CrewMember).filter(CrewMember.id == member_id).first()
    if db_member:
        db.delete(db_member)
        db.commit()
        return True
    return False
