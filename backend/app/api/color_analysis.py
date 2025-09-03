from fastapi import APIRouter, HTTPException
from typing import List
import os

from app.models.schemas import ColorAnalysisResult, ColorAnalysisRequest
from app.services.color_analyzer import ColorAnalyzer

router = APIRouter()

# Initialize color analyzer
color_analyzer = ColorAnalyzer()

@router.post("/color-analysis", response_model=ColorAnalysisResult)
async def analyze_colors(request: ColorAnalysisRequest):
    """Perform detailed color analysis on an image"""
    
    if not os.path.exists(request.image_path):
        raise HTTPException(
            status_code=404,
            detail="Image file not found"
        )
    
    try:
        result = await color_analyzer.analyze_comprehensive(
            request.image_path,
            n_colors=request.n_colors
        )
        return result
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Color analysis failed: {str(e)}"
        )

@router.get("/color-analysis/dominant-colors/{image_id}")
async def get_dominant_colors(image_id: str, n_colors: int = 5):
    """Get dominant colors for a specific image"""
    
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
        dominant_colors = await color_analyzer.extract_dominant_colors_async(image_path, n_colors)
        return {"dominant_colors": dominant_colors}
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to extract dominant colors: {str(e)}"
        )

@router.get("/color-analysis/temperature/{image_id}")
async def get_color_temperature(image_id: str):
    """Get color temperature for a specific image"""
    
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
        temperature = await color_analyzer.calculate_color_temperature_async(image_path)
        return {
            "color_temperature": temperature,
            "interpretation": "warm" if temperature > 5500 else "cool"
        }
    
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to calculate color temperature: {str(e)}"
        )