from pydantic import BaseModel, ConfigDict

class TimelineEventOut(BaseModel):
    id: int
    title: str
    description: str
    category: str
    date_label: str
    image_url: str

    # v2'de orm_mode yerine:
    model_config = ConfigDict(from_attributes=True)
    # Alternatif: model_config = {"from_attributes": True}

