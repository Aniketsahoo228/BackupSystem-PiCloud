"""
Test client that simulates a phone:
- Derives key from PIN using PBKDF2 (salt 8 bytes)
- Encrypts plaintext with AES-GCM
- Uploads to server as multipart form file parts (contacts, sms)
File format uploaded: [salt(8)][nonce(12)][ciphertext+tag]
"""
import os
import requests
import json
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
import base64
import secrets

PI_URL = "http://172.28.23.9:8000"   # <<== REPLACE with your Pi IP before running

def derive_key(pin: str, salt: bytes, iterations: int = 10000, length: int = 32) -> bytes:
    kdf = PBKDF2HMAC(algorithm=hashes.SHA256(), length=length, salt=salt, iterations=iterations)
    return kdf.derive(pin.encode())

def encrypt_and_pack(plaintext_bytes: bytes, key: bytes) -> bytes:
    aesgcm = AESGCM(key)
    nonce = os.urandom(12)
    ct = aesgcm.encrypt(nonce, plaintext_bytes, None)  # returns ciphertext+tag
    return nonce + ct  # nonce(12) + ct

def build_upload_blob(plaintext_bytes: bytes, pin: str) -> bytes:
    salt = secrets.token_bytes(8)  # 8-byte salt
    key = derive_key(pin, salt)
    packed = encrypt_and_pack(plaintext_bytes, key)
    return salt + packed  # salt(8) + nonce(12) + ct

def main():
    pin = input("Enter PIN to use for encryption (demo): ").strip() or "1234"
    device_id = "test-client-1"

    # sample contacts and sms
    contacts = [{"name":"Alice", "number":"+911234567890"}, {"name":"Bob","number":"+919876543210"}]
    sms = [{"from":"+911234567890","body":"Hello from Pi demo"}, {"from":"+919876543210","body":"Backup test"}]

    contacts_blob = build_upload_blob(json.dumps(contacts).encode("utf-8"), pin)
    sms_blob = build_upload_blob(json.dumps(sms).encode("utf-8"), pin)

    # write local copies for inspection (optional)
    with open("contacts.enc", "wb") as f: f.write(contacts_blob)
    with open("sms.enc", "wb") as f: f.write(sms_blob)

    files = {
        "contacts": ("contacts.enc", contacts_blob, "application/octet-stream"),
        "sms": ("sms.enc", sms_blob, "application/octet-stream"),
    }

    data = {"pin": pin, "device_id": device_id}
    print("Uploading to:", PI_URL)
    r = requests.post(PI_URL + "/backup", data=data, files=files)
    print("Server response:", r.status_code, r.text)

if __name__ == "__main__":
    main()
