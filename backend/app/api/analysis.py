from fastapi import APIRouter, HTTPException
from typing import List, Optional
import os
import time
from datetime import datetime
from pathlib import Path

from app.models.schemas import AnalysisResult, AnalysisRequest, ImageStats
from app.services.image_analyzer import ImageAnalyzer
from app.core.config import settings

router = APIRouter()

# Initialize the image analyzer
image_analyzer = ImageAnalyzer()

@router.post("/analysis", response_model=AnalysisResult)
async def analyze_image(request: AnalysisRequest):
    """Perform comprehensive analysis on an uploaded image"""
    
    # Find the uploaded file
    upload_dir = Path(settings.UPLOAD_DIR)
    matching_files = list(upload_dir.glob(f"{request.image_id}.*"))
    
    if not matching_files:
        raise HTTPException(
            status_code=404,
            detail="Image not found"
        )
    
    image_path = str(matching_files[0])
    
    try:
        start_time = time.time()
        
        # Get image stats
        image_stats = image_analyzer.get_image_stats(image_path)
        
        # Initialize result
        result = AnalysisResult(
            id=request.image_id,
            filename=matching_files[0].name,
            business_type=request.business_type,
            upload_time=datetime.fromtimestamp(matching_files[0].stat().st_ctime),
            image_stats=image_stats,
            processing_time=0.0
        )
        
        # Perform requested analyses
        if "color" in request.analysis_types:
            result.color_analysis = await image_analyzer.analyze_colors(image_path)
        
        if "text" in request.analysis_types:
            result.text_detection = await image_analyzer.detect_text(
                image_path, 
                request.business_type or "General"
            )
        
        # Calculate processing time
        result.processing_time = time.time() - start_time
        
        return result
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Analysis failed: {str(e)}"
        )

@router.get("/analysis/{image_id}", response_model=AnalysisResult)
async def get_analysis_result(image_id: str):
    """Retrieve analysis result for a specific image"""
    
    # For now, we'll re-run the analysis since we're not storing results
    # In a production app, you'd store these in a database
    request = AnalysisRequest(
        image_id=image_id,
        analysis_types=["color", "text"]
    )
    return await analyze_image(request)

@router.get("/business-types")
async def get_business_types():
    """Get list of supported business types"""
    return {
        "business_types": [
            {"name": "Retail", "description": "Retail stores and shops"},
            {"name": "Restaurant", "description": "Restaurants and food service"},
            {"name": "Salon", "description": "Beauty salons and spas"},
            {"name": "General", "description": "General purpose analysis"}
        ]
    }

@router.get("/analysis-types")
async def get_analysis_types():
    """Get list of available analysis types"""
    return {
        "analysis_types": [
            {"name": "color", "description": "Color analysis including dominant colors, temperature, and harmony"},
            {"name": "text", "description": "Text detection and OCR extraction"}
        ]
    }