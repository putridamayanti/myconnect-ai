from fastapi import APIRouter

from app.api.v1.endpoints import scores

api_router = APIRouter()

api_router.include_router(scores.router, prefix="/scores", tags=["scores"])