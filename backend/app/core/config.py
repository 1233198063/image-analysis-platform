from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    PROJECT_NAME: str = "Business Image Analysis Platform"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    
    # CORS settings
    ALLOWED_HOSTS: List[str] = ["http://localhost:3000", "http://127.0.0.1:3000"]
    
    # Upload settings
    MAX_UPLOAD_SIZE: int = 10 * 1024 * 1024  # 10MB
    ALLOWED_IMAGE_EXTENSIONS: List[str] = [".jpg", ".jpeg", ".png", ".bmp", ".tiff"]
    UPLOAD_DIR: str = "uploads"
    
    # Business types
    BUSINESS_TYPES: List[str] = ["Retail", "Restaurant", "Salon"]
    
    # Style types
    STYLE_TYPES: List[str] = [
        "Original_Image",
        "Style1_BrightEyeCatching", 
        "Style2_ClearWarm",
        "Style3_VividColorful",
        "Style4_CozyNatural"
    ]
    
    # Analysis settings
    DEFAULT_DOMINANT_COLORS: int = 5
    MAX_TEXT_LENGTH: int = 1000
    
    class Config:
        env_file = ".env"

settings = Settings()