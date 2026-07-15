"""Database connection manager for eStock Web.

Connects DIRECTLY to the existing eStock SQL Server databases.
No SQLite, no ETL, no data duplication — reads/writes the same
tables that e-Stock.exe uses.
"""
from __future__ import annotations

import json
import os
from pathlib import Path
from urllib.parse import quote_plus
from contextlib import contextmanager

import pyodbc


_CONFIG_PATH = Path(__file__).resolve().parents[3] / "config" / "connections.json"


def _load_config() -> dict:
    with open(_CONFIG_PATH, encoding="utf-8") as f:
        return json.load(f)


CONFIG = _load_config()


def _build_connection_string(source: dict) -> str:
    """Build an ODBC connection string from a source config block."""
    driver = source.get("driver", "ODBC Driver 18 for SQL Server")
    server = source.get("server", "")
    database = source.get("database", "stock")
    username = source.get("username", "")
    password = source.get("password", "")
    encrypt = source.get("encrypt", "yes")
    trust = source.get("trust_server_certificate", "yes")

    return (
        f"DRIVER={{{driver}}};"
        f"SERVER={server};"
        f"DATABASE={database};"
        f"UID={username};"
        f"PWD={password};"
        f"Encrypt={encrypt};"
        f"TrustServerCertificate={trust};"
    )


def get_connection(source_name: str = "mashala") -> pyodbc.Connection:
    """Get a pyodbc connection to the named eStock source.
    
    Args:
        source_name: 'mashala' or 'elsanta'
    
    Returns:
        pyodbc.Connection to the eStock SQL Server database
    """
    sources = CONFIG.get("estock_sources", [])
    source = next((s for s in sources if s["name"] == source_name), None)
    if not source:
        raise ValueError(f"Unknown source: {source_name}. Available: {[s['name'] for s in sources]}")
    
    conn_str = _build_connection_string(source)
    return pyodbc.connect(conn_str)


@contextmanager
def db_session(source_name: str = "mashala"):
    """Context manager for database sessions.
    
    Usage:
        with db_session("mashala") as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT ...")
    """
    conn = get_connection(source_name)
    try:
        yield conn
    except Exception:
        conn.rollback()
        raise
    else:
        conn.commit()
    finally:
        conn.close()


def get_all_sources() -> list[str]:
    """Return list of available source names."""
    return [s["name"] for s in CONFIG.get("estock_sources", [])]


def test_connection(source_name: str = "mashala") -> dict:
    """Test connectivity to a source and return status."""
    try:
        with db_session(source_name) as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT @@SERVERNAME AS server, DB_NAME() AS db, GETDATE() AS now")
            row = cursor.fetchone()
            return {
                "status": "connected",
                "source": source_name,
                "server": row.server,
                "database": row.db,
                "server_time": str(row.now),
            }
    except Exception as e:
        return {
            "status": "error",
            "source": source_name,
            "error": str(e),
        }
