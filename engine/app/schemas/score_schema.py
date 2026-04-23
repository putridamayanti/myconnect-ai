from typing import List

from pydantic import BaseModel


class AttendeeSchema(BaseModel):
    id: str
    name: str
    headline: str
    bio: str
    role: str
    skills: List[str]
    looking_for: str

class CalculateScoreRequest(BaseModel):
    source: AttendeeSchema
    candidate: AttendeeSchema
