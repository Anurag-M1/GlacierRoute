"""Auth Router — Registration, login, OTP, token management."""

from fastapi import APIRouter, HTTPException
from schemas.trip import LoginRequest, RegisterRequest, OtpVerify

from core.supabase_client import supabase
from core.resend_client import resend_client

router = APIRouter()


@router.post("/register")
async def register(req: RegisterRequest):
    """Supabase Auth registration and welcome email."""
    try:
        res = supabase.auth.sign_up({
            "email": req.email,
            "password": req.password,
            "options": {
                "data": {
                    "full_name": req.name # Fixed field name from schema
                }
            }
        })
        
        # Send Welcome Email
        resend_client.send_welcome_email(req.email, req.name)
        
        return {"user_id": res.user.id, "email": res.user.email, "message": "Verification email and welcome sent"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/login")
async def login(req: LoginRequest):
    """Supabase Auth sign in."""
    try:
        res = supabase.auth.sign_in_with_password({
            "email": req.email,
            "password": req.password
        })
        return {
            "access_token": res.session.access_token,
            "refresh_token": res.session.refresh_token,
            "expires_in": res.session.expires_in,
            "user": {
                "id": res.user.id,
                "email": res.user.email,
                "name": res.user.user_metadata.get("full_name", ""),
                "role": "user"
            },
        }
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid email or password")


@router.post("/verify-otp")
async def verify_otp(req: OtpVerify):
    if req.otp == "123456":
        return {"verified": True, "message": "Phone verified successfully"}
    raise HTTPException(status_code=400, detail="Invalid OTP")


@router.post("/refresh-token")
async def refresh_token():
    return {"access_token": "new_demo_jwt_token", "expires_in": 900}


@router.post("/logout")
async def logout():
    return {"message": "Logged out successfully"}


@router.get("/me")
async def me():
    return {"id": "usr_demo_001", "email": "demo@glacierroute.in", "name": "Demo User", "role": "user", "avatar_url": None}
