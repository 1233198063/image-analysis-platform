# 🎨 Business Image Analysis Platform

A full-stack TypeScript/Python web application for analyzing business images with AI-powered color analysis, text detection, and comprehensive image insights. This platform provides REST APIs and an intuitive web interface for analyzing retail, restaurant, and salon images.

## 🚀 Quick Start

### Option 1: One-Click Setup (Recommended)

**Windows:**
```bash
# Double-click to run the automated setup
start_all.bat
```

### Option 2: Manual Setup

**1. Start Backend:**
```bash
# Navigate to project root
cd "C:\Users\19257\Desktop\Image Analysis Platform"

# Double-click or run:
start_backend.bat
```

**2. Start Frontend:**
```bash
# In a new terminal window, run:
start_frontend.bat
```

### Option 3: Manual Commands

**Backend:**
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

**Frontend:**
```bash
cd frontend
npm install
npm start
```

### Option 4: Docker (If Available)
```bash
docker-compose up --build
```

## 🌐 Access URLs

After successful startup:

- **🖥️ Frontend Application**: http://localhost:3001
- **🔧 Backend API**: http://localhost:8000
- **📚 API Documentation**: http://localhost:8000/docs
- **❤️ Health Check**: http://localhost:8000/health

## 📁 Project Structure

```
📦 Image Analysis Platform
├── 🐍 backend/                    # FastAPI Python Backend
│   ├── app/
│   │   ├── api/                   # REST API endpoints
│   │   │   ├── analysis.py        # Comprehensive analysis
│   │   │   ├── color_analysis.py  # Color-specific analysis
│   │   │   ├── text_detection.py  # OCR text extraction
│   │   │   └── upload.py          # Image upload handling
│   │   ├── core/
│   │   │   └── config.py          # Application configuration
│   │   ├── models/
│   │   │   └── schemas.py         # Pydantic data models
│   │   ├── services/              # Business logic services
│   │   │   ├── color_analyzer.py  # Color analysis algorithms
│   │   │   ├── image_analyzer.py  # Core image processing
│   │   │   └── text_detector.py   # OCR processing
│   │   └── main.py                # FastAPI application entry
│   ├── uploads/                   # Image storage directory
│   ├── requirements.txt           # Python dependencies
│   ├── start.py                   # Backend startup script
│   └── Dockerfile                # Docker configuration
├── ⚛️ frontend/                    # React TypeScript Frontend
│   ├── src/
│   │   ├── components/            # Reusable React components
│   │   ├── pages/                 # Main application pages
│   │   │   ├── HomePage.tsx       # Dashboard with health status
│   │   │   ├── UploadPage.tsx     # Image upload interface
│   │   │   ├── AnalysisPage.tsx   # Analysis results display
│   │   │   ├── ColorAnalysisPage.tsx  # Color-specific analysis
│   │   │   └── TextDetectionPage.tsx  # OCR results
│   │   ├── services/
│   │   │   └── api.ts             # TypeScript API client
│   │   └── utils/                 # Utility functions
│   ├── public/                    # Static assets
│   ├── package.json               # Node.js dependencies
│   ├── tsconfig.json              # TypeScript configuration
│   ├── .env                       # Environment variables
│   └── Dockerfile                 # Docker configuration
├── 🛠️ Configuration Files
│   ├── start_all.bat              # Windows one-click startup
│   ├── start_backend.bat          # Backend-only startup
│   ├── start_frontend.bat         # Frontend-only startup
│   ├── SETUP.md                   # Detailed setup guide
│   └── docker-compose.yml         # Multi-container orchestration
```

## ✨ Features

### 🎨 Color Analysis
- **Dominant Color Extraction**: K-means clustering to identify primary colors
- **Color Temperature Analysis**: Warm/cool tone classification with Kelvin values
- **Color Harmony Assessment**: Analyze color relationships and aesthetic appeal
- **Visual Metrics**: Brightness, contrast, and saturation analysis
- **Interactive Color Palettes**: Visual representation of extracted colors

### 📝 Text Detection & OCR
- **Multi-Engine OCR**: EasyOCR and Tesseract for robust text extraction
- **Business-Specific Analysis**: Industry-tailored text quality assessment
- **Confidence Scoring**: ML-based confidence ratings for detected text
- **Bounding Box Localization**: Precise text position information
- **Quality Metrics**: Readability, clarity, and completeness scores

### 🏢 Business Intelligence
- **Industry-Specific Analysis**: Tailored for retail, restaurant, and salon imagery
- **Quality Assessment**: Business context-aware scoring algorithms
- **Export Capabilities**: JSON export of comprehensive analysis results
- **Real-time Processing**: Live analysis with progress indicators

### 🌐 Modern Web Interface
- **TypeScript Frontend**: Type-safe React application
- **Responsive Design**: Ant Design components for consistent UI/UX
- **Drag & Drop Upload**: Intuitive file upload with preview
- **Real-time Health Monitoring**: Backend connectivity status
- **Interactive Charts**: Visual representation of analysis results

## 🛠 Technology Stack

### Backend (Python)
- **🚀 Framework**: FastAPI (high-performance async API)
- **🖼️ Computer Vision**: OpenCV, PIL/Pillow for image processing
- **🤖 Machine Learning**: scikit-learn (K-means clustering)
- **📖 OCR Engines**: EasyOCR, Tesseract OCR
- **📊 Data Processing**: NumPy, Pandas for data manipulation
- **⚡ Web Server**: Uvicorn ASGI server
- **🔄 Async Support**: Native async/await patterns

### Frontend (TypeScript)
- **⚛️ Framework**: React 18 with TypeScript
- **🎨 UI Library**: Ant Design (comprehensive component library)
- **🌐 HTTP Client**: Axios with TypeScript support
- **🛣️ Routing**: React Router v6
- **📈 Charts**: Chart.js via react-chartjs-2
- **📁 File Upload**: react-dropzone for drag & drop
- **🔧 Build Tool**: Create React App with TypeScript template

### Infrastructure & DevOps
- **🐳 Containerization**: Docker & Docker Compose ready
- **🌐 Web Server**: Nginx for production frontend
- **🔗 CORS**: Configured for cross-origin requests
- **⚙️ Environment**: Environment-based configuration
- **📦 Package Management**: pip (Python), npm (Node.js)

## 📊 API Documentation

### Interactive Documentation
Once the backend is running:
- **📖 Swagger UI**: http://localhost:8000/docs
- **📘 ReDoc**: http://localhost:8000/redoc

### Core API Endpoints

| Method | Endpoint | Description | Parameters |
|--------|----------|-------------|------------|
| `GET` | `/health` | Health check | None |
| `POST` | `/api/upload` | Upload image file | `file: multipart/form-data` |
| `DELETE` | `/api/upload/{file_id}` | Delete uploaded image | `file_id: string` |
| `GET` | `/api/uploads` | List uploaded images | None |
| `POST` | `/api/analysis` | Comprehensive analysis | `image_id, business_type, analysis_types` |
| `GET` | `/api/analysis/{image_id}` | Get analysis results | `image_id: string` |
| `POST` | `/api/color-analysis` | Color analysis | `image_path, n_colors` |
| `GET` | `/api/color-analysis/dominant-colors/{image_id}` | Extract dominant colors | `image_id, n_colors` |
| `GET` | `/api/color-analysis/temperature/{image_id}` | Color temperature | `image_id` |
| `POST` | `/api/text-detection` | OCR text extraction | `image_path, business_type` |
| `GET` | `/api/text-detection/{image_id}` | Text detection by ID | `image_id, business_type` |
| `GET` | `/api/text-detection/quality/{image_id}` | Text quality assessment | `image_id, business_type` |
| `GET` | `/api/business-types` | Supported business types | None |
| `GET` | `/api/analysis-types` | Available analysis types | None |

## 🔧 Configuration

### Environment Variables

**Backend Configuration:**
Create `.env` file in `backend/` directory:
```env
# CORS Settings
ALLOWED_HOSTS=["http://localhost:3001", "http://localhost:3000"]

# Upload Configuration
UPLOAD_DIR=uploads
MAX_UPLOAD_SIZE=10485760  # 10MB

# Analysis Settings
DEFAULT_DOMINANT_COLORS=5
MIN_CONFIDENCE_THRESHOLD=0.6
```

**Frontend Configuration:**
The `.env` file in `frontend/` directory:
```env
PORT=3001
REACT_APP_API_URL=http://localhost:8000
```

### API Configuration
The TypeScript API client automatically configures the base URL:
```typescript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
```

## 🧪 Usage Examples

### 1. Health Check
```bash
curl http://localhost:8000/health
# Response: {"status": "healthy"}
```

### 2. Upload and Analyze Image
```bash
# Upload image
curl -X POST "http://localhost:8000/api/upload" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@business-image.jpg"

# Comprehensive analysis
curl -X POST "http://localhost:8000/api/analysis" \
  -H "Content-Type: application/json" \
  -d '{
    "image_id": "your-image-id", 
    "business_type": "Retail",
    "analysis_types": ["color", "text"]
  }'
```

### 3. Color Analysis
```bash
# Get dominant colors
curl -X GET "http://localhost:8000/api/color-analysis/dominant-colors/your-image-id?n_colors=5"

# Get color temperature
curl -X GET "http://localhost:8000/api/color-analysis/temperature/your-image-id"
```

### 4. Text Detection
```bash
# Detect text with business context
curl -X GET "http://localhost:8000/api/text-detection/your-image-id?business_type=Restaurant"

# Assess text quality
curl -X GET "http://localhost:8000/api/text-detection/quality/your-image-id?business_type=Salon"
```

## 📋 System Requirements

### Minimum Requirements
- **Operating System**: Windows 10+, macOS 10.14+, or Linux
- **Python**: 3.8 or higher
- **Node.js**: 16.0 or higher  
- **Memory**: 4GB RAM (8GB recommended)
- **Storage**: 2GB available space
- **Network**: Internet connection for initial setup

### Recommended Hardware
- **CPU**: Multi-core processor (quad-core recommended)
- **Memory**: 8GB+ RAM for optimal performance
- **Storage**: SSD for faster image processing
- **GPU**: CUDA-compatible GPU (optional, for accelerated OCR)

### Dependencies

**Python Backend:**
```txt
fastapi>=0.116.1        # Modern async web framework
uvicorn>=0.35.0        # ASGI server
pydantic>=2.11.7       # Data validation
pillow==10.0.1         # Image processing
opencv-python==4.8.1.78  # Computer vision
scikit-learn==1.3.0   # Machine learning
easyocr==1.7.0         # OCR engine
pytesseract==0.3.10    # Tesseract OCR wrapper
numpy==1.25.2          # Numerical computing
pandas==2.1.1          # Data manipulation
```

**TypeScript Frontend:**
```json
{
  "react": "^18.2.0",           // UI framework
  "typescript": "^5.0.0",       // Type safety
  "antd": "^5.11.0",           // UI component library
  "axios": "^1.6.0",           // HTTP client
  "react-chartjs-2": "^5.2.0", // Chart components
  "react-dropzone": "^14.2.3", // File upload
  "react-router-dom": "^6.17.0" // Client-side routing
}
```

## 🐳 Docker Deployment

### Development Environment
```bash
# Start all services
docker-compose up --build

# Start specific service
docker-compose up backend
docker-compose up frontend

# View logs
docker-compose logs -f backend
```

### Production Deployment
```bash
# Build and run in detached mode
docker-compose -f docker-compose.yml up -d --build

# Scale services for high availability
docker-compose up --scale backend=3 --scale frontend=2 -d

# Monitor services
docker-compose ps
docker-compose logs -f
```

## 🔍 Troubleshooting

### Common Issues & Solutions

**1. ❌ Backend fails to start**
```bash
# Verify Python version
python --version  # Should be 3.8+

# Install dependencies manually
cd backend
pip install -r requirements.txt

# Check for conflicts
pip check
```

**2. ❌ Frontend TypeScript errors**
```bash
# Clear cache and reinstall
cd frontend
rm -rf node_modules package-lock.json
npm cache clean --force
npm install

# Check TypeScript compilation
npm run build
```

**3. ❌ Connection issues**
```bash
# Check if ports are available
netstat -an | findstr ":8000"  # Backend
netstat -an | findstr ":3001"  # Frontend

# Test backend health
curl http://localhost:8000/health
```

**4. ❌ CORS errors**
- Verify frontend is running on correct port (3001)
- Check `ALLOWED_HOSTS` in backend configuration
- Ensure API URL is correctly configured

**5. ❌ OCR not working**
```bash
# Install system dependencies (if needed)
# Windows: Install Tesseract OCR from official website
# macOS: brew install tesseract
# Ubuntu: sudo apt-get install tesseract-ocr

# Verify EasyOCR installation
python -c "import easyocr; print('EasyOCR installed successfully')"
```

### Performance Optimization

**Backend Optimization:**
- Enable GPU acceleration for EasyOCR (if GPU available)
- Implement Redis caching for repeated analyses
- Use multiple worker processes in production
- Optimize image preprocessing pipeline

**Frontend Optimization:**
- Enable service worker for caching
- Implement lazy loading for large images
- Use React.memo for expensive components
- Optimize bundle size with code splitting

## 📈 Monitoring & Health Checks

### Built-in Monitoring
- **Health Endpoint**: `/health` for service status
- **Real-time Status**: Frontend displays backend connectivity
- **Error Logging**: Comprehensive error tracking in both frontend and backend
- **Performance Metrics**: Request/response timing information

### Status Indicators
- 🟢 **Green**: All systems operational
- 🟡 **Yellow**: Partial functionality (warnings)
- 🔴 **Red**: Service unavailable or errors

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Follow** TypeScript/Python best practices
4. **Test** your changes thoroughly
5. **Commit** changes (`git commit -m 'Add amazing feature'`)
6. **Push** to branch (`git push origin feature/amazing-feature`)
7. **Open** a Pull Request

### Development Guidelines
- **TypeScript**: Use strict type checking
- **Python**: Follow PEP 8 style guidelines
- **Testing**: Include unit tests for new features
- **Documentation**: Update README and API docs

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **FastAPI** team for the excellent async web framework
- **React** and **TypeScript** communities for robust frontend tools
- **Ant Design** for beautiful and accessible UI components
- **OpenCV** and **PIL** teams for powerful image processing libraries
- **EasyOCR** developers for state-of-the-art OCR capabilities
- **scikit-learn** contributors for machine learning algorithms

## 📞 Support & Community

- **📖 Documentation**: Visit `/docs` endpoint when backend is running
- **🐛 Bug Reports**: Create GitHub issues with detailed information
- **💡 Feature Requests**: Use GitHub Discussions for new ideas
- **❓ Questions**: Check existing discussions or create new ones

---

## 🎯 Getting Started Checklist

- [ ] Clone or download the repository
- [ ] Install Python 3.8+ and Node.js 16+
- [ ] Run `start_all.bat` (Windows) for one-click setup
- [ ] Open http://localhost:3001 in your browser
- [ ] Verify green health status on the homepage
- [ ] Upload a test image and run analysis
- [ ] Explore the API documentation at http://localhost:8000/docs

**Happy Analyzing! 🎨📊✨**