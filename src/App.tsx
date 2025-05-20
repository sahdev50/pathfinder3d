import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import Grid from './components/Grid';
import Sidebar from './components/Sidebar';
import { useGridStore } from './store/userGridStore';
import { useEffect } from 'react';
import { aStar } from './algorithms/aStar';

const App = () => {
  const { 
    grid, 
    startNode, 
    endNode, 
    isRunning, 
    isAnimating,
    animationSpeed,
    setIsRunning, 
    setIsAnimating,
    clearPath,
    initializeGrid 
  } = useGridStore();

  useEffect(() => {
    initializeGrid(15, 15);
  }, [initializeGrid]);

  const visualizePath = async () => {
    if (isRunning) return;
    
    setIsRunning(true);
    clearPath();

    // Run A* algorithm
    const { path, visitedNodes } = aStar(grid, startNode, endNode);

    // Animation function
    const animate = async () => {
      setIsAnimating(true);
      
      // Animate visited nodes
      for (const node of visitedNodes) {
        if (!isRunning) break;
        await new Promise(resolve => setTimeout(resolve, 1000 / animationSpeed));
        const newGrid = [...grid];
        newGrid[node.row][node.col].isVisited = true;
        useGridStore.setState({ grid: newGrid });
      }

      // Animate path
      for (const node of path) {
        if (!isRunning) break;
        await new Promise(resolve => setTimeout(resolve, 500 / animationSpeed));
        const newGrid = [...grid];
        newGrid[node.row][node.col].isPath = true;
        useGridStore.setState({ grid: newGrid });
      }

      setIsAnimating(false);
      setIsRunning(false);
    };

    await animate();
  };

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