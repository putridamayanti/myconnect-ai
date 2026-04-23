from contextlib import asynccontextmanager

from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from app.api.v1.api import api_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("App starting...")

    yield

    print("App shutting down...")


app = FastAPI(
    title="MyConnect API",
)

app.add_middleware(CORSMiddleware)

app.include_router(api_router, prefix="/api/v1")