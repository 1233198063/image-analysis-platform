import React, { useState } from 'react';
import { Card, Typography, Button, Input, Select, Alert, Row, Col, Spin, Tag, Progress, Badge } from 'antd';
import { FileTextOutlined, BarChartOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { textService } from '../services/api';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

interface TextResult {
  text: string;
  confidence: number;
  bounding_box: number[];
}


const TextDetectionPage: React.FC = () => {
  const [imageId, setImageId] = useState<string>('');
  const [businessType, setBusinessType] = useState<string>('General');
  const [loading, setLoading] = useState<boolean>(false);
  const [results, setResults] = useState<TextResult[] | null>(null);
  const [qualityResults, setQualityResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDetectText = async (): Promise<void> => {
    if (!imageId.trim()) {
      setError('Please enter an image ID');
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);
    setQualityResults(null);

    try {
      // Detect text
      const textData = await textService.detectTextById(imageId, businessType);
      setResults(textData.text_results);

      // Get quality assessment
      const qualityData = await textService.assessTextQuality(imageId, businessType);
      setQualityResults(qualityData.quality_results);
      
    } catch (err: any) {
      setError(err.response?.data?.detail || err.message);
    } finally {
      setLoading(false);
    }
  };

  const getConfidenceColor = (confidence: number): string => {
    if (confidence >= 0.8) return 'success';
    if (confidence >= 0.6) return 'warning';
    return 'error';
  };

  const getQualityColor = (quality: number): string => {
    if (quality >= 0.7) return 'success';
    if (quality >= 0.5) return 'warning';
    return 'error';
  };

  const getQualityLabel = (quality: number): string => {
    if (quality >= 0.8) return 'Excellent';
    if (quality >= 0.6) return 'Good';
    if (quality >= 0.4) return 'Fair';
    return 'Poor';
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <Card>
        <Title level={2} style={{ textAlign: 'center', marginBottom: '24px' }}>
          📝 Text Detection Tool
        </Title>

        {/* Input Section */}
        <Card title="Detection Configuration" style={{ marginBottom: '24px' }}>
          <Row gutter={16} align="middle">
            <Col span={8}>
              <Text strong>Image ID:</Text>
              <Input
                placeholder="Enter uploaded image ID"
                value={imageId}
                onChange={(e) => setImageId(e.target.value)}
                style={{ marginTop: '8px' }}
              />
            </Col>
            <Col span={8}>
              <Text strong>Business Type:</Text>
              <Select
                value={businessType}
                onChange={setBusinessType}
                style={{ width: '100%', marginTop: '8px' }}
              >
                <Option value="General">General</Option>
                <Option value="Retail">Retail</Option>
                <Option value="Restaurant">Restaurant</Option>
                <Option value="Salon">Salon</Option>
              </Select>
            </Col>
            <Col span={8}>
              <Button
                type="primary"
                icon={<BarChartOutlined />}
                onClick={handleDetectText}
                loading={loading}
                disabled={!imageId.trim()}
                style={{ marginTop: '24px', width: '100%' }}
              >
                Detect Text
              </Button>
            </Col>
          </Row>
          
          <Alert
            message="Business Type Impact"
            description="Selecting the correct business type improves text quality scoring by recognizing industry-specific keywords and terminology."
            type="info"
            showIcon
            style={{ marginTop: '16px' }}
          />
        </Card>

        {/* Error Display */}
        {error && (
          <Alert
            message="Detection Error"
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
              Detecting text...
            </Title>
          </div>
        )}

        {/* Results */}
        {results && (
          <>
            {/* Summary */}
            <Card title="Detection Summary" style={{ marginBottom: '24px' }}>
              <Row gutter={16}>
                <Col span={6}>
                  <div style={{ textAlign: 'center' }}>
                    <Title level={3} style={{ color: '#1890ff', marginBottom: '8px' }}>
                      {results.length}
                    </Title>
                    <Text>Text Items Found</Text>
                  </div>
                </Col>
                <Col span={6}>
                  <div style={{ textAlign: 'center' }}>
                    <Title level={3} style={{ color: '#52c41a', marginBottom: '8px' }}>
                      {results.filter((item: any) => item.confidence >= 0.8).length}
                    </Title>
                    <Text>High Confidence</Text>
                  </div>
                </Col>
                <Col span={6}>
                  <div style={{ textAlign: 'center' }}>
                    <Title level={3} style={{ color: '#faad14', marginBottom: '8px' }}>
                      {qualityResults ? qualityResults.filter((item: any) => item.quality_score >= 0.7).length : 0}
                    </Title>
                    <Text>High Quality</Text>
                  </div>
                </Col>
                <Col span={6}>
                  <div style={{ textAlign: 'center' }}>
                    <Tag color="blue" style={{ fontSize: '14px', padding: '4px 8px' }}>
                      {businessType}
                    </Tag>
                    <br />
                    <Text type="secondary">Business Type</Text>
                  </div>
                </Col>
              </Row>
            </Card>

            {/* Detected Text */}
            {results.length > 0 ? (
              <Card title="Detected Text Items" style={{ marginBottom: '24px' }}>
                {results.map((item, index) => {
                  const qualityItem = qualityResults?.find((q: any) => q.text === item.text);
                  return (
                    <Card
                      key={index}
                      type="inner"
                      style={{ marginBottom: '16px' }}
                      title={
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span>Text Item #{index + 1}</span>
                          <div>
                            <Tag color={getConfidenceColor(item.confidence)}>
                              {Math.round(item.confidence * 100)}% confidence
                            </Tag>
                            {qualityItem && (
                              <Tag color={getQualityColor(qualityItem.quality_score)}>
                                {getQualityLabel(qualityItem.quality_score)} quality
                              </Tag>
                            )}
                          </div>
                        </div>
                      }
                    >
                      <div style={{ marginBottom: '16px' }}>
                        <Text strong style={{ fontSize: '18px' }}>"{item.text}"</Text>
                      </div>
                      
                      <Row gutter={16}>
                        <Col span={12}>
                          <Text strong>Detection Confidence:</Text>
                          <Progress
                            percent={Math.round(item.confidence * 100)}
                            status={item.confidence >= 0.8 ? 'success' : 'normal'}
                            strokeColor={
                              item.confidence >= 0.8 ? '#52c41a' :
                              item.confidence >= 0.6 ? '#faad14' : '#ff4d4f'
                            }
                          />
                        </Col>
                        <Col span={12}>
                          {qualityItem && (
                            <>
                              <Text strong>Quality Score:</Text>
                              <Progress
                                percent={Math.round(qualityItem.quality_score * 100)}
                                status={qualityItem.quality_score >= 0.7 ? 'success' : 'normal'}
                                strokeColor={
                                  qualityItem.quality_score >= 0.7 ? '#52c41a' :
                                  qualityItem.quality_score >= 0.5 ? '#faad14' : '#ff4d4f'
                                }
                              />
                            </>
                          )}
                        </Col>
                      </Row>
                      
                      <div style={{ marginTop: '12px' }}>
                        <Text type="secondary" style={{ fontSize: '12px' }}>
                          Bounding box: [{item.bounding_box.slice(0, 4).join(', ')}...]
                        </Text>
                      </div>
                    </Card>
                  );
                })}
              </Card>
            ) : (
              <Card title="Detection Results">
                <Alert
                  message="No Text Detected"
                  description="No readable text was found in the image or the detected text didn't meet the minimum quality threshold."
                  type="info"
                  showIcon
                  icon={<FileTextOutlined />}
                />
              </Card>
            )}

            {/* Quality Analysis */}
            {qualityResults && qualityResults.length > 0 && (
              <Card title="Quality Analysis">
                <Paragraph>
                  Text quality is assessed based on several factors including length, character composition, 
                  and relevance to the selected business type. Higher quality scores indicate text that is 
                  more likely to be meaningful business information.
                </Paragraph>
                
                <Row gutter={16}>
                  <Col span={8}>
                    <Card type="inner" title="Quality Distribution">
                      <div style={{ marginBottom: '8px' }}>
                        <Text>Excellent (80-100%): </Text>
                        <Badge count={qualityResults.filter((item: any) => item.quality_score >= 0.8).length} style={{ backgroundColor: '#52c41a' }} />
                      </div>
                      <div style={{ marginBottom: '8px' }}>
                        <Text>Good (60-79%): </Text>
                        <Badge count={qualityResults.filter((item: any) => item.quality_score >= 0.6 && item.quality_score < 0.8).length} style={{ backgroundColor: '#faad14' }} />
                      </div>
                      <div style={{ marginBottom: '8px' }}>
                        <Text>Fair (40-59%): </Text>
                        <Badge count={qualityResults.filter((item: any) => item.quality_score >= 0.4 && item.quality_score < 0.6).length} style={{ backgroundColor: '#ff7a45' }} />
                      </div>
                      <div>
                        <Text>Poor (0-39%): </Text>
                        <Badge count={qualityResults.filter((item: any) => item.quality_score < 0.4).length} style={{ backgroundColor: '#ff4d4f' }} />
                      </div>
                    </Card>
                  </Col>
                  <Col span={8}>
                    <Card type="inner" title="Average Quality">
                      <div style={{ textAlign: 'center' }}>
                        <Title level={2} style={{ color: '#1890ff' }}>
                          {(qualityResults.reduce((sum: number, item: any) => sum + item.quality_score, 0) / qualityResults.length * 100).toFixed(1)}%
                        </Title>
                        <Text type="secondary">Overall Quality Score</Text>
                      </div>
                    </Card>
                  </Col>
                  <Col span={8}>
                    <Card type="inner" title="Business Relevance">
                      <div style={{ textAlign: 'center' }}>
                        <CheckCircleOutlined style={{ fontSize: '32px', color: '#52c41a', marginBottom: '8px' }} />
                        <br />
                        <Text>Optimized for</Text>
                        <br />
                        <Tag color="blue">{businessType}</Tag>
                      </div>
                    </Card>
                  </Col>
                </Row>
              </Card>
            )}
          </>
        )}

        {/* Instructions */}
        <Card style={{ marginTop: '24px', backgroundColor: '#fafafa' }}>
          <Title level={4}>How to Use</Title>
          <ol style={{ lineHeight: '1.8' }}>
            <li>Upload an image first using the Upload page</li>
            <li>Copy the image ID from the upload confirmation</li>
            <li>Select the appropriate business type for better quality assessment</li>
            <li>Click "Detect Text" to extract and analyze text</li>
          </ol>
          
          <Alert
            message="Quality Factors"
            description={
              <ul style={{ marginBottom: 0, paddingLeft: '16px' }}>
                <li><strong>Confidence:</strong> OCR engine's certainty about the detected text</li>
                <li><strong>Quality:</strong> Business relevance, readability, and content meaningfulness</li>
                <li><strong>Business Type:</strong> Affects quality scoring with industry-specific keywords</li>
              </ul>
            }
            type="info"
            showIcon
            style={{ marginTop: '16px' }}
          />
        </Card>
      </Card>
    </div>
  );
};

export default TextDetectionPage;