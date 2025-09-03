import numpy as np
import cv2
from PIL import Image, ImageStat
from sklearn.cluster import KMeans
from typing import List

from app.models.schemas import ColorAnalysisResult, ColorInfo

class ColorAnalyzer:
    def __init__(self):
        """Initialize color analyzer"""
        pass
    
    def analyze_basic_stats(self, image):
        """Analyze basic color statistics"""
        stat = ImageStat.Stat(image)
        mean = stat.mean  # Average RGB values
        stddev = stat.stddev  # Standard deviation of RGB
        
        brightness = np.mean(mean)
        contrast = np.mean(stddev)
        
        # Calculate saturation from RGB values
        image_np = np.array(image)
        saturation = self._calculate_saturation(image_np)
        
        return brightness, contrast, saturation
    
    def _calculate_saturation(self, image_np):
        """Calculate average saturation of image"""
        # Convert to HSV to get saturation values
        hsv = cv2.cvtColor(image_np, cv2.COLOR_RGB2HSV)
        saturation = np.mean(hsv[:, :, 1]) / 255.0  # Normalize to 0-1
        return saturation
    
    def extract_dominant_colors(self, image, n_colors=5):
        """Extract dominant colors using K-means clustering"""
        try:
            # Convert image to numpy array and reshape
            image_np = np.array(image)
            pixels = image_np.reshape(-1, 3)
            
            # Apply K-means clustering
            kmeans = KMeans(n_clusters=n_colors, random_state=42, n_init=10)
            kmeans.fit(pixels)
            
            # Get cluster centers (dominant colors) and labels
            colors = kmeans.cluster_centers_.astype(int)
            labels = kmeans.labels_
            
            # Count pixels in each cluster
            unique_labels, counts = np.unique(labels, return_counts=True)
            
            # Calculate percentages
            total_pixels = len(pixels)
            percentages = (counts / total_pixels) * 100
            
            # Sort by percentage
            sorted_indices = np.argsort(percentages)[::-1]
            
            dominant_colors = []
            for i in sorted_indices:
                dominant_colors.append(ColorInfo(
                    rgb=colors[i].tolist(),
                    hex='#{:02x}{:02x}{:02x}'.format(colors[i][0], colors[i][1], colors[i][2]),
                    percentage=float(percentages[i])
                ))
            
            return dominant_colors
            
        except Exception as e:
            print(f"Error in dominant color extraction: {e}")
            return []
    
    def calculate_color_temperature(self, image):
        """Calculate approximate color temperature"""
        # Convert to numpy array
        image_np = np.array(image)
        
        # Calculate average RGB values
        avg_r = np.mean(image_np[:, :, 0])
        avg_g = np.mean(image_np[:, :, 1])
        avg_b = np.mean(image_np[:, :, 2])
        
        # Simple color temperature estimation
        # Warmer images have higher red/yellow content
        warmth_index = (avg_r + avg_g) / (avg_b + 1)  # Add 1 to avoid division by zero
        
        # Convert to approximate temperature scale (3000K-10000K)
        temperature = 3000 + (warmth_index - 1) * 2000
        temperature = max(3000, min(10000, temperature))
        
        return float(temperature)
    
    def calculate_color_harmony(self, dominant_colors):
        """Calculate color harmony metrics"""
        if len(dominant_colors) < 2:
            return 0.0
        
        # Extract RGB values
        colors_rgb = [color.rgb for color in dominant_colors[:5]]
        
        # Convert to HSV for better color analysis
        colors_hsv = []
        for rgb in colors_rgb:
            rgb_norm = np.array(rgb) / 255.0
            hsv = cv2.cvtColor(np.uint8([[[rgb[0], rgb[1], rgb[2]]]]), cv2.COLOR_RGB2HSV)[0][0]
            colors_hsv.append(hsv)
        
        # Calculate hue differences
        hues = [hsv[0] for hsv in colors_hsv]
        hue_diffs = []
        
        for i in range(len(hues)):
            for j in range(i+1, len(hues)):
                diff = abs(hues[i] - hues[j])
                diff = min(diff, 180 - diff)  # Circular distance on hue wheel
                hue_diffs.append(diff)
        
        if not hue_diffs:
            return 0.5
        
        avg_hue_diff = np.mean(hue_diffs)
        
        # Determine harmony score (0-1 scale)
        if avg_hue_diff < 30:
            harmony_score = 0.9  # Monochromatic
        elif avg_hue_diff < 60:
            harmony_score = 0.85  # Analogous
        elif 60 <= avg_hue_diff <= 90:
            harmony_score = 0.8  # Triadic
        elif 120 <= avg_hue_diff <= 180:
            harmony_score = 0.75  # Complementary
        else:
            harmony_score = 0.6  # Complex
        
        return float(harmony_score)
    
    async def analyze_comprehensive(self, image_path: str, n_colors: int = 5) -> ColorAnalysisResult:
        """Comprehensive color analysis of an image"""
        try:
            image = Image.open(image_path).convert('RGB')
        except Exception as e:
            raise Exception(f"Cannot open image {image_path}: {e}")
        
        # Basic statistics
        brightness, contrast, saturation = self.analyze_basic_stats(image)
        
        # Dominant colors
        dominant_colors = self.extract_dominant_colors(image, n_colors)
        
        # Color temperature
        color_temperature = self.calculate_color_temperature(image)
        
        # Color harmony
        color_harmony_score = self.calculate_color_harmony(dominant_colors)
        
        return ColorAnalysisResult(
            dominant_colors=dominant_colors,
            color_temperature=color_temperature,
            color_harmony_score=color_harmony_score,
            brightness=float(brightness),
            contrast=float(contrast),
            saturation=saturation
        )
    
    async def extract_dominant_colors_async(self, image_path: str, n_colors: int) -> List[ColorInfo]:
        """Async wrapper for dominant color extraction"""
        image = Image.open(image_path).convert('RGB')
        return self.extract_dominant_colors(image, n_colors)
    
    async def calculate_color_temperature_async(self, image_path: str) -> float:
        """Async wrapper for color temperature calculation"""
        image = Image.open(image_path).convert('RGB')
        return self.calculate_color_temperature(image)