from fastapi import APIRouter, HTTPException
from typing import List
import os

from app.models.schemas import TextDetectionResult, TextDetectionRequest
from app.services.text_detector import TextDetector

router = APIRouter()

# Initialize text detector
text_detector = TextDetector()

@router.post("/text-detection", response_model=List[TextDetectionResult])
async def detect_text(request: TextDetectionRequest):
    """Detect and extract text from an image"""
    
    if not os.path.exists(request.image_path):
        raise HTTPException(
            status_code=404,
            detail="Image file not found"
        )
    
    try:
        results = await text_detector.detect_text_comprehensive(
            request.image_path,
            request.business_type
        )
        return results
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Text detection failed: {str(e)}"
        )

@router.get("/text-detection/{image_id}")
async def detect_text_by_id(image_id: str, business_type: str = "General"):
    """Detect text in a specific uploaded image"""
    
    # Find the uploaded file
    from pathlib import Path
    from app.core.config import settings
    
    upload_dir = Path(settings.UPLOAD_DIR)
    matching_files = list(upload_dir.glob(f"{image_id}.*"))
    
    if not matching_files:
        raise HTTPException(
            status_code=404,
            detail="Image not found"
        )
    
    try:
        image_path = str(matching_files[0])
        results = await text_detector.detect_text_comprehensive(image_path, business_type)
        return {"text_results": results}
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Text detection failed: {str(e)}"
        )

@router.get("/text-detection/quality/{image_id}")
async def assess_text_quality(image_id: str, business_type: str = "General"):
    """Assess the quality of detected text"""
    
    # Find the uploaded file
    from pathlib import Path
    from app.core.config import settings
    
    upload_dir = Path(settings.UPLOAD_DIR)
    matching_files = list(upload_dir.glob(f"{image_id}.*"))
    
    if not matching_files:
        raise HTTPException(
            status_code=404,
            detail="Image not found"
        )
    
    try:
        image_path = str(matching_files[0])
        
        # First detect text
        text_results = await text_detector.detect_text_comprehensive(image_path, business_type)
        
        # Then assess quality for each detected text
        quality_results = []
        for text_result in text_results:
            quality_score = text_detector.calculate_text_quality(text_result.text, business_type)
            quality_results.append({
                "text": text_result.text,
                "confidence": text_result.confidence,
                "quality_score": quality_score
            })
        
        return {"quality_results": quality_results}
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Text quality assessment failed: {str(e)}"
        )