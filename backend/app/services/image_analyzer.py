from app.models.schemas import ImageStats, ColorAnalysisResult, TextDetectionResult
from app.services.color_analyzer import ColorAnalyzer
from app.services.text_detector import TextDetector
from typing import List
import os
from PIL import Image

class ImageAnalyzer:
    def __init__(self):
        """Initialize image analyzer with color and text analysis services"""
        self.color_analyzer = ColorAnalyzer()
        self.text_detector = TextDetector()
    
    def get_image_stats(self, image_path: str) -> ImageStats:
        """Get basic image statistics"""
        with Image.open(image_path) as img:
            return ImageStats(
                width=img.width,
                height=img.height,
                channels=len(img.getbands()),
                file_size=os.path.getsize(image_path),
                format=img.format
            )
    
    async def analyze_colors(self, image_path: str, n_colors: int = 5) -> ColorAnalysisResult:
        """Perform comprehensive color analysis"""
        return await self.color_analyzer.analyze_comprehensive(image_path, n_colors)
    
    async def detect_text(self, image_path: str, business_type: str = "General") -> List[TextDetectionResult]:
        """Perform comprehensive text detection and OCR"""
        return await self.text_detector.detect_text_comprehensive(image_path, business_type)