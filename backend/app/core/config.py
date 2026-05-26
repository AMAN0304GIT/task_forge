from dotenv import load_dotenv
import os

load_dotenv()

class Settings:
    DATABASE_URL = os.getenv("DATABASE_URL")

    JWT_SECRET_KEY = os.getenv(
        "JWT_SECRET_KEY",
        "supersecretkey"
    )

    JWT_ALGORITHM = "HS256"

    ACCESS_TOKEN_EXPIRE_MINUTES = 30

settings = Settings()