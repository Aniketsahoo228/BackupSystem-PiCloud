def require_pin(pin):
    return isinstance(pin, str) and len(pin) >= 4
