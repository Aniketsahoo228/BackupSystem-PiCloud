from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
import os
import sys

def derive_key(pin: str, salt: bytes) -> bytes:
    kdf = PBKDF2HMAC(
        algorithm=hashes.SHA256(),
        length=32,
        salt=salt,
        iterations=10000
    )
    return kdf.derive(pin.encode())

def encrypt_file(pin: str, infile: str, outfile: str):
    data = open(infile, "rb").read()
    salt = os.urandom(8)
    nonce = os.urandom(12)
    
    key = derive_key(pin, salt)
    aes = AESGCM(key)
    ct = aes.encrypt(nonce, data, None)

    with open(outfile, "wb") as f:
        f.write(salt + nonce + ct)

    print(f"Encrypted {infile} → {outfile}")

if __name__ == "__main__":
    if len(sys.argv) < 4:
        print("Usage: python3 encrypt.py <pin> <input_file> <output_file>")
        sys.exit(1)

    encrypt_file(sys.argv[1], sys.argv[2], sys.argv[3])

