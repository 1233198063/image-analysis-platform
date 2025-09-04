from pydantic import BaseModel
from typing import List, Dict, Optional, Any
from datetime import datetime

class BusinessType(BaseModel):
    name: str
    description: str

class ColorInfo(BaseModel):
    rgb: List[int]
    hex: str
    percentage: float

class ColorAnalysisResult(BaseModel):
    dominant_colors: List[ColorInfo]
    color_temperature: float
    color_harmony_score: float
    brightness: float
    contrast: float
    saturation: float

class TextDetectionResult(BaseModel):
    text: str
    confidence: float
    bounding_box: List[int]

class ImageStats(BaseModel):
    width: int
    height: int
    channels: int
    file_size: int
    format: str

class AnalysisResult(BaseModel):
    id: str
    filename: str
    business_type: Optional[str] = None
    upload_time: datetime
    image_stats: ImageStats
    color_analysis: Optional[ColorAnalysisResult] = None
    text_detection: Optional[List[TextDetectionResult]] = None
    processing_time: float

class UploadResponse(BaseModel):
    file_id: str
    filename: str
    file_path: str
    message: str

class ErrorResponse(BaseModel):
    error: str
    detail: Optional[str] = None

class AnalysisRequest(BaseModel):
    image_id: str
    business_type: Optional[str] = None
    analysis_types: List[str] = ["color", "text"]  # Types of analysis to perform

class ColorAnalysisRequest(BaseModel):
    image_path: str
    n_colors: int = 5

class TextDetectionRequest(BaseModel):
    image_path: str
    business_type: str = "General"