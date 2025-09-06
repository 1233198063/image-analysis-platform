import React, { useState, useEffect } from 'react';
import { Card, Typography, Button, Input, Select, Alert, Row, Col, Spin, Tag, Progress } from 'antd';
import { BgColorsOutlined, BarChartOutlined, ReloadOutlined } from '@ant-design/icons';
import { colorService } from '../services/api';

const { Title, Text } = Typography;
const { Option } = Select;

interface ColorData {
  hex: string;
  percentage: number;
  rgb?: number[];
}

interface ColorResults {
  dominant_colors: ColorData[];
  color_temperature: number;
  interpretation?: string;
}

interface ColorSwatchProps {
  color: ColorData;
  index: number;
}

const ColorAnalysisPage: React.FC = () => {
  const [imageId, setImageId] = useState<string>('');
  const [nColors, setNColors] = useState<number>(5);
  const [loading, setLoading] = useState<boolean>(false);
  const [results, setResults] = useState<ColorResults | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load saved data on component mount
  useEffect(() => {
    loadSavedData();
  }, []);

  const loadSavedData = (): void => {
    try {
      const savedResults = localStorage.getItem('colorAnalysisResults');
      const savedImageId = localStorage.getItem('colorAnalysisImageId');
      const savedNColors = localStorage.getItem('colorAnalysisNColors');
      
      if (savedResults) {
        setResults(JSON.parse(savedResults));
      }
      if (savedImageId) {
        setImageId(savedImageId);
      }
      if (savedNColors) {
        setNColors(parseInt(savedNColors));
      }
    } catch (error) {
      console.error('Failed to load saved color analysis data:', error);
    }
  };

  const saveResults = (results: ColorResults, imageId: string, nColors: number): void => {
    try {
      localStorage.setItem('colorAnalysisResults', JSON.stringify(results));
      localStorage.setItem('colorAnalysisImageId', imageId);
      localStorage.setItem('colorAnalysisNColors', nColors.toString());
    } catch (error) {
      console.error('Failed to save color analysis data:', error);
    }
  };

  const clearResults = (): void => {
    setResults(null);
    setError(null);
    localStorage.removeItem('colorAnalysisResults');
    localStorage.removeItem('colorAnalysisImageId');
    localStorage.removeItem('colorAnalysisNColors');
  };

  const handleAnalyze = async (): Promise<void> => {
    if (!imageId.trim()) {
      setError('Please enter an image ID');
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      // Get dominant colors
      const dominantColors = await colorService.getDominantColors(imageId, nColors);
      
      // Get color temperature
      const temperatureData = await colorService.getColorTemperature(imageId);

      console.log('=== Color Analysis Debug ===');
      console.log('Dominant colors response:', dominantColors);
      console.log('Temperature response:', temperatureData);
      console.log('First color data:', dominantColors.dominant_colors[0]);

      const newResults = {
        dominant_colors: dominantColors.dominant_colors.map((color: any) => ({
          hex: color.hex || color.color,
          percentage: color.percentage,
          rgb: color.rgb
        })),
        color_temperature: typeof temperatureData.color_temperature === 'string' 
          ? parseFloat(temperatureData.color_temperature.replace(/[^0-9.-]/g, ''))
          : temperatureData.color_temperature,
        interpretation: temperatureData.interpretation
      };
      
      setResults(newResults);
      saveResults(newResults, imageId, nColors);
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message);
    } finally {
      setLoading(false);
    }
  };

  const ColorSwatch: React.FC<ColorSwatchProps> = ({ color, index }) => (
    <div style={{ textAlign: 'center', marginBottom: '16px' }}>
      <div
        style={{
          width: '80px',
          height: '80px',
          backgroundColor: color.hex,
          borderRadius: '8px',
          border: '1px solid #d9d9d9',
          margin: '0 auto 8px auto',
          cursor: 'pointer'
        }}
        title={`${color.hex} (${color.percentage.toFixed(1)}%)`}
      />
      <div>
        <Text strong>{color.percentage.toFixed(1)}%</Text>
        <br />
        <Text type="secondary" style={{ fontSize: '12px' }}>{color.hex}</Text>
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <Card>
        <Title level={2} style={{ textAlign: 'center', marginBottom: '24px' }}>
          🎨 Color Analysis Tool
        </Title>

        {/* Input Section */}
        <Card title="Analysis Configuration" style={{ marginBottom: '24px' }}>
          <Row gutter={16} align="middle">
            <Col span={10}>
              <Text strong>Image ID:</Text>
              <Input
                placeholder="Enter uploaded image ID"
                value={imageId}
                onChange={(e) => setImageId(e.target.value)}
                style={{ marginTop: '8px' }}
              />
            </Col>
            <Col span={6}>
              <Text strong>Number of Colors:</Text>
              <Select
                value={nColors}
                onChange={setNColors}
                style={{ width: '100%', marginTop: '8px' }}
              >
                <Option value={3}>3 Colors</Option>
                <Option value={5}>5 Colors</Option>
                <Option value={7}>7 Colors</Option>
                <Option value={10}>10 Colors</Option>
              </Select>
            </Col>
            <Col span={6}>
              <Button
                type="primary"
                icon={<BarChartOutlined />}
                onClick={handleAnalyze}
                loading={loading}
                disabled={!imageId.trim()}
                style={{ marginTop: '24px', width: '100%' }}
              >
                Analyze Colors
              </Button>
            </Col>
            <Col span={2}>
              <Button
                icon={<ReloadOutlined />}
                onClick={clearResults}
                disabled={!results}
                style={{ marginTop: '24px', width: '100%' }}
                title="Clear Results"
              >
                Clear
              </Button>
            </Col>
          </Row>
        </Card>

        {/* Error Display */}
        {error && (
          <Alert
            message="Analysis Error"
            description={error}
            type="error"
            showIcon
            style={{ marginBottom: '24px' }}
          />
        )}

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <Spin size="large" />
            <Title level={4} style={{ marginTop: '16px' }}>
              Analyzing colors...
            </Title>
          </div>
        )}

        {/* Results */}
        {results && (
          <>
            {/* Dominant Colors */}
            <Card title="Dominant Colors" style={{ marginBottom: '24px' }}>
              <Row gutter={16}>
                {results.dominant_colors.map((color, index) => (
                  <Col span={results.dominant_colors.length <= 5 ? 24 / results.dominant_colors.length : 4} key={index}>
                    <ColorSwatch color={color} index={index} />
                  </Col>
                ))}
              </Row>
              
              {/* Color Statistics */}
              <div style={{ marginTop: '24px', padding: '16px', backgroundColor: '#fafafa', borderRadius: '8px' }}>
                <Row gutter={16}>
                  <Col span={8}>
                    <Text strong>Most Dominant:</Text>
                    <br />
                    <div style={{ display: 'flex', alignItems: 'center', marginTop: '8px' }}>
                      <div
                        style={{
                          width: '24px',
                          height: '24px',
                          backgroundColor: results.dominant_colors[0]?.hex,
                          borderRadius: '4px',
                          border: '1px solid #d9d9d9',
                          marginRight: '8px'
                        }}
                      />
                      <Text>{results.dominant_colors[0]?.hex} ({results.dominant_colors[0]?.percentage.toFixed(1)}%)</Text>
                    </div>
                  </Col>
                  <Col span={8}>
                    <Text strong>Total Colors Analyzed:</Text>
                    <br />
                    <Text style={{ fontSize: '18px', color: '#1890ff' }}>{results.dominant_colors.length}</Text>
                  </Col>
                  <Col span={8}>
                    <Text strong>Coverage:</Text>
                    <br />
                    <Text style={{ fontSize: '18px', color: '#52c41a' }}>
                      {results.dominant_colors.reduce((sum, color) => sum + color.percentage, 0).toFixed(1)}%
                    </Text>
                  </Col>
                </Row>
              </div>
            </Card>

            {/* Color Temperature */}
            <Card title="Color Temperature Analysis">
              <Row gutter={16} align="middle">
                <Col span={12}>
                  <div style={{ textAlign: 'center' }}>
                    <Title level={3} style={{ marginBottom: '8px' }}>
                      {results.color_temperature}K
                    </Title>
                    <Tag 
                      color={results.interpretation === 'warm' ? 'volcano' : 'blue'} 
                      style={{ fontSize: '14px', padding: '4px 12px' }}
                    >
                      {results.interpretation?.toUpperCase() || 'NEUTRAL'} TONES
                    </Tag>
                  </div>
                </Col>
                <Col span={12}>
                  <div>
                    <Text strong>Temperature Scale:</Text>
                    <div style={{ margin: '16px 0' }}>
                      <Progress
                        percent={((results.color_temperature - 2000) / 8000) * 100}
                        showInfo={false}
                        strokeColor={{
                          '0%': '#4096ff',
                          '50%': '#ffffff', 
                          '100%': '#ff7875'
                        }}
                        strokeWidth={20}
                      />
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                        <Text type="secondary">2000K (Cool)</Text>
                        <Text type="secondary">5000K (Neutral)</Text>
                        <Text type="secondary">10000K (Warm)</Text>
                      </div>
                    </div>
                    <Text type="secondary">
                      {results.interpretation === 'warm' 
                        ? 'This image has warm tones, suggesting cozy, energetic, or inviting qualities.'
                        : 'This image has cool tones, suggesting calm, professional, or clean qualities.'
                      }
                    </Text>
                  </div>
                </Col>
              </Row>
            </Card>
          </>
        )}

        {/* Instructions */}
        <Card style={{ marginTop: '24px', backgroundColor: '#fafafa' }}>
          <Title level={4}>How to Use</Title>
          <ol style={{ lineHeight: '1.8' }}>
            <li>Upload an image first using the Upload page</li>
            <li>Copy the image ID from the upload confirmation</li>
            <li>Enter the image ID in the field above</li>
            <li>Select the number of dominant colors to extract</li>
            <li>Click "Analyze Colors" to see the results</li>
          </ol>
          
          <Alert
            message="Tip"
            description="Color temperature above 5500K indicates warm tones (reds, yellows), while below 5500K indicates cool tones (blues, greens)."
            type="info"
            showIcon
            style={{ marginTop: '16px' }}
          />
        </Card>
      </Card>
    </div>
  );
};

export default ColorAnalysisPage;