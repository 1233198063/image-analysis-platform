# 图像分析平台 - 前后端连接指南

## 🚀 快速启动

### 方法1：一键启动 (推荐)
双击运行 `start_all.bat` 文件，会自动启动前后端服务。

### 方法2：手动分别启动

#### 启动后端服务：
1. 打开命令行
2. 进入项目目录：`cd "C:\Users\19257\Desktop\Image Analysis Platform"`
3. 双击运行 `start_backend.bat`

#### 启动前端服务：
1. 打开另一个命令行窗口
2. 进入项目目录：`cd "C:\Users\19257\Desktop\Image Analysis Platform"`
3. 双击运行 `start_frontend.bat`

## 🌐 访问地址

启动成功后，您可以访问：

- **前端应用**: http://localhost:3000
- **后端API**: http://localhost:8000
- **API文档**: http://localhost:8000/docs
- **健康检查**: http://localhost:8000/health

## 📋 系统要求

### 后端要求：
- Python 3.8+
- pip (Python包管理器)

### 前端要求：
- Node.js 16+
- npm (Node包管理器)

## 🔧 环境变量配置

前端会自动连接到 `http://localhost:8000` 的后端服务。如果需要修改，可以在 `frontend/.env` 文件中设置：

```
REACT_APP_API_URL=http://localhost:8000
```

## 🚨 故障排除

### 后端启动失败：
1. 确保Python已安装：`python --version`
2. 安装依赖：`pip install -r backend/requirements.txt`
3. 手动启动：`cd backend && python -m uvicorn app.main:app --reload`

### 前端启动失败：
1. 确保Node.js已安装：`node --version`
2. 安装依赖：`cd frontend && npm install`
3. 手动启动：`cd frontend && npm start`

### 连接问题：
1. 检查端口8000和3000是否被占用
2. 查看浏览器控制台是否有CORS错误
3. 确认后端健康状态：访问 http://localhost:8000/health

## 📱 使用流程

1. ✅ 启动服务（绿色健康状态表示连接成功）
2. 📤 上传图片
3. 🎨 进行颜色分析
4. 📝 进行文字识别
5. 📊 查看分析结果

## 🐳 Docker方式（可选）

如果您安装了Docker，可以使用：
```bash
docker-compose up --build
```

---
📞 如有问题，请检查控制台输出或联系技术支持。