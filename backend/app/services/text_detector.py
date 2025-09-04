import numpy as np
import cv2
from PIL import Image
import re
from typing import List, Optional
import torch

# Fix PIL compatibility issue for EasyOCR
import PIL.Image
if not hasattr(PIL.Image, 'ANTIALIAS'):
    PIL.Image.ANTIALIAS = PIL.Image.LANCZOS

try:
    import easyocr
    EASYOCR_AVAILABLE = True
except ImportError:
    EASYOCR_AVAILABLE = False

try:
    import pytesseract
    TESSERACT_AVAILABLE = True
except ImportError:
    TESSERACT_AVAILABLE = False

from app.models.schemas import TextDetectionResult

class TextDetector:
    def __init__(self, use_gpu=True):
        """Initialize text detector with OCR engines"""
        self.use_gpu = use_gpu and torch.cuda.is_available()
        self.easyocr_reader = None
        
        if EASYOCR_AVAILABLE:
            try:
                self.easyocr_reader = easyocr.Reader(['en'], gpu=self.use_gpu, verbose=False)
                print("EasyOCR loaded and ready")
            except Exception as e:
                print(f"WARNING: EasyOCR initialization failed: {e}")
                self.easyocr_reader = None
        
        self.min_confidence = 0.3  # Lowered from 0.6 to catch more text
        self.min_length = 1        # Lowered from 2 to catch single characters
    
    def calculate_text_quality(self, text: str, business_type: str = "General") -> float:
        """Calculate text quality with business-specific keywords"""
        if not text or len(text.strip()) < 1:  # Changed from 2 to 1
            return 0.0
        
        text = text.strip()
        score = 50.0
        
        # Length check
        if 3 <= len(text) <= 25:
            score += 15
        elif len(text) > 40:
            score -= 20
        
        # Character composition
        letters = len(re.findall(r'[a-zA-Z]', text))
        digits = len(re.findall(r'[0-9]', text))
        
        if letters > 0:
            letter_ratio = letters / len(text)
            if letter_ratio >= 0.6:
                score += 25
            elif letter_ratio < 0.3:
                score -= 20
        
        # Business-specific keywords bonus
        business_keywords = {
            'Retail': [
                'store', 'shop', 'market', 'boutique', 'outlet', 'mall', 'plaza',
                'sale', 'discount', 'off', 'price', 'deal', 'offer', 'special',
                'open', 'closed', 'hours', 'till', 'until', 'am', 'pm',
                'cash', 'card', 'payment', 'checkout', 'register', 'receipt',
                'new', 'fresh', 'organic', 'local', 'imported', 'premium',
                'clothing', 'fashion', 'apparel', 'shoes', 'accessories',
                'electronics', 'phone', 'computer', 'tech', 'gadget'
            ],
            'Restaurant': [
                'cafe', 'restaurant', 'kitchen', 'bakery', 'house', 'grill',
                'breakfast', 'lunch', 'dinner', 'open', 'closed', 'hours',
                'menu', 'food', 'cuisine', 'falafel', 'alabama', 'hills',
                'mediterranean', 'shawerma', 'delivery', 'takeout'
            ],
            'Salon': [
                'salon', 'spa', 'beauty', 'hair', 'nails', 'massage', 'facial',
                'barbershop', 'barber', 'stylist', 'hairdresser', 'manicure', 'pedicure',
                'cut', 'color', 'style', 'treatment', 'wellness', 'relax',
                'appointment', 'book', 'booking', 'shampoo', 'conditioner'
            ]
        }
        
        # General keywords that apply to all business types
        general_keywords = [
            'open', 'closed', 'hours', 'welcome', 'thank', 'visit', 'service',
            'quality', 'customer', 'staff', 'manager', 'phone', 'call'
        ]
        
        keyword_bonus = 0
        text_lower = text.lower()
        
        # Check business-specific keywords
        if business_type in business_keywords:
            for keyword in business_keywords[business_type]:
                if keyword in text_lower:
                    keyword_bonus += 12
        
        # Check general keywords
        for keyword in general_keywords:
            if keyword in text_lower:
                keyword_bonus += 8
        
        score += min(keyword_bonus, 35)  # Max 35 bonus points
        
        return max(0.0, min(100.0, score)) / 100.0  # Normalize to 0-1
    
    def is_meaningful_text(self, text: str) -> bool:
        """Check if text is meaningful"""
        if not text or len(text.strip()) < 2:
            return False
        
        text = text.strip()
        
        # Basic quality check - lowered threshold
        if self.calculate_text_quality(text) < 0.2:  # Lowered from 0.4 to 0.2
            return False
        
        # Check for noise patterns
        noise_patterns = [
            r'^[^a-zA-Z0-9]+$',        # Only symbols
            r'^[a-zA-Z]{1,2}$',        # Too short
            r'^(.)\1{2,}$',            # Repeated characters
            r'[)(\[\]{}|\\\/]{3,}',    # Multiple brackets
        ]
        
        for pattern in noise_patterns:
            if re.search(pattern, text):
                return False
        
        return True
    
    def clean_text(self, text: str) -> str:
        """Clean extracted text"""
        if not text:
            return ""
        
        # Basic cleaning
        cleaned = ' '.join(text.split())
        cleaned = cleaned.strip('.,;:!?()[]{}"\'-_=+|\\/')
        
        # Simple OCR error corrections
        cleaned = re.sub(r'\b0([a-zA-Z])', r'O\1', cleaned)
        cleaned = re.sub(r'([a-zA-Z])0\b', r'\1O', cleaned)
        
        return cleaned.strip()
    
    def extract_text_easyocr(self, image, business_type: str = "General") -> List[TextDetectionResult]:
        """Extract text using EasyOCR"""
        results = []
        
        if not self.easyocr_reader:
            print("EasyOCR reader not initialized")
            return results
        
        try:
            easyocr_results = self.easyocr_reader.readtext(np.array(image))
            print(f"EasyOCR raw results: {len(easyocr_results)} items")
            
            for (bbox, text, confidence) in easyocr_results:
                print(f"Raw text: '{text}' (confidence: {confidence:.3f})")
                
                if confidence > self.min_confidence:
                    print(f"  - Passed confidence check (>{self.min_confidence})")
                    cleaned = self.clean_text(text)
                    print(f"  - Cleaned text: '{cleaned}'")
                    
                    if cleaned and len(cleaned) >= self.min_length:
                        print(f"  - Passed length check (>={self.min_length})")
                        
                        if self.is_meaningful_text(cleaned):
                            print(f"  - Passed meaningful text check")
                            # Convert bbox to flat list of coordinates
                            flat_bbox = [int(coord) for point in bbox for coord in point]
                            
                            results.append(TextDetectionResult(
                                text=cleaned,
                                confidence=float(confidence),
                                bounding_box=flat_bbox
                            ))
                            print(f"  - Added to results!")
                        else:
                            quality_score = self.calculate_text_quality(cleaned, business_type)
                            print(f"  - Failed meaningful text check (quality: {quality_score:.3f})")
                    else:
                        print(f"  - Failed length check (len={len(cleaned) if cleaned else 0})")
                else:
                    print(f"  - Failed confidence check ({confidence:.3f} <= {self.min_confidence})")
                    
        except Exception as e:
            print(f"EasyOCR error: {e}")
        
        return results
    
    def extract_text_tesseract(self, image, business_type: str = "General") -> List[TextDetectionResult]:
        """Extract text using Tesseract OCR"""
        results = []
        
        if not TESSERACT_AVAILABLE:
            return results
        
        try:
            # Convert PIL image to OpenCV format
            image_cv = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)
            
            # Get detailed OCR data
            data = pytesseract.image_to_data(image_cv, output_type=pytesseract.Output.DICT)
            
            for i in range(len(data['text'])):
                text = data['text'][i].strip()
                confidence = float(data['conf'][i]) / 100.0  # Normalize to 0-1
                
                if confidence > self.min_confidence and text:
                    cleaned = self.clean_text(text)
                    if cleaned and len(cleaned) >= self.min_length and self.is_meaningful_text(cleaned):
                        # Extract bounding box
                        x, y, w, h = data['left'][i], data['top'][i], data['width'][i], data['height'][i]
                        bbox = [x, y, x + w, y, x + w, y + h, x, y + h]  # Convert to 4-point format
                        
                        results.append(TextDetectionResult(
                            text=cleaned,
                            confidence=confidence,
                            bounding_box=bbox
                        ))
        except Exception as e:
            print(f"Tesseract error: {e}")
        
        return results
    
    async def detect_text_comprehensive(self, image_path: str, business_type: str = "General") -> List[TextDetectionResult]:
        """Comprehensive text detection using available OCR engines"""
        print(f"Starting text detection for {image_path}, business_type: {business_type}")
        
        try:
            image = Image.open(image_path).convert('RGB')
            print(f"Image loaded successfully: {image.size}")
        except Exception as e:
            raise Exception(f"Cannot open image {image_path}: {e}")
        
        all_results = []
        
        # Try EasyOCR first (usually better accuracy)
        if self.easyocr_reader:
            print("Using EasyOCR for text detection...")
            easyocr_results = self.extract_text_easyocr(image, business_type)
            print(f"EasyOCR found {len(easyocr_results)} results")
            all_results.extend(easyocr_results)
        else:
            print("EasyOCR not available")
        
        # If no results from EasyOCR, try Tesseract
        if not all_results and TESSERACT_AVAILABLE:
            print("No EasyOCR results, trying Tesseract...")
            tesseract_results = self.extract_text_tesseract(image, business_type)
            print(f"Tesseract found {len(tesseract_results)} results")
            all_results.extend(tesseract_results)
        elif not all_results:
            print("No OCR engines available or produced results")
        
        # Remove duplicates and sort by confidence
        unique_results = []
        seen_texts = set()
        
        for result in sorted(all_results, key=lambda x: x.confidence, reverse=True):
            if result.text.lower() not in seen_texts:
                seen_texts.add(result.text.lower())
                unique_results.append(result)
        
        print(f"Final unique results: {len(unique_results)}")
        for result in unique_results:
            print(f"  - '{result.text}' (confidence: {result.confidence:.2f})")
        
        return unique_results