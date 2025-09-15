# 📸 Photo Annotation Studio

A modern, feature-rich web application for professional photo annotation and gallery management. Built with React and powered by cutting-edge UI technologies for seamless image annotation workflows.

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Installation](#-installation)
- [Usage Guide](#-usage-guide)
- [Screenshots](#-screenshots)
- [Project Structure](#-project-structure)
- [Contributing](#-contributing)
- [Contact](#-contact)

## ✨ Features

### 🖼️ Gallery Management
- **Responsive Photo Gallery** - Masonry and grid layout options
- **Smart Image Upload** - Drag & drop support with instant previews
- **Advanced Filtering** - Search by title, category, or tags
- **Lazy Loading** - Optimized performance for large image collections
- **Auto-sliding Gallery** - Beautiful carousel for featured images

### 🎯 Annotation Tools
- **Interactive Annotation Canvas** - Click and drag to create precise annotations
- **Real-time Editing** - Live annotation updates with smooth animations
- **Annotation Management** - Create, edit, and delete annotations seamlessly
- **Keyboard Shortcuts** - Efficient workflow with hotkeys (Ctrl+S to save, Arrow keys for navigation)
- **Auto-save Feature** - Never lose your work with automatic saving

### 📊 Analytics Dashboard
- **Upload Statistics** - Track daily upload patterns
- **Annotation Metrics** - Monitor annotation progress and accuracy
- **Performance Insights** - Processing speed and efficiency metrics
- **User Activity** - View engagement and usage analytics
- **Interactive Charts** - Beautiful data visualizations

### 🔐 Authentication & Security
- **User Registration/Login** - Secure authentication system
- **Protected Routes** - Role-based access control
- **Session Management** - Persistent login sessions

### 🎨 Modern UI/UX
- **Dark/Light Theme** - Seamless theme switching
- **Responsive Design** - Works perfectly on all devices
- **Smooth Animations** - Engaging micro-interactions
- **Loading States** - Enhanced user experience with shimmer effects
- **Toast Notifications** - Real-time feedback for user actions

## 🛠️ Tech Stack

### Frontend
- **React 19.1.1** - Modern React with latest features
- **Vite 7.1.2** - Lightning-fast build tool and dev server
- **React Router DOM 7.9.0** - Client-side routing
- **Tailwind CSS 4.1.13** - Utility-first CSS framework

### UI Libraries & Icons
- **Lucide React 0.544.0** - Beautiful, customizable icons
- **clsx 2.1.1** - Conditional className utility

### Development Tools
- **ESLint** - Code linting and quality assurance
- **Vite Plugin React** - Hot module replacement
- **TypeScript types** - Enhanced development experience

### State Management
- **Context API** - Global state for auth, images, and theme
- **Local Storage** - Persistent data storage

## 🚀 Installation

### Prerequisites
- **Node.js** (v18.0.0 or higher)
- **npm** or **yarn** package manager
- **Git** for version control

### Step-by-Step Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Akshayvs-Tech/HACKP.git
   cd HACKP/front-end
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to view the application

### Build for Production

```bash
# Create production build
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 📖 Usage Guide

### Getting Started

1. **Register Account** - Create a new account or login with existing credentials
2. **Upload Images** - Use the dashboard to upload your photos
3. **Browse Gallery** - Explore your images with advanced filtering options
4. **Start Annotating** - Click on any image to begin the annotation process

### Annotation Workflow

1. **Select Image** - Choose an image from the gallery
2. **Create Annotations** - Click and drag to create bounding boxes
3. **Add Details** - Label and describe your annotations
4. **Save Progress** - Use Ctrl+S or click save button
5. **Navigate Images** - Use arrow keys or navigation buttons

### Dashboard Features

- **Quick Stats** - View upload and annotation statistics
- **Recent Activity** - Track your latest annotations
- **Performance Metrics** - Monitor processing efficiency
- **Upload Center** - Batch upload multiple images

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + S` | Save annotations |
| `←/→ Arrow Keys` | Navigate between images |
| `Esc` | Close annotation modal |
| `Space` | Toggle annotation mode |

## 📁 Project Structure

```
front-end/
├── public/                     # Static assets
│   └── vite.svg
├── src/
│   ├── components/            # Reusable UI components
│   │   ├── analytics/         # Analytics and charts
│   │   │   ├── AnalyticsChart.jsx
│   │   │   └── AnalyticsDashboard.jsx
│   │   ├── animation/         # Animation components
│   │   │   └── EpicImageReveal.jsx
│   │   ├── annotation/        # Annotation tools
│   │   │   ├── AnnotationCanvas.jsx
│   │   │   ├── AnnotationInterface.jsx
│   │   │   └── PhotoAnnotationGallery.jsx
│   │   ├── auth/              # Authentication
│   │   │   ├── LoginPage.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   └── RegisterPage.jsx
│   │   ├── gallery/           # Photo gallery
│   │   │   └── PhotoGallery.jsx
│   │   ├── layout/            # Layout components
│   │   │   ├── DashboardLayout.jsx
│   │   │   ├── Header.jsx
│   │   │   └── Sidebar.jsx
│   │   └── ui/                # UI primitives
│   │       ├── Button.jsx
│   │       ├── Card.jsx
│   │       ├── Input.jsx
│   │       ├── Modal.jsx
│   │       └── Toast.jsx
│   ├── contexts/              # React contexts
│   │   ├── AuthContext.jsx    # User authentication
│   │   ├── ImageContext.jsx   # Image management
│   │   └── ThemeContext.jsx   # Theme switching
│   ├── pages/                 # Page components
│   │   ├── AnnotationsPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── GalleryPage.jsx
│   │   └── SettingsPage.jsx
│   ├── assets/                # Static images
│   │   ├── loginpage_dark.jpg
│   │   ├── loginpage_light.jpg
│   │   └── react.svg
│   ├── App.jsx                # Main app component
│   ├── main.jsx               # App entry point
│   └── index.css              # Global styles
├── eslint.config.js           # ESLint configuration
├── tailwind.config.js         # Tailwind CSS config
├── vite.config.js             # Vite configuration
├── package.json               # Dependencies and scripts
└── README.md                  # This file
```

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### Development Process

1. **Fork the repository**
   ```bash
   git fork https://github.com/Akshayvs-Tech/HACKP.git
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Make your changes**
   - Follow the existing code style
   - Add tests for new features
   - Update documentation as needed

4. **Commit your changes**
   ```bash
   git commit -m "Add amazing feature"
   ```

5. **Push to your branch**
   ```bash
   git push origin feature/amazing-feature
   ```

6. **Open a Pull Request**
   - Provide a clear description of changes
   - Include screenshots for UI changes
   - Reference any related issues

### Coding Guidelines

- Use **TypeScript** for type safety
- Follow **React best practices**
- Write **meaningful commit messages**
- Add **JSDoc comments** for complex functions
- Ensure **responsive design** principles
- Test on multiple browsers

### Reporting Issues

- Use the [GitHub Issues](https://github.com/Akshayvs-Tech/HACKP/issues) page
- Provide detailed reproduction steps
- Include browser and OS information
- Add screenshots when applicable

## 📞 Contact

### Project Maintainer
- **GitHub**: [@Akshayvs-Tech](https://github.com/Akshayvs-Tech)
- **Repository**: [HACKP](https://github.com/Akshayvs-Tech/HACKP)

### Support
- 🐛 **Bug Reports**: [Open an Issue](https://github.com/Akshayvs-Tech/HACKP/issues/new?labels=bug)
- 💡 **Feature Requests**: [Open an Issue](https://github.com/Akshayvs-Tech/HACKP/issues/new?labels=enhancement)
- 📧 **Email**: kichi4295@gmail.com
- 💬 **Discussions**: Use GitHub Discussions for questions

---

<div align="center">

**Built with ❤️ using React and Vite**

*Give this project a ⭐ if it helped you!*

</div>
