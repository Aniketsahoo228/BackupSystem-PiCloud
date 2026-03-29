#!/usr/bin/env python3
# decrypt_restore.py
import sys
import json
from pathlib import Path
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
import base64

def derive_key(pin: str, salt: bytes, iterations: int = 10000, length: int = 32) -> bytes:
    kdf = PBKDF2HMAC(algorithm=hashes.SHA256(), length=length, salt=salt, iterations=iterations)
    return kdf.derive(pin.encode())

def decrypt_blob_file(path: Path, pin: str) -> bytes:
    data = path.read_bytes()
    if len(data) < 8 + 12:
        raise ValueError("blob too small to contain salt+nonce")
    salt = data[:8]
    nonce = data[8:20]
    ct = data[20:]
    key = derive_key(pin, salt)
    aesgcm = AESGCM(key)
    plaintext = aesgcm.decrypt(nonce, ct, None)
    return plaintext

def main():
    if len(sys.argv) < 4:
        print("Usage: python3 decrypt_restore.py <pin> <in_blob> <out_file_or - for stdout>")
        sys.exit(1)
    pin = sys.argv[1]
    inpath = Path(sys.argv[2])
    out = sys.argv[3]
    plain = decrypt_blob_file(inpath, pin)
    if out == "-":
        sys.stdout.buffer.write(plain)
    else:
        Path(out).write_bytes(plain)
        print(f"Wrote decrypted output to {out}")

if __name__ == "__main__":
    main()
