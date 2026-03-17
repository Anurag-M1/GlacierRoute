"""Resend Client — Email Notifications."""

import os
import resend

class ResendClient:
    def __init__(self):
        self.api_key = os.getenv("RESEND_API_KEY")
        self.from_email = os.getenv("RESEND_FROM_EMAIL", "onboarding@resend.dev")
        
        if not self.api_key:
            print("⚠️ Resend API key not set. Email notifications will be skipped.")
            resend.api_key = None
        else:
            resend.api_key = self.api_key

    def send_welcome_email(self, to_email: str, name: str):
        if not resend.api_key:
            return None
        try:
            params = {
                "from": self.from_email,
                "to": [to_email],
                "subject": "Welcome to GlacierRoute! 🏔️",
                "html": f"<strong>Hello {name},</strong><br>Welcome to GlacierRoute, your AI-powered trip companion. Start planning your next adventure today!",
            }
            email = resend.Emails.send(params)
            return email
        except Exception as e:
            print(f"❌ Resend Welcome Email Error: {e}")
            return None

    def send_trip_summary(self, to_email: str, trip_title: str, plan_summary: str):
        if not resend.api_key:
            return None
        try:
            params = {
                "from": self.from_email,
                "to": [to_email],
                "subject": f"Your Trip Plan: {trip_title} ✈️",
                "html": f"<strong>Here is your trip summary:</strong><p>{plan_summary}</p><br>Happy travels!",
            }
            email = resend.Emails.send(params)
            return email
        except Exception as e:
            print(f"❌ Resend Trip Summary Error: {e}")
            return None

resend_client = ResendClient()
