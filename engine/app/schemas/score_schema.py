from typing import List, Optional

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

class CalculateScoreResponse(BaseModel):
    candidate_id: str
    score: int
    reason: str
    error: Optional[str] = None