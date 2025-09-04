import React, { useState, useCallback } from 'react';
import { Card, Typography, message, Button, Space, Select, Alert } from 'antd';
import { UploadOutlined, BarChartOutlined, DeleteOutlined } from '@ant-design/icons';
import { useDropzone } from 'react-dropzone';
import { uploadService, analysisService } from '../services/api';

const { Title, Text } = Typography;
const { Option } = Select;

interface UploadedFile {
  file_id: string;
  filename: string;
  file_path: string;
  originalName: string;
  size: number;
  preview: string;
}

const UploadPage: React.FC = () => {
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [analyzing, setAnalyzing] = useState<boolean>(false);
  const [businessType, setBusinessType] = useState<string>('General');
  const [analysisTypes, setAnalysisTypes] = useState<string[]>(['color', 'text']);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      message.error('Please upload an image file');
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      message.error('File size must be less than 10MB');
      return;
    }

    try {
      setUploading(true);
      const response = await uploadService.uploadImage(file);
      setUploadedFile({
        ...response,
        originalName: file.name,
        size: file.size,
        preview: URL.createObjectURL(file)
      });
      message.success('Image uploaded successfully!');
    } catch (error: any) {
      console.error('Upload error:', error);
      let errorMessage = 'Upload failed';
      
      if (error.response?.data?.detail) {
        errorMessage = `Upload failed: ${error.response.data.detail}`;
      } else if (error.message) {
        errorMessage = `Upload failed: ${error.message}`;
      } else {
        errorMessage = `Upload failed: ${JSON.stringify(error)}`;
      }
      
      message.error(errorMessage);
    } finally {
      setUploading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.bmp', '.tiff']
    },
    multiple: false
  });

  const handleDelete = async (): Promise<void> => {
    if (!uploadedFile) return;

    try {
      await uploadService.deleteImage(uploadedFile.file_id);
      setUploadedFile(null);
      message.success('Image deleted successfully');
    } catch (error: any) {
      message.error('Delete failed: ' + (error.response?.data?.detail || error.message));
    }
  };

  const handleAnalyze = async (): Promise<void> => {
    if (!uploadedFile) return;

    try {
      setAnalyzing(true);
      
      console.log('=== Analysis Request Debug ===');
      console.log('file_id:', uploadedFile.file_id);
      console.log('businessType:', businessType);
      console.log('analysisTypes:', analysisTypes);
      console.log('businessType processed:', businessType === 'General' ? null : businessType);
      
      const response = await analysisService.analyzeImage(
        uploadedFile.file_id,
        businessType === 'General' ? null : businessType,
        analysisTypes
      );
      
      console.log('=== Analysis Response Debug ===');
      console.log('Full response:', response);
      console.log('Response type:', typeof response);
      console.log('Response keys:', Object.keys(response));
      console.log('Text detection in response:', response.text_detection);
      console.log('Text detection type:', typeof response.text_detection);
      console.log('Text detection is array:', Array.isArray(response.text_detection));
      
      message.success('Analysis completed successfully!');
      
      // Store results in localStorage for viewing in analysis page
      localStorage.setItem('latestAnalysis', JSON.stringify(response));
      
      // Redirect to analysis page
      window.location.href = '/analysis';
      
    } catch (error: any) {
      console.error('Analysis error - Full error object:', error);
      console.error('Error response:', error.response);
      console.error('Error message:', error.message);
      console.error('Error code:', error.code);
      
      let errorMessage = 'Analysis failed';
      
      if (error.code === 'ECONNABORTED') {
        errorMessage = 'Analysis failed: Request timeout - the analysis is taking longer than expected. Please try again.';
      } else if (error.response?.status === 404) {
        errorMessage = 'Analysis failed: Image not found. Please re-upload the image.';
      } else if (error.response?.status === 500) {
        errorMessage = `Analysis failed: ${error.response?.data?.detail || 'Internal server error'}`;
      } else if (error.response?.data?.detail) {
        errorMessage = `Analysis failed: ${error.response.data.detail}`;
      } else if (error.message && error.message !== 'Network Error') {
        errorMessage = `Analysis failed: ${error.message}`;
      } else if (error.response?.status) {
        errorMessage = `Analysis failed: HTTP ${error.response.status} - ${error.response.statusText}`;
      } else if (error.toString && typeof error.toString === 'function') {
        errorMessage = `Analysis failed: ${error.toString()}`;
      } else {
        errorMessage = `Analysis failed: Unknown error occurred. Check browser console for details.`;
      }
      
      message.error(errorMessage, 10); // Show error for 10 seconds
    } finally {
      setAnalyzing(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <Card>
        <Title level={2} style={{ textAlign: 'center', marginBottom: '24px' }}>
          📤 Upload Business Image
        </Title>

        {/* Upload Area */}
        <div
          {...getRootProps()}
          className={`upload-area ${isDragActive ? 'dragover' : ''}`}
          style={{
            marginBottom: '24px',
            opacity: uploading ? 0.6 : 1,
            pointerEvents: uploading ? 'none' : 'auto'
          }}
        >
          <input {...getInputProps()} />
          <UploadOutlined style={{ fontSize: '48px', color: '#1890ff', marginBottom: '16px' }} />
          {isDragActive ? (
            <Title level={4}>Drop the image here...</Title>
          ) : (
            <>
              <Title level={4}>Drag & drop an image here, or click to select</Title>
              <Text type="secondary">
                Supports: JPG, JPEG, PNG, BMP, TIFF (Max 10MB)
              </Text>
            </>
          )}
          {uploading && (
            <div style={{ marginTop: '16px' }}>
              <Text>Uploading...</Text>
            </div>
          )}
        </div>

        {/* File Preview */}
        {uploadedFile && (
          <Card 
            title="Uploaded Image" 
            style={{ marginBottom: '24px' }}
            extra={
              <Button 
                type="text" 
                danger 
                icon={<DeleteOutlined />}
                onClick={handleDelete}
              >
                Delete
              </Button>
            }
          >
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
              <img
                src={uploadedFile.preview}
                alt="Preview"
                style={{
                  width: '200px',
                  height: '150px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                  border: '1px solid #d9d9d9'
                }}
              />
              <div style={{ flex: 1 }}>
                <Title level={5}>{uploadedFile.originalName}</Title>
                <Text type="secondary">
                  Size: {formatFileSize(uploadedFile.size)}
                </Text>
                <br />
                <Text type="secondary">
                  Upload ID: {uploadedFile.file_id}
                </Text>
              </div>
            </div>
          </Card>
        )}

        {/* Analysis Configuration */}
        {uploadedFile && (
          <Card title="Analysis Configuration" style={{ marginBottom: '24px' }}>
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              <div>
                <Text strong>Business Type:</Text>
                <Select
                  value={businessType}
                  onChange={setBusinessType}
                  style={{ width: '200px', marginLeft: '12px' }}
                >
                  <Option value="General">General</Option>
                  <Option value="Retail">Retail</Option>
                  <Option value="Restaurant">Restaurant</Option>
                  <Option value="Salon">Salon</Option>
                </Select>
              </div>

              <div>
                <Text strong>Analysis Types:</Text>
                <Select
                  mode="multiple"
                  value={analysisTypes}
                  onChange={setAnalysisTypes}
                  style={{ width: '300px', marginLeft: '12px' }}
                  placeholder="Select analysis types"
                >
                  <Option value="color">Color Analysis</Option>
                  <Option value="text">Text Detection</Option>
                </Select>
              </div>

              <Alert
                message="Analysis Configuration"
                description={
                  <ul style={{ marginBottom: 0, paddingLeft: '16px' }}>
                    <li><strong>Business Type:</strong> Affects text detection quality scoring with industry-specific keywords</li>
                    <li><strong>Color Analysis:</strong> Extracts dominant colors, calculates harmony and temperature</li>
                    <li><strong>Text Detection:</strong> OCR extraction with confidence scoring and quality assessment</li>
                    <li><strong>Processing Time:</strong> Analysis typically takes 30-90 seconds depending on image complexity</li>
                  </ul>
                }
                type="info"
                showIcon
              />
            </Space>
          </Card>
        )}

        {/* Action Buttons */}
        {uploadedFile && (
          <div style={{ textAlign: 'center' }}>
            <Button
              type="primary"
              size="large"
              icon={<BarChartOutlined />}
              loading={analyzing}
              onClick={handleAnalyze}
              disabled={analysisTypes.length === 0}
            >
              {analyzing ? 'Analyzing...' : 'Start Analysis'}
            </Button>
          </div>
        )}

        {/* Instructions */}
        <Card style={{ marginTop: '24px', backgroundColor: '#fafafa' }}>
          <Title level={4}>Upload Instructions</Title>
          <ul style={{ lineHeight: '1.8' }}>
            <li>Upload clear, high-quality business images for best results</li>
            <li>Supported formats: JPG, JPEG, PNG, BMP, TIFF</li>
            <li>Maximum file size: 10MB</li>
            <li>Choose the appropriate business type for better text analysis</li>
            <li>Select analysis types based on your needs</li>
          </ul>
        </Card>
      </Card>
    </div>
  );
};

export default UploadPage;