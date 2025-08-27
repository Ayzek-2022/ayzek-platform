from sqlalchemy import Column, Integer, String, Text, DateTime, func, Date, ARRAY
from app.database import Base
from  datetime import datetime

class TimelineEvents(Base):
    __tablename__ = "timeline_events"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    category = Column(String, nullable=False)
    date_label = Column(String, nullable=False)  # "Mart 2024" gibi
    image_url = Column(String, nullable=False)

class Event(Base):
    __tablename__ = "events"
    id = Column(Integer, primary_key=True)
    slug = Column(String(200), unique=True, index=True, nullable=False)  # URL için
    title = Column(String(200), nullable=False)                          # Başlık
    description = Column(Text, nullable=False)                           # Açıklama
    cover_image_url = Column(Text, nullable=False)                       # Fotoğraf
    start_at = Column(DateTime, nullable=False)                          # Tarih+Saat
    location = Column(String(200), nullable=False)                       # Konum
    category = Column(String(50), nullable=False)                        # Workshop/Meetup vb.
    capacity = Column(Integer, nullable=False, default=60)               # Max (örn: 60)
    registered = Column(Integer, nullable=False, default=0)              # Şu anki (örn: 45)
    whatsapp_link = Column(Text, nullable=False)                         # “Şimdi Kaydol” gideceği link
    tags = Column(String(200), nullable=True)                            # "AI,Machine Learning,Python"
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)

class GalleryEvent(Base):
    __tablename__ = "gallery_events"

    id = Column(Integer, primary_key=True, index=True)
    category = Column(String(50), nullable=False)          # Workshop / Hackathon / Networking ...
    image_url = Column(Text, nullable=False)                # S3 / CDN / public URL
    title = Column(String(150), nullable=False)
    description = Column(Text, nullable=False)
    date = Column(Date, nullable=False)                     # 2025-05-13 gibi
    location = Column(String(120), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class TeamMember(Base):
    __tablename__ = "team_members"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, nullable=False)
    role = Column(String, nullable=False)  # Designer, BIGG BOSS vs.
    description = Column(Text, nullable=True)
    tags = Column(ARRAY(String))  # ["Liderlik", "Tam Yığın Geliştirme", "Topluluk Oluşturma"]
    image_url = Column(String, nullable=True)
    linkedin_url = Column(String, nullable=True)
    github_url = Column(String, nullable=True)


    