from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import Base, engine
from app.routers.timeline import router as timeline_router
from app.routers.events import router as events_router
from app.routers.gallery_events import router as gallery_router
from app.routers.team import router as team_router

app = FastAPI(title="AYZEK Platform Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# app.mount satırı tamamen kaldırıldı

@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)

app.include_router(timeline_router, tags=["Timeline"])
app.include_router(events_router, prefix="/events", tags=["Events"])
app.include_router(gallery_router)
app.include_router(team_router)

@app.get("/")
def root():
    return {"Fatih Emrullah": True}