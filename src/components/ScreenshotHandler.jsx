import React from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

const ScreenshotHandler = ({ onScreenshot }) => {
  const { gl, scene, camera } = useThree();
  
  React.useEffect(() => {
    if (onScreenshot) {
      onScreenshot({ gl, scene, camera });
    }
  }, [gl, scene, camera, onScreenshot]);
  
  return null;
};

export const capture3DView = async ({ renderer, sceneRef, mainCamera, onCapture }) => {
  if (!renderer || !sceneRef || !mainCamera) {
    throw new Error('Missing required refs');
  }

  try {
    // Get the current viewport size
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const aspectRatio = viewportWidth / viewportHeight;
    
    // Set dimensions to 1080x1080 for high quality
    const width = 1080;
    const height = 1080;

    const renderTarget = new THREE.WebGLRenderTarget(width, height, {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
      type: THREE.UnsignedByteType,
      encoding: THREE.sRGBEncoding
    });

    const originalRenderTarget = renderer.getRenderTarget();
    const originalSize = renderer.getSize(new THREE.Vector2());
    
    // Store original camera properties
    const originalAspect = mainCamera.aspect;
    const originalFov = mainCamera.fov;
    
    // Update camera for capture
    mainCamera.aspect = width / height;
    mainCamera.fov = 35; // Match the scene camera FOV
    mainCamera.updateProjectionMatrix();
    
    renderer.setRenderTarget(renderTarget);
    renderer.setSize(width, height, false);
    
    // Render the scene
    renderer.render(sceneRef, mainCamera);
    
    // Restore original camera properties
    mainCamera.aspect = originalAspect;
    mainCamera.fov = originalFov;
    mainCamera.updateProjectionMatrix();
    
    const buffer = new Uint8Array(width * height * 4);
    renderer.readRenderTargetPixels(renderTarget, 0, 0, width, height, buffer);
    
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = width;
    tempCanvas.height = height;
    const tempContext = tempCanvas.getContext('2d');
    
    const tempImageData = new ImageData(new Uint8ClampedArray(buffer), width, height);
    tempContext.putImageData(tempImageData, 0, 0);
    
    context.scale(1, -1);
    context.drawImage(tempCanvas, 0, -height);
    context.scale(1, -1);

    const imageUrl = canvas.toDataURL('image/png', 1.0);
    
    renderer.setRenderTarget(originalRenderTarget);
    renderer.setSize(originalSize.x, originalSize.y, false);
    renderTarget.dispose();
    
    onCapture(imageUrl);
  } catch (error) {
    console.error('Error during capture:', error);
    throw error;
  }
};

export default ScreenshotHandler; 