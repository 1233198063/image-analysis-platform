import React, { useState, useEffect } from 'react';
import { Card, Typography, Spin, Alert, Row, Col, Tag, Progress, Button } from 'antd';
import { DownloadOutlined, ReloadOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

interface ColorData {
  hex: string;
  percentage: number;
}

interface TextDetectionItem {
  text: string;
  confidence: number;
  bounding_box: number[];
}

interface ImageStats {
  width: number;
  height: number;
  file_size: number;
  format: string;
  channels: number;
}

interface ColorAnalysis {
  dominant_colors: ColorData[];
  color_temperature: number;
  color_harmony_score: number;
  brightness: number;
  contrast: number;
  saturation: number;
}

interface AnalysisData {
  id: string;
  filename: string;
  business_type?: string;
  upload_time: string;
  processing_time: number;
  image_stats: ImageStats;
  color_analysis?: ColorAnalysis;
  text_detection?: TextDetectionItem[];
}

const AnalysisPage: React.FC = () => {
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadAnalysisData();
  }, []);

  const loadAnalysisData = (): void => {
    setLoading(true);
    try {
      const savedData = localStorage.getItem('latestAnalysis');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        setAnalysisData(parsedData);
      }
    } catch (error) {
      console.error('Failed to load analysis data:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportResults = (): void => {
    if (!analysisData) return;
    
    const exportData = {
      image_info: {
        id: analysisData.id,
        filename: analysisData.filename,
        business_type: analysisData.business_type,
        upload_time: analysisData.upload_time,
        processing_time: analysisData.processing_time
      },
      image_stats: analysisData.image_stats,
      color_analysis: analysisData.color_analysis,
      text_detection: analysisData.text_detection
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analysis_${analysisData.id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <Paragraph style={{ marginTop: '16px' }}>Loading analysis results...</Paragraph>
      </div>
    );
  }

  if (!analysisData) {
    return (
      <Card>
        <Alert
          message="No Analysis Data"
          description="No analysis results found. Please upload and analyze an image first."
          type="warning"
          showIcon
          action={
            <Button type="primary" onClick={() => window.location.href = '/upload'}>
              Upload Image
            </Button>
          }
        />
      </Card>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <Card style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Title level={2} style={{ marginBottom: '8px' }}>
              📊 Analysis Results
            </Title>
            <Text type="secondary">Image: {analysisData.filename}</Text>
          </div>
          <div>
            <Button 
              icon={<ReloadOutlined />} 
              onClick={loadAnalysisData}
              style={{ marginRight: '8px' }}
            >
              Refresh
            </Button>
            <Button 
              onClick={() => {
                localStorage.removeItem('latestAnalysis');
                loadAnalysisData();
              }}
              style={{ marginRight: '8px' }}
              type="dashed"
            >
              Clear Cache
            </Button>
            <Button 
              type="primary" 
              icon={<DownloadOutlined />} 
              onClick={exportResults}
            >
              Export Results
            </Button>
          </div>
        </div>
      </Card>

      {/* Image Information */}
      <Card title="Image Information" style={{ marginBottom: '24px' }}>
        <Row gutter={16}>
          <Col span={6}>
            <Text strong>File ID:</Text>
            <br />
            <Text code>{analysisData.id}</Text>
          </Col>
          <Col span={6}>
            <Text strong>Business Type:</Text>
            <br />
            <Tag color="blue">{analysisData.business_type || 'General'}</Tag>
          </Col>
          <Col span={6}>
            <Text strong>Processing Time:</Text>
            <br />
            <Text>{analysisData.processing_time.toFixed(2)}s</Text>
          </Col>
          <Col span={6}>
            <Text strong>Upload Time:</Text>
            <br />
            <Text>{new Date(analysisData.upload_time).toLocaleString()}</Text>
          </Col>
        </Row>
        
        <Row gutter={16} style={{ marginTop: '16px' }}>
          <Col span={6}>
            <Text strong>Dimensions:</Text>
            <br />
            <Text>{analysisData.image_stats.width} × {analysisData.image_stats.height}</Text>
          </Col>
          <Col span={6}>
            <Text strong>File Size:</Text>
            <br />
            <Text>{formatFileSize(analysisData.image_stats.file_size)}</Text>
          </Col>
          <Col span={6}>
            <Text strong>Format:</Text>
            <br />
            <Text>{analysisData.image_stats.format}</Text>
          </Col>
          <Col span={6}>
            <Text strong>Channels:</Text>
            <br />
            <Text>{analysisData.image_stats.channels}</Text>
          </Col>
        </Row>
      </Card>

      {/* Color Analysis Results */}
      {analysisData.color_analysis && (
        <Card title="🎨 Color Analysis" style={{ marginBottom: '24px' }}>
          <Row gutter={16}>
            <Col span={12}>
              <Title level={4}>Dominant Colors</Title>
              <div className="color-palette">
                {analysisData.color_analysis.dominant_colors.slice(0, 5).map((color, index) => (
                  <div key={index} style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center',
                    minWidth: '80px',
                    textAlign: 'center'
                  }}>
                    <div
                      className="color-swatch"
                      style={{ backgroundColor: color.hex }}
                      title={`${color.hex} (${color.percentage.toFixed(1)}%)`}
                    />
                    <div className="color-percentage">
                      <Text strong style={{ fontSize: '12px', display: 'block' }}>
                        {color.percentage.toFixed(1)}%
                      </Text>
                      <Text type="secondary" style={{ fontSize: '10px', display: 'block' }}>
                        {color.hex}
                      </Text>
                    </div>
                  </div>
                ))}
              </div>
            </Col>
            <Col span={12}>
              <Title level={4}>Color Metrics</Title>
              <div style={{ marginBottom: '16px' }}>
                <Text strong>Color Temperature:</Text>
                <br />
                <Text>{analysisData.color_analysis.color_temperature.toFixed(0)}K</Text>
                <Tag color={analysisData.color_analysis.color_temperature > 5500 ? 'volcano' : 'blue'} style={{ marginLeft: '8px' }}>
                  {analysisData.color_analysis.color_temperature > 5500 ? 'Warm' : 'Cool'}
                </Tag>
              </div>
              
              <div style={{ marginBottom: '16px' }}>
                <Text strong>Color Harmony:</Text>
                <Progress
                  percent={Math.round(analysisData.color_analysis.color_harmony_score * 100)}
                  status={analysisData.color_analysis.color_harmony_score > 0.7 ? 'success' : 'normal'}
                  strokeColor={{
                    '0%': '#108ee9',
                    '100%': '#87d068',
                  }}
                />
              </div>
              
              <Row gutter={8}>
                <Col span={8}>
                  <Text strong>Brightness:</Text>
                  <br />
                  <Progress
                    type="circle"
                    percent={Math.round(analysisData.color_analysis!.brightness / 2.55)}
                    size={60}
                    format={() => Math.round(analysisData.color_analysis!.brightness)}
                  />
                </Col>
                <Col span={8}>
                  <Text strong>Contrast:</Text>
                  <br />
                  <Progress
                    type="circle"
                    percent={Math.round(analysisData.color_analysis!.contrast / 2.55)}
                    size={60}
                    format={() => Math.round(analysisData.color_analysis!.contrast)}
                  />
                </Col>
                <Col span={8}>
                  <Text strong>Saturation:</Text>
                  <br />
                  <Progress
                    type="circle"
                    percent={Math.round(analysisData.color_analysis!.saturation * 100)}
                    size={60}
                    format={(percent) => `${percent}%`}
                  />
                </Col>
              </Row>
            </Col>
          </Row>
        </Card>
      )}

      {/* Text Detection Results */}
      {analysisData.text_detection && analysisData.text_detection.length > 0 && (
        <Card title="📝 Text Detection" style={{ marginBottom: '24px' }}>
          <Title level={4}>Detected Text ({analysisData.text_detection.length} items)</Title>
          <div className="text-detection-results">
            {analysisData.text_detection.map((textItem, index) => (
              <div key={index} className="detected-text-item">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ flex: 1 }}>
                    <Text strong style={{ fontSize: '16px' }}>{textItem.text}</Text>
                    <span className="confidence-badge">
                      {Math.round(textItem.confidence * 100)}% confidence
                    </span>
                  </div>
                </div>
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  Bounding box: [{textItem.bounding_box.slice(0, 4).join(', ')}...]
                </Text>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* No Text Detected */}
      {analysisData.text_detection && analysisData.text_detection.length === 0 && (
        <Card title="📝 Text Detection" style={{ marginBottom: '24px' }}>
          <Alert
            message="No Text Detected"
            description="No readable text was found in the image or the detected text didn't meet the quality threshold."
            type="info"
            showIcon
          />
        </Card>
      )}
      

      {/* Summary */}
      <Card title="📋 Analysis Summary">
        <Row gutter={16}>
          <Col span={8}>
            <Card type="inner" title="Color Analysis">
              {analysisData.color_analysis ? (
                <div>
                  <Text>✅ Completed</Text>
                  <br />
                  <Text type="secondary">
                    {analysisData.color_analysis.dominant_colors.length} colors detected
                  </Text>
                </div>
              ) : (
                <Text type="secondary">❌ Not performed</Text>
              )}
            </Card>
          </Col>
          <Col span={8}>
            <Card type="inner" title="Text Detection">
              {analysisData.text_detection ? (
                <div>
                  <Text>✅ Completed</Text>
                  <br />
                  <Text type="secondary">
                    {analysisData.text_detection.length} text items found
                  </Text>
                </div>
              ) : (
                <Text type="secondary">❌ Not performed</Text>
              )}
            </Card>
          </Col>
          <Col span={8}>
            <Card type="inner" title="Overall Status">
              <Text style={{ color: '#52c41a' }}>✅ Analysis Complete</Text>
              <br />
              <Text type="secondary">
                Ready for export or further analysis
              </Text>
            </Card>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default AnalysisPage;