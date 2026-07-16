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
    allow_origins=[
        "http://localhost:3000", 
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://localhost:5177",
        "http://localhost:5178",
        "http://127.0.0.1:5178"
    ],
    allow_origin_regex="https://.*",

    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os

app.include_router(api_router, prefix="/api")

# Serve the production React frontend
frontend_dist = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "frontend", "dist")
if os.path.exists(frontend_dist):
    app.mount("/assets", StaticFiles(directory=os.path.join(frontend_dist, "assets")), name="assets")
    
    @app.get("/{full_path:path}")
    async def serve_frontend(full_path: str):
        # Serve the requested file if it exists (e.g. logo.png, favicon)
        requested_file = os.path.join(frontend_dist, full_path)
        if os.path.isfile(requested_file):
            return FileResponse(requested_file)
        # Otherwise, fallback to index.html for React Router
        return FileResponse(os.path.join(frontend_dist, "index.html"))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
