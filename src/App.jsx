import { Canvas } from '@react-three/fiber'
import React, { useState, useRef } from 'react'
import Scene from './components/Scene'
import Layer from './components/Layer'
import BackgroundGeneratorPopup from './components/BackgroundGeneratorPopup'
import ScreenshotHandler, { capture3DView } from './components/ScreenshotHandler'
import { combineImages } from './services/imageService'
import { Suspense } from 'react'
import { OrbitControls, Environment } from '@react-three/drei'
import * as THREE from 'three'

function App() {
  const [currentTexture, setCurrentTexture] = useState(null)
  const canvasRef = useRef(null)
  const [cameraPosition, setCameraPosition] = useState({ x: 0, y: 0, z: 2.5 })
  const [rotation, setRotation] = useState(0)
  const [renderer, setRenderer] = useState(null)
  const [sceneRef, setSceneRef] = useState(null)
  const [mainCamera, setMainCamera] = useState(null)
  const [showBackgroundPopup, setShowBackgroundPopup] = useState(false)
  const [tshirtImage, setTshirtImage] = useState(null)

  const handleScreenshot = React.useCallback(({ gl, scene, camera }) => {
    setRenderer(gl);
    setSceneRef(scene);
    setMainCamera(camera);
  }, []);

  const handleCapture = async () => {
    try {
      await capture3DView({
        renderer,
        sceneRef,
        mainCamera,
        onCapture: (imageUrl) => {
          setTshirtImage(imageUrl);
          setShowBackgroundPopup(true);
        }
      });
    } catch (error) {
      console.error('Failed to capture 3D view:', error);
    }
  };

  const handleGenerateBackground = async (backgroundUrl) => {
    try {
      const combinedImageUrl = await combineImages(tshirtImage, backgroundUrl);
      
      // Download the combined image
      const link = document.createElement('a');
      link.download = '3d-t-shirt-design-with-background.png';
      link.href = combinedImageUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setShowBackgroundPopup(false);
    } catch (error) {
      console.error('Failed to combine images:', error);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-100">
      {/* Main Content - 3D View */}
      <div className="flex-1 relative h-[60vh] lg:h-full">
        <Canvas
          ref={canvasRef}
          className="w-full h-full"
          shadows
          camera={{ 
            position: [cameraPosition.x, cameraPosition.y, cameraPosition.z], 
            fov: 35,
            near: 0.1,
            far: 1000
          }}
          gl={{
            antialias: true,
            toneMapping: THREE.ACESFilmicToneMapping,
            outputColorSpace: THREE.SRGBColorSpace,
            preserveDrawingBuffer: true,
            powerPreference: "high-performance",
            alpha: true,
            physicallyCorrectLights: true
          }}
          dpr={[1, Math.min(2, window.devicePixelRatio)]}
        >
          <Suspense fallback={null}>
            <Scene texture={currentTexture} rotation={rotation} />
            <ScreenshotHandler onScreenshot={handleScreenshot} />
            
            {/* Main camera controls */}
            <OrbitControls 
              enableDamping 
              dampingFactor={0.05}
              minDistance={2}
              maxDistance={5}
              minPolarAngle={Math.PI / 3}
              maxPolarAngle={Math.PI / 1.5}
              target={[0, 0, 0]}
              onChange={(e) => {
                const camera = e.target.object;
                setCameraPosition({
                  x: camera.position.x,
                  y: camera.position.y,
                  z: camera.position.z
                });
              }}
            />

            <Environment preset="city" />
            <ambientLight intensity={0.5} />
            <directionalLight
              position={[5, 5, 5]}
              intensity={1}
              castShadow
            />
          </Suspense>
        </Canvas>
      </div>

      {/* Editor Panel - Fixed on right side */}
      <div className="w-full lg:w-96 bg-white shadow-lg p-4 flex flex-col h-[40vh] lg:h-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Design Editor</h2>
          <button
            onClick={handleCapture}
            className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span className="hidden sm:inline">Export 3D View</span>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          <Layer 
            onTextureGenerated={(textureUrl) => setCurrentTexture(textureUrl)} 
            onRotationChange={setRotation}
            canvasRef={canvasRef}
          />
        </div>
      </div>

      {/* Background Generator Popup */}
      <BackgroundGeneratorPopup
        isOpen={showBackgroundPopup}
        onClose={() => setShowBackgroundPopup(false)}
        tshirtImage={tshirtImage}
        onGenerateBackground={handleGenerateBackground}
      />
    </div>
  )
}

export default App
