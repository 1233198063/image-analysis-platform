import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Typography, Button, Alert, Statistic } from 'antd';
import {
  UploadOutlined,
  BarChartOutlined,
  BgColorsOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import { healthService } from '../services/api';

const { Title, Paragraph } = Typography;

interface HealthStatus {
  status: 'healthy' | 'error';
  data?: any;
  error?: string;
}

interface Feature {
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
}

interface Stat {
  title: string;
  value: number;
  suffix: string;
}

const HomePage: React.FC = () => {
  const [healthStatus, setHealthStatus] = useState<HealthStatus | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    checkHealth();
  }, []);

  const checkHealth = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await healthService.checkHealth();
      setHealthStatus({ status: 'healthy', data: response });
    } catch (error: any) {
      setHealthStatus({ status: 'error', error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const features: Feature[] = [
    {
      title: 'Image Upload',
      description: 'Upload business images for comprehensive analysis',
      icon: <UploadOutlined style={{ fontSize: '32px', color: '#1890ff' }} />,
      link: '/upload'
    },
    {
      title: 'Full Analysis',
      description: 'Complete image analysis including color and text detection',
      icon: <BarChartOutlined style={{ fontSize: '32px', color: '#52c41a' }} />,
      link: '/analysis'
    },
    {
      title: 'Color Analysis',
      description: 'Extract dominant colors, analyze harmony and temperature',
      icon: <BgColorsOutlined style={{ fontSize: '32px', color: '#faad14' }} />,
      link: '/color-analysis'
    },
    {
      title: 'Text Detection',
      description: 'OCR text extraction with business-specific quality assessment',
      icon: <FileTextOutlined style={{ fontSize: '32px', color: '#722ed1' }} />,
      link: '/text-detection'
    }
  ];

  const stats: Stat[] = [
    { title: 'Business Types Supported', value: 3, suffix: 'types' },
    { title: 'Analysis Features', value: 2, suffix: 'features' },
    { title: 'Color Analysis Metrics', value: 5, suffix: 'metrics' },
    { title: 'OCR Engines', value: 2, suffix: 'engines' }
  ];

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Health Status */}
      <Card style={{ marginBottom: '24px' }}>
        {loading ? (
          <Alert message="Checking system health..." type="info" showIcon />
        ) : healthStatus?.status === 'healthy' ? (
          <Alert
            message="System Status: Healthy"
            description="All services are running normally"
            type="success"
            showIcon
            icon={<CheckCircleOutlined />}
            action={
              <Button size="small" type="link" onClick={checkHealth}>
                Refresh
              </Button>
            }
          />
        ) : (
          <Alert
            message="System Status: Error"
            description={`Backend service is not available: ${healthStatus?.error}`}
            type="error"
            showIcon
            icon={<ExclamationCircleOutlined />}
            action={
              <Button size="small" type="link" onClick={checkHealth}>
                Retry
              </Button>
            }
          />
        )}
      </Card>

      {/* Header */}
      <Card style={{ marginBottom: '24px', textAlign: 'center' }}>
        <Title level={1} style={{ color: '#1890ff', marginBottom: '16px' }}>
          🎨 Business Image Analysis Platform
        </Title>
        <Paragraph style={{ fontSize: '18px', color: '#666', maxWidth: '600px', margin: '0 auto' }}>
          AI-powered image analysis platform for business images. Analyze colors, extract text, 
          and gain insights from your retail, restaurant, and salon images.
        </Paragraph>
      </Card>

      {/* Statistics */}
      <Card style={{ marginBottom: '24px' }}>
        <Row gutter={16}>
          {stats.map((stat: Stat, index: number) => (
            <Col span={6} key={index}>
              <Statistic
                title={stat.title}
                value={stat.value}
                suffix={stat.suffix}
                valueStyle={{ color: '#1890ff' }}
              />
            </Col>
          ))}
        </Row>
      </Card>

      {/* Features */}
      <Title level={2} style={{ textAlign: 'center', marginBottom: '24px' }}>
        Platform Features
      </Title>
      
      <Row gutter={[16, 16]}>
        {features.map((feature: Feature, index: number) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card
              hoverable
              style={{ textAlign: 'center', height: '200px' }}
              onClick={() => window.location.href = feature.link}
            >
              <div style={{ marginBottom: '16px' }}>
                {feature.icon}
              </div>
              <Title level={4} style={{ marginBottom: '8px' }}>
                {feature.title}
              </Title>
              <Paragraph style={{ fontSize: '14px', color: '#666' }}>
                {feature.description}
              </Paragraph>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Getting Started */}
      <Card style={{ marginTop: '24px' }}>
        <Title level={3}>Getting Started</Title>
        <ol style={{ fontSize: '16px', lineHeight: '1.8' }}>
          <li>
            <strong>Upload an Image:</strong> Navigate to the Upload page and select a business image 
            (retail, restaurant, or salon)
          </li>
          <li>
            <strong>Choose Analysis Type:</strong> Select from color analysis, text detection, or 
            comprehensive analysis
          </li>
          <li>
            <strong>View Results:</strong> Explore the detailed analysis results including dominant 
            colors, color harmony, and extracted text
          </li>
          <li>
            <strong>Export Data:</strong> Download analysis results for further processing or reporting
          </li>
        </ol>
        
        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <Button 
            type="primary" 
            size="large" 
            icon={<UploadOutlined />}
            onClick={() => window.location.href = '/upload'}
          >
            Start Analyzing Images
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default HomePage;