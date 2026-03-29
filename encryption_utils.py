from cryptography.fernet import Fernet
import base64
import hashlib

def generate_key(pin: bytes):
    return base64.urlsafe_b64encode(hashlib.sha256(pin).digest())

def encrypt_data(data: bytes, pin: bytes):
    key = generate_key(pin)
    f = Fernet(key)
    return f.encrypt(data)
