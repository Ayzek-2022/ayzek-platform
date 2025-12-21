from slowapi import Limiter
from slowapi.util import get_remote_address

# Trafik Polisi (IP adresine göre engelleme yapar)
limiter = Limiter(key_func=get_remote_address)