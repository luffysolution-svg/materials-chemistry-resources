# 材料化学学术资源导航网站

一个专为材料化学专业学生设计的学术资源导航网站，提供全面的学术期刊、数据库、研究工具、在线课程和学术社区资源。

## 功能特点

- 🎯 **专业分类**：按学术期刊、数据库、研究工具、在线课程、学术社区五大类别组织资源
- 📱 **响应式设计**：完美适配桌面、平板和移动设备
- 🔍 **搜索功能**：支持关键词搜索快速定位资源
- 🎨 **现代界面**：采用渐变色设计和流畅动画效果
- ⚡ **高性能**：优化加载速度和用户体验

## 网站结构

```
materials-chemistry-resources/
├── index.html          # 主页面
├── css/
│   └── style.css       # 样式文件
├── js/
│   └── script.js       # 交互脚本
└── README.md          # 项目说明
```

## 资源分类

### 学术期刊
- Nature Materials
- Advanced Materials  
- Chemistry of Materials
- Journal of Materials Chemistry

### 数据库
- Web of Science
- SciFinder
- Materials Project
- Cambridge Structural Database

### 研究工具
- VESTA（晶体结构可视化）
- Materials Studio（材料模拟）
- OriginLab（数据分析）
- Jupyter Notebook（交互计算）

### 在线课程
- Coursera 材料科学课程
- edX 化学课程
- MIT OpenCourseWare
- 中国大学MOOC

### 学术社区
- ResearchGate
- Materials Research Society
- American Chemical Society
- 小木虫论坛

## 技术栈

- **HTML5**：语义化标签和现代结构
- **CSS3**：Flexbox布局、Grid布局、渐变、动画
- **JavaScript**：原生JS实现交互功能
- **Font Awesome**：图标库
- **Google Fonts**：字体优化

## 浏览器兼容性

支持所有现代浏览器：
- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+

## 使用方法

1. 直接在浏览器中打开 `index.html` 文件
2. 或部署到任意Web服务器

## 自定义配置

### 添加新资源
在 `index.html` 中找到对应的资源分类部分，按照现有格式添加新的资源卡片：

```html
<div class="resource-card">
    <h3>资源名称</h3>
    <p>资源描述</p>
    <a href="资源链接" target="_blank" class="resource-link">
        访问网站 <i class="fas fa-external-link-alt"></i>
    </a>
</div>
```

### 修改样式
编辑 `css/style.css` 文件：
- 修改颜色主题：调整CSS变量中的颜色值
- 调整布局：修改Grid和Flexbox相关属性
- 自定义动画：修改关键帧动画参数

### 扩展功能
在 `js/script.js` 中添加新的JavaScript功能：
- 新增搜索筛选条件
- 添加资源收藏功能
- 实现用户反馈系统

## 开发建议

1. **保持资源更新**：定期检查链接有效性，更新资源信息
2. **优化性能**：压缩图片，使用CDN加速
3. **SEO优化**：添加meta标签，优化页面结构
4. **无障碍访问**：确保网站对屏幕阅读器友好

## 许可证

本项目采用MIT许可证，欢迎自由使用和修改。

## 贡献

欢迎提交Issue和Pull Request来完善这个资源导航网站！

## 联系方式

如有问题或建议，请通过GitHub Issues提交反馈。