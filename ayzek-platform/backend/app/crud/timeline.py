from sqlalchemy.orm import Session
from app.models import TimelineEvents

def list_timeline(db: Session):
    return db.query(TimelineEvents).order_by(TimelineEvents.id.asc()).all()

def seed_timeline(db: Session):
    """İlk kurulum için örnek kayıtlar ekler (yoksa)."""
    if db.query(TimelineEvents).count():
        return
    rows = [
        dict(title="AYZEK Kuruluşu", description="AYZEK platformu resmen hayata geçti.",
             category="Kuruluş", date_label="2023-01-01", image_url="teknofest.JPG"),
        dict(title="AYZEK Kuruluşu", description="Teknoloji tutkunu 15 kişilik bir grup ile yolculuğumuz başladı. İlk toplantımızda vizyonumuzu belirledik.",
             category="Kilometre Taşı", date_label="Mart 2022", image_url="tech-discussion.png"),
        dict(title="İlk Hackathon Zaferi", description="Bölgesel hackathon'da sürdürülebilirlik uygulaması ile birinci olduk. Takım çalışmasının gücünü gösterdik.",
             category="Başarı", date_label="Ağustos 2022", image_url="hackathon-winners-trophy.png"),
    ]
    for r in rows:
        db.add(TimelineEvents(**r))
    db.commit()

