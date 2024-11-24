import { Canvas } from '@react-three/fiber'
import Scene from './components/Scene'
import { useEffect } from 'react'

function App() {
  useEffect(() => {
    const handleDoubleClick = () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen()
      } else {
        document.exitFullscreen()
      }
    }

    window.addEventListener('dblclick', handleDoubleClick)
    return () => window.removeEventListener('dblclick', handleDoubleClick)
  }, [])

  return (
    <Canvas
      className="webgl"
      shadows
      camera={{ position: [2, 2, 2], fov: 60 }}
      gl={{
        antialias: true,
        toneMapping: 3, // ACESFilmicToneMapping
        outputEncoding: 3, // sRGBEncoding
      }}
    >
      <Scene />
    </Canvas>
  )
}

export default App
