# crud/teams.py

from sqlalchemy.orm import Session
from typing import List, Optional
import re
from unidecode import unidecode

from ..models import Team, TeamMember
from ..schemas.teams import TeamCreate

# Slug oluşturma yardımcı fonksiyonu (Değişiklik yok)
def create_slug(text: str) -> str:
    """Türkçe karakterleri ve boşlukları temizleyerek slug oluşturur."""
    text = unidecode(text).lower()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[-\s]+', '-', text).strip('-')
    return text

# --- Read İşlemleri ---

def get_team_by_id(db: Session, team_id: int) -> Optional[Team]:
    """Belirtilen ID'ye sahip takımı üyeleriyle birlikte getirir."""
    return db.query(Team).filter(Team.id == team_id).first()

def get_team_by_name(db: Session, name: str) -> Optional[Team]:
    """Belirtilen ada sahip takımı getirir (Benzersizlik kontrolü için kullanılır)."""
    return db.query(Team).filter(Team.name == name).first()

# YENİ EKLENDİ: Slug'a göre takım getiren fonksiyon
def get_team_by_slug(db: Session, slug: str) -> Optional[Team]:
    """Belirtilen slug'a sahip takımı getirir (Benzersizlik kontrolü için)."""
    return db.query(Team).filter(Team.slug == slug).first()

def get_all_teams(db: Session) -> List[Team]:
    """Veritabanındaki tüm takımları getirir."""
    return db.query(Team).all()

def get_featured_teams(db: Session, limit: int = 4) -> List[Team]:
    """Anasayfada gösterilmek üzere öne çıkarılmış takımları getirir."""
    return db.query(Team).filter(Team.is_featured == True).limit(limit).all()

# --- Create İşlemleri ---

# GÜNCELLENDİ: Bu fonksiyon artık daha verimli ve güvenli.
def create_team_with_members(db: Session, team: TeamCreate) -> Team:
    """Yeni bir takım ve üyelerini tek bir işlemde veritabanına kaydeder."""
    
    # 1. Gelen veriden (Pydantic şeması) SQLAlchemy model nesneleri oluştur.
    # Önce üyeleri oluşturuyoruz.
    member_objects = [
        TeamMember(
            name=member.name, 
            role=member.role, 
            linkedin_url=member.linkedin_url
        ) for member in team.members
    ]
    
    # 2. Takım objesini oluştur ve üyeleri doğrudan `members` ilişkisine ata.
    # SQLAlchemy, bu üyelerin team_id'sini otomatik olarak ayarlayacaktır.
    db_team = Team(
        name=team.name,
        slug=create_slug(team.name),
        project_name=team.project_name,
        category=team.category,
        description=team.description,
        photo_url=team.photo_url,
        is_featured=team.is_featured,
        members=member_objects  # Üye listesini doğrudan ilişkiye atıyoruz
    )
    
    # 3. Tek bir seferde tüm nesneleri (hem takım hem de üyeler) ekle ve commit et.
    db.add(db_team)
    db.commit()
    db.refresh(db_team)
    
    return db_team

# --- Delete İşlemleri (Değişiklik yok) ---
def delete_team(db: Session, team_id: int) -> bool:
    """Bir takımı ID ile siler. Cascade ayarı sayesinde üyeler de silinir."""
    db_team = get_team_by_id(db, team_id)
    if db_team:
        db.delete(db_team)
        db.commit()
        return True
    return False