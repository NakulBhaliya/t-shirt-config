import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'

export default function Scene() {
  const boxRef = useRef()

  useFrame((state, delta) => {
    boxRef.current.rotation.x += delta * 0.5
    boxRef.current.rotation.y += delta * 0.5
  })

  return (
    <>
      {/* Lights */}
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[-2, 2, 1]}
        intensity={1}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      {/* Green Box */}
      <mesh ref={boxRef} castShadow receiveShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          color={0x00ff00}
          roughness={0.7}
          metalness={0.3}
        />
      </mesh>

      {/* Controls */}
      <OrbitControls
        enableDamping
        dampingFactor={0.05}
      />
    </>
  )
}
