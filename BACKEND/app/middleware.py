from fastapi import Request, status
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware

from .security import decode_access_token

class JWTMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, protected_paths=None, excluded_paths=None):
        super().__init__(app)
        self.protected_paths = protected_paths or ["/admin"]
        self.excluded_paths = set(excluded_paths or ["/admin/login", "/docs", "/redoc", "/openapi.json"])

    async def dispatch(self, request: Request, call_next):
        path = request.url.path

        is_protected = any(path.startswith(p) for p in self.protected_paths)
        if is_protected and path not in self.excluded_paths:
            auth = request.headers.get("Authorization")
            if not auth or not auth.startswith("Bearer "):
                return JSONResponse(status_code=status.HTTP_401_UNAUTHORIZED,
                                    content={"detail": "Missing or invalid authorization header"})
            token = auth.split(" ", 1)[1]
            payload = decode_access_token(token)
            if payload is None:
                return JSONResponse(status_code=status.HTTP_401_UNAUTHORIZED,
                                    content={"detail": "Invalid or expired token"})
            request.state.current_user_email = payload.get("sub")

        return await call_next(request)
