import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout, Menu, MenuProps } from 'antd';
import {
  HomeOutlined,
  UploadOutlined,
  BarChartOutlined,
  BgColorsOutlined,
  FileTextOutlined
} from '@ant-design/icons';

import HomePage from './pages/HomePage';
import UploadPage from './pages/UploadPage';
import AnalysisPage from './pages/AnalysisPage';
import ColorAnalysisPage from './pages/ColorAnalysisPage';
import TextDetectionPage from './pages/TextDetectionPage';

const { Header, Content, Footer } = Layout;

const App: React.FC = () => {
  const menuItems: MenuProps['items'] = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: 'Home',
    },
    {
      key: '/upload',
      icon: <UploadOutlined />,
      label: 'Upload',
    },
    {
      key: '/analysis',
      icon: <BarChartOutlined />,
      label: 'Analysis',
    },
    {
      key: '/color-analysis',
      icon: <BgColorsOutlined />,
      label: 'Color Analysis',
    },
    {
      key: '/text-detection',
      icon: <FileTextOutlined />,
      label: 'Text Detection',
    },
  ];

  return (
    <div className="app-container">
      <Layout style={{ minHeight: '100vh' }}>
        <Header style={{ padding: 0 }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            padding: '0 24px'
          }}>
            <h1 style={{ 
              color: 'white', 
              margin: 0, 
              fontSize: '20px',
              fontWeight: 'bold'
            }}>
              🎨 Business Image Analysis Platform
            </h1>
            <Menu
              theme="dark"
              mode="horizontal"
              items={menuItems}
              style={{ 
                flex: 1, 
                minWidth: 0,
                justifyContent: 'flex-end'
              }}
              onClick={({ key }) => {
                window.location.pathname = key;
              }}
              selectedKeys={[window.location.pathname]}
            />
          </div>
        </Header>
        
        <Content className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/upload" element={<UploadPage />} />
            <Route path="/analysis" element={<AnalysisPage />} />
            <Route path="/color-analysis" element={<ColorAnalysisPage />} />
            <Route path="/text-detection" element={<TextDetectionPage />} />
          </Routes>
        </Content>
        
        <Footer style={{ textAlign: 'center', background: '#f0f2f5' }}>
          Business Image Analysis Platform ©2024 - AI-Powered Image Analysis
        </Footer>
      </Layout>
    </div>
  );
};

export default App;