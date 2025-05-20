import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import Grid from './components/Grid';
import Sidebar from './components/Sidebar';
import { useGridStore } from './store/userGridStore';
import { useEffect } from 'react';

const App = () => {
  const {
    initializeGrid 
  } = useGridStore();

  useEffect(() => {
    initializeGrid(15, 15);
  }, [initializeGrid]);

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 bg-[radial-gradient(circle_at_top_left,_#e0fdfb,_#ccfbf1,_#a7f3eb,_#99f6e4)]">
  <Canvas shadows style={{ background: 'transparent' }}>
          <PerspectiveCamera makeDefault position={[0, 0, 20]} fov={50} />
          <ambientLight intensity={0.5} />
          <directionalLight
            position={[10, 10, 10]}
            intensity={1}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />
          <Grid />
          <OrbitControls 
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={5}
            maxDistance={50}
          />
        </Canvas>
      </div>
    </div>
  );
};

export default App;