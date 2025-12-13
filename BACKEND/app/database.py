from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os
from pathlib import Path
from dotenv import load_dotenv

ENV_PATH = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(dotenv_path=ENV_PATH)

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise RuntimeError(
        "DATABASE_URL bulunamadı. backend/.env dosyanızı kontrol edin. "
        "Örn: DATABASE_URL=postgresql+psycopg2://postgres:PAROLA@127.0.0.1:5432/ayzek_db"
    )

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
    pool_size=10,
    max_overflow=20,
    pool_recycle=1800,
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


#from sqlalchemy import create_engine
#from sqlalchemy.orm import sessionmaker, declarative_base
#from pathlib import Path
#import os
#from dotenv import load_dotenv

#ENV_PATH = Path(__file__).resolve().parent.parent / ".env"
#load_dotenv(dotenv_path = ENV_PATH)

#DATABASE_URL = os.getenv("DATABASE_URL")
#if not DATABASE_URL:
#   raise RuntimeError(
#       "DATABASE_URL bulunamadı.")

#engine = create_engine(
#   DATABASE_URL,
#   pool_pre_ping = True,
#   pool_size = 10,
#   max_overflow = 20, 
#   pool_recycle = 1800,
#)

#SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

#Base = declarative_base()

#def get_db():
#   db = SessionLocal()
#   try:
#       yield db
#   finally:
#       db.close()