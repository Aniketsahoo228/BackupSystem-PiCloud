from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
import os
import hashlib
import time
import logging
import zlib
from datetime import datetime

from db import init_db, insert_file, get_files
from encryption_utils import encrypt_data

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Init DB
init_db()

# Logging
logging.basicConfig(level=logging.INFO)

UPLOAD_DIR = "cloud_data"
BACKUP_DIR = "backup_copy"

os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(BACKUP_DIR, exist_ok=True)

# =========================
# AUTHENTICATION
# =========================
USERS = {
    "phoneA": "1234",
    "phoneB": "5678"
}

def authenticate(device_id, pin):
    return USERS.get(device_id) == pin


# =========================
# HASH FUNCTION
# =========================
def get_hash(data):
    return hashlib.sha256(data).hexdigest()


# =========================
# COMPRESSION
# =========================
def compress_data(data):
    return zlib.compress(data)

def decompress_data(data):
    return zlib.decompress(data)


# =========================
# HEALTH API
# =========================
@app.get("/health")
def health():
    return {
        "status": "ok",
        "server": "PrivateCloud",
        "time": datetime.now().isoformat()
    }


# =========================
# BACKUP API
# =========================
@app.post("/backup")
async def backup(
    pin: str = Form(...),
    device_id: str = Form(...),
    files: list[UploadFile] = File(...)
):

    if not authenticate(device_id, pin):
        raise HTTPException(status_code=401, detail="Unauthorized")

    start_time = time.time()

    saved = []

    device_folder = os.path.join(UPLOAD_DIR, device_id)
    os.makedirs(device_folder, exist_ok=True)

    for file in files:
        try:
            content = await file.read()

            if not content:
                raise HTTPException(400, "Empty file")

            # Compression
            compressed = compress_data(content)

            # Encryption
            encrypted = encrypt_data(compressed, pin.encode())

            # Hash
            file_hash = get_hash(encrypted)

            file_path = os.path.join(device_folder, file.filename)

            # Save main file
            with open(file_path, "wb") as f:
                f.write(encrypted)

            # Backup copy (fault tolerance)
            backup_path = os.path.join(BACKUP_DIR, file.filename)
            with open(backup_path, "wb") as f:
                f.write(encrypted)

            file_size = len(encrypted)

            insert_file(device_id, pin, file.filename, file_path, file_size)

            logging.info(f"Uploaded: {file.filename}")

            saved.append({
                "name": file.filename,
                "hash": file_hash
            })

        except Exception as e:
            logging.error(str(e))
            return {"status": "failed", "error": str(e)}

    end_time = time.time()

    return {
        "status": "ok",
        "files": saved,
        "upload_time": end_time - start_time
    }


# =========================
# LIST FILES
# =========================
@app.get("/list")
def list_files(pin: str, device_id: str):

    if not authenticate(device_id, pin):
        raise HTTPException(401)

    rows = get_files(device_id, pin)

    result = []
    for r in rows:
        result.append({
            "file_name": r[0],
            "file_path": r[1],
            "size": r[2],
            "time": r[3]
        })

    return {"files": result}


# =========================
# DOWNLOAD
# =========================
@app.get("/download")
def download(file_path: str, pin: str, device_id: str):

    if not authenticate(device_id, pin):
        raise HTTPException(401)

    if not os.path.exists(file_path):
        raise HTTPException(404)

    return FileResponse(file_path, filename=os.path.basename(file_path))


# =========================
# DELETE FILE
# =========================
@app.delete("/delete")
def delete(file_path: str):

    if os.path.exists(file_path):
        os.remove(file_path)

    return {"status": "deleted"}


# =========================
# RECOVERY API
# =========================
@app.get("/recover")
def recover():

    files = os.listdir(BACKUP_DIR)

    return {
        "recovered_files": files
    }


# =========================
# SYNC API (CLOUD FEATURE)
# =========================
@app.get("/sync")
def sync(device_id: str, pin: str):

    if not authenticate(device_id, pin):
        raise HTTPException(401)

    files = get_files(device_id, pin)

    return {
        "sync_data": files,
        "message": "Sync ready"
    }


# =========================
# ROOT
# =========================
@app.get("/")
def root():
    return {"message": "Private Cloud System Running"}
