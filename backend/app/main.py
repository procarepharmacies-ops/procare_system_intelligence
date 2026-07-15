"""eStock Web — FastAPI backend.

Connects directly to the existing eStock SQL Server databases.
No data duplication — the web app and desktop app share the same data.
"""
from __future__ import annotations

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import router as api_router
from app.db.connection import test_connection, get_all_sources


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup: verify SQL Server connectivity."""
    print("\n" + "=" * 60)
    print("  eStock Web — Starting Backend")
    print("=" * 60)
    for source in get_all_sources():
        result = test_connection(source)
        status = "✅" if result["status"] == "connected" else "❌"
        print(f"  {status} {source}: {result.get('server', result.get('error', 'unknown'))}")
    print("=" * 60 + "\n")
    yield


app = FastAPI(
    title="eStock Web API",
    description="Web mirror of eStock Pharmacy — direct SQL Server connection",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
