import sqlite3
from datetime import datetime

DB_NAME = "cloud.db"

def get_connection():
    return sqlite3.connect(DB_NAME)


def init_db():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS backups (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        device_id TEXT,
        pin TEXT,
        file_name TEXT,
        file_path TEXT,
        file_size INTEGER,
        timestamp TEXT
    )
    """)

    conn.commit()
    conn.close()


def insert_file(device_id, pin, file_name, file_path, file_size):
    conn = get_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("""
        INSERT INTO backups (device_id, pin, file_name, file_path, file_size, timestamp)
        VALUES (?, ?, ?, ?, ?, ?)
        """, (
            device_id,
            pin,
            file_name,
            file_path,
            file_size,
            datetime.now().isoformat()
        ))
        conn.commit()
    except:
        conn.rollback()
    finally:
        conn.close()


def get_files(device_id, pin):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
    SELECT file_name, file_path, file_size, timestamp
    FROM backups
    WHERE device_id=? AND pin=?
    """, (device_id, pin))

    rows = cursor.fetchall()
    conn.close()

    return rows
