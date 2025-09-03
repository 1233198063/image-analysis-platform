import axios, { AxiosResponse } from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to: ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('API Success:', response.config.url, response.status);
    return response;
  },
  (error) => {
    console.error('API Error Details:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
      code: error.code
    });
    return Promise.reject(error);
  }
);

// Types
interface UploadResponse {
  file_id: string;
  filename: string;
  file_path: string;
  message: string;
}

interface DeleteResponse {
  message: string;
}

interface ListImagesResponse {
  files: Array<{
    file_id: string;
    filename: string;
    file_path: string;
    upload_date: string;
  }>;
}

interface AnalysisResponse {
  analysis_id: string;
  image_id: string;
  results: any;
  status: string;
}

interface ColorAnalysisResponse {
  dominant_colors: Array<{
    color: string;
    percentage: number;
  }>;
  color_temperature: string;
}

interface TextDetectionResponse {
  text_results: Array<{
    text: string;
    confidence: number;
    bounding_box: number[];
  }>;
}

// Upload service
export const uploadService = {
  uploadImage: async (file: File): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post('/api/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  },
  
  deleteImage: async (fileId: string): Promise<DeleteResponse> => {
    const response = await api.delete(`/api/upload/${fileId}`);
    return response.data;
  },
  
  listImages: async (): Promise<ListImagesResponse> => {
    const response = await api.get('/api/uploads');
    return response.data;
  },
};

// Analysis service
export const analysisService = {
  analyzeImage: async (
    imageId: string, 
    businessType: string | null = null, 
    analysisTypes: string[] = ['color', 'text']
  ): Promise<AnalysisResponse> => {
    const response = await api.post('/api/analysis', {
      image_id: imageId,
      business_type: businessType,
      analysis_types: analysisTypes,
    });
    
    return response.data;
  },
  
  getAnalysisResult: async (imageId: string): Promise<AnalysisResponse> => {
    const response = await api.get(`/api/analysis/${imageId}`);
    return response.data;
  },
  
  getBusinessTypes: async (): Promise<{ business_types: string[] }> => {
    const response = await api.get('/api/business-types');
    return response.data;
  },
  
  getAnalysisTypes: async (): Promise<{ analysis_types: string[] }> => {
    const response = await api.get('/api/analysis-types');
    return response.data;
  },
};

// Color analysis service
export const colorService = {
  analyzeColors: async (imagePath: string, nColors: number = 5): Promise<ColorAnalysisResponse> => {
    const response = await api.post('/api/color-analysis', {
      image_path: imagePath,
      n_colors: nColors,
    });
    
    return response.data;
  },
  
  getDominantColors: async (imageId: string, nColors: number = 5): Promise<ColorAnalysisResponse> => {
    const response = await api.get(`/api/color-analysis/dominant-colors/${imageId}`, {
      params: { n_colors: nColors },
    });
    
    return response.data;
  },
  
  getColorTemperature: async (imageId: string): Promise<{ color_temperature: string; interpretation?: string }> => {
    const response = await api.get(`/api/color-analysis/temperature/${imageId}`);
    return response.data;
  },
};

// Text detection service
export const textService = {
  detectText: async (imagePath: string, businessType: string = 'General'): Promise<TextDetectionResponse> => {
    const response = await api.post('/api/text-detection', {
      image_path: imagePath,
      business_type: businessType,
    });
    
    return response.data;
  },
  
  detectTextById: async (imageId: string, businessType: string = 'General'): Promise<TextDetectionResponse> => {
    const response = await api.get(`/api/text-detection/${imageId}`, {
      params: { business_type: businessType },
    });
    
    return response.data;
  },
  
  assessTextQuality: async (imageId: string, businessType: string = 'General'): Promise<{ quality_results: any }> => {
    const response = await api.get(`/api/text-detection/quality/${imageId}`, {
      params: { business_type: businessType },
    });
    
    return response.data;
  },
};

// Health check
export const healthService = {
  checkHealth: async (): Promise<{ status: string; message: string }> => {
    const response = await api.get('/health');
    return response.data;
  },
};

export default api;