from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
# !!! YENİ EKLENEN IMPORT !!!
from fastapi.staticfiles import StaticFiles 
from starlette.middleware.gzip import GZipMiddleware
from dotenv import load_dotenv
import logging, os

load_dotenv()

from app.security import hash_password

from app.routers.timeline import router as timeline_router
from app.routers.events import router as events_router
from app.routers.gallery_events import router as gallery_router
from app.routers.journey import router as journey_router
from app.routers.event_suggestions import router as suggestions_router
from app.routers.community import router as community_router
from app.routers.poster import router as poster_router
from app.routers.blog import router as blog_router
from app.routers.admin_auth import router as admin_auth_router
from app.routers.teams import router as teams_router
from app.routers.crew import router as crew_router

app = FastAPI(title="AYZEK Platform Backend", version="1.0.0")

env_origins = os.getenv("ALLOWED_ORIGINS", "")
ALLOWED_ORIGINS = [o.strip() for o in env_origins.split(",") if o.strip()] or [ 
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://ayzek.tr",
    "http://ayzek.tr",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],  # Tüm metodlara izin ver (GET, POST, PUT, DELETE vb.)
    allow_headers=["*"],  # Tüm başlıklara izin ver
)


app.add_middleware(GZipMiddleware, minimum_size=1024)

# !!! YENİ EKLENEN KISIM BAŞLANGICI !!!
# Resimlerin yükleneceği klasörün var olduğundan emin olalım
os.makedirs("public/uploads", exist_ok=True)

# 'public' klasörünü '/public' URL'sinde sun (mount et)
# Böylece frontend şu adrese erişebilir: http://api-url/public/uploads/resim.jpg
app.mount("/public", StaticFiles(directory="public"), name="public")
# !!! YENİ EKLENEN KISIM BİTİŞİ !!!

logger = logging.getLogger("uvicorn.error")

@app.exception_handler(Exception)
async def all_exception_handler(request: Request, exc: Exception):
    logger.exception("Unhandled error: %s", exc)
    return JSONResponse(status_code=500, content={"detail": "Internal server error"})


app.include_router(timeline_router)
app.include_router(events_router, prefix="/events", tags=["Events"])
app.include_router(gallery_router)
app.include_router(journey_router)
app.include_router(suggestions_router)
app.include_router(community_router)
app.include_router(poster_router)
app.include_router(blog_router)
app.include_router(admin_auth_router)  
app.include_router(teams_router)
app.include_router(crew_router)

@app.get("/")
def root():
    return {"Fatih Emrullah": True}

@app.get("/hash-new-password")
def get_hashed_password():
    # PROD'da kaldır!
    new_password = "ayzek275442"
    return {"hashed_password": hash_password(new_password)}