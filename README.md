# T-Shirt Customization App

A modern web application for customizing t-shirts in 3D using React Three Fiber. This application allows users to visualize and customize t-shirts with different colors, patterns, and designs in real-time.

## Features
- 3D t-shirt visualization using React Three Fiber
- Real-time color customization
- Pattern and design application
- Background pattern generation
- Screenshot capability
- Layer-based design system
- Responsive 3D canvas
- Interactive camera controls

## Tech Stack
- React
- React Three Fiber (@react-three/fiber)
- Three.js
- Vite
- GLTF/GLB 3D model support

## Project Structure
```
├── src/
│   ├── components/
│   │   ├── Scene.jsx          # Main 3D scene setup
│   │   ├── Layer.jsx          # Layer management component
│   │   ├── BackgroundGeneratorPopup.jsx  # Background pattern generator
│   │   └── ScreenshotHandler.jsx  # Screenshot functionality
│   ├── services/
│   │   └── imageService.js    # Image processing services
│   ├── config/               # Configuration files
│   ├── App.jsx
│   └── main.jsx
├── public/
│   └── t-shirtdraco.glb      # 3D t-shirt model
├── index.html
├── package.json
└── vite.config.js
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/NakulBhaliya/t-shirt-config.git

# Navigate to project directory
cd t-shirt-config

# Install dependencies
npm install

# Start the development server
npm run dev
```

The application will be available at `http://localhost:5173`

### Building for Production
```bash
npm run build
```

## Usage
1. The 3D t-shirt will be displayed in the main viewport
2. Use the mouse to rotate and zoom the t-shirt:
   - Left click + drag to rotate
   - Right click + drag to pan
   - Scroll to zoom
3. Use the customization panel to:
   - Change t-shirt colors
   - Apply patterns and designs
   - Generate background patterns
   - Take screenshots of your design

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Author
[Nakul Bhaliya](https://github.com/NakulBhaliya)
