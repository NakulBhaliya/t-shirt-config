import React, { useRef, useEffect, Suspense } from 'react';
import { useFrame } from '@react-three/fiber';
import { Environment, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

useGLTF.preload('./t-shirtdraco.glb', true, {
  draco: {
    decoderPath: 'https://www.gstatic.com/draco/versioned/decoders/1.5.6/',
    decoderConfig: { type: 'js' },
  },
});

export default function Scene({ texture, rotation }) {
  const model = useGLTF('./t-shirtdraco.glb');
  const materialRef = useRef(null);
  const textureRef = useRef(null);
  const modelRef = useRef();

  // Add rotation animation
  useFrame((state, delta) => {
    if (modelRef.current) {
      modelRef.current.rotation.y = rotation * Math.PI / 180;
    }
  });

  useEffect(() => {
    if (texture) {
      // Load the texture using Three.js TextureLoader
      const loadedTexture = new THREE.TextureLoader().load(texture);
      loadedTexture.flipY = false;
      loadedTexture.colorSpace = THREE.SRGBColorSpace;
      loadedTexture.magFilter = THREE.LinearFilter;
      loadedTexture.minFilter = THREE.LinearMipmapLinearFilter;
      loadedTexture.anisotropy = 16;
      loadedTexture.needsUpdate = true;
      textureRef.current = loadedTexture;

      if (model.scene) {
        model.scene.traverse((child) => {
          if (child.isMesh) {
            if (!materialRef.current) {
              materialRef.current = new THREE.MeshStandardMaterial({
                map: loadedTexture,
                side: THREE.DoubleSide,
                transparent: true,
                metalness: 0.2,
                roughness: 0.8,
              });
            } else {
              materialRef.current.map = loadedTexture;
              materialRef.current.needsUpdate = true;
            }
            child.material = materialRef.current;
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });
      }
    }

    return () => {
      if (textureRef.current) {
        textureRef.current.dispose();
      }
    };
  }, [texture, model.scene]);

  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight
        position={[0, 5, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <directionalLight
        position={[-5, 5, -5]}
        intensity={0.5}
        castShadow
      />
      <Environment preset="city" intensity={0.7} />
      <Suspense fallback={null}>
        <primitive 
          ref={modelRef}
          object={model.scene} 
          scale={window.innerWidth < 768 ? 1.5 : 2} 
          position={[0, -0.2, 0]} 
          rotation={[0, Math.PI, 0]} 
        />
      </Suspense>
    </>
  );
}
