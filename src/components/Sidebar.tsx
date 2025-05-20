import { useGridStore } from '../store/userGridStore';
import { FaPlay, FaUndo, FaTrash, FaRandom, FaArrowsAlt, FaPencilAlt } from 'react-icons/fa';

const Sidebar = () => {
  const {
    isRunning,
    isDrawingWalls,
    dimensions,
    animationSpeed,
    initializeGrid,
    visualizePath,
    clearPath,
    clearWalls,
    resetGrid,
    generateRandomWalls,
    setAnimationSpeed,
    setIsDrawingWalls,
    algorithm,
    setAlgorithm,
  } = useGridStore();

  const gridSizes = [
    { label: 'S', value: 10 },
    { label: 'M', value: 15 },
    { label: 'L', value: 25 },
  ];

  return (
    <div className="w-64 h-screen bg-gray-800 text-white p-4 flex flex-col overflow-hidden">
      <div className="mb-2">
        <h3 className="text-xs uppercase tracking-wider text-gray-300 mb-1">Algorithm</h3>
        <div className="grid grid-cols-2 gap-1">
          <button
            onClick={() => setAlgorithm('aStar')}
            className={`py-1 text-xs rounded ${
              algorithm === 'aStar' ? 'bg-blue-600' : 'bg-gray-700'
            } ${isRunning ? 'opacity-50' : 'hover:bg-opacity-80'}`}
            disabled={isRunning}
          >
            A* Search
          </button>
          <button
            onClick={() => setAlgorithm('dijkstra')}
            className={`py-1 text-xs rounded ${
              algorithm === 'dijkstra' ? 'bg-blue-600' : 'bg-gray-700'
            } ${isRunning ? 'opacity-50' : 'hover:bg-opacity-80'}`}
            disabled={isRunning}
          >
            Dijkstra's
          </button>
        </div>
      </div>

      <div className="space-y-4 overflow-y-auto flex-grow pr-2">
        {/* Grid Size */}
        <div>
          <h3 className="text-xs uppercase tracking-wider text-gray-300 mb-1">Grid</h3>
          <div className="grid grid-cols-3 gap-1">
            {gridSizes.map((size) => (
              <button
                key={size.value}
                onClick={() => initializeGrid(size.value, size.value)}
                disabled={isRunning}
                className={`py-1 text-xs rounded ${
                  dimensions.rows === size.value ? 'bg-blue-600' : 'bg-gray-700'
                } ${isRunning ? 'opacity-50' : 'hover:bg-opacity-80'}`}
              >
                {size.label}
              </button>
            ))}
          </div>
        </div>

        {/* Visualization */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <h3 className="text-xs uppercase tracking-wider text-gray-300">Visualize</h3>
            <button
              onClick={visualizePath}
              disabled={isRunning}
              className={`py-1 px-2 text-xs bg-green-600 rounded flex items-center ${
                isRunning ? 'opacity-50' : 'hover:bg-green-700'
              }`}
            >
              <FaPlay className="mr-1" /> Run
            </button>
          </div>
          <div className="flex items-center space-x-2 text-xs">
            <span>Speed:</span>
            <input
              type="range"
              min="1"
              max="20"
              value={animationSpeed}
              onChange={(e) => setAnimationSpeed(Number(e.target.value))}
              className="w-full"
              disabled={isRunning}
            />
          </div>
        </div>

        {/* Controls */}
        <div>
          <h3 className="text-xs uppercase tracking-wider text-gray-300 mb-1">Controls</h3>
          <button
            onClick={() => setIsDrawingWalls(!isDrawingWalls)}
            className={`w-full py-1 mb-1 text-xs rounded flex items-center justify-center ${
              isDrawingWalls ? 'bg-blue-600' : 'bg-gray-700'
            } ${isRunning ? 'opacity-50' : 'hover:bg-opacity-80'}`}
            disabled={isRunning}
          >
            <FaPencilAlt className="mr-1" />
            {isDrawingWalls ? 'Drawing Walls' : 'Place Nodes'}
          </button>
          <div className="text-2xs p-1 bg-gray-700 rounded">
            {isDrawingWalls ? (
              <p>Wall - Mode Activated</p>
            ) : (
              <p className='text-sm'> - Left click for starting point <br/>
              - Right click for ending point</p>
            )}
          </div>
        </div>

        {/* Generate & Clear */}
        <div className="grid grid-cols-2 gap-1">
          <button
            onClick={generateRandomWalls}
            disabled={isRunning}
            className={`py-1 text-xs bg-purple-600 rounded flex items-center justify-center ${
              isRunning ? 'opacity-50' : 'hover:bg-purple-700'
            }`}
          >
            <FaRandom className="mr-1" /> Random
          </button>
          <button
            onClick={clearWalls}
            disabled={isRunning}
            className={`py-1 text-xs bg-gray-700 rounded flex items-center justify-center ${
              isRunning ? 'opacity-50' : 'hover:bg-gray-600'
            }`}
          >
            <FaTrash className="mr-1" /> Walls
          </button>
          <button
            onClick={clearPath}
            disabled={isRunning}
            className={`py-1 text-xs bg-gray-700 rounded flex items-center justify-center ${
              isRunning ? 'opacity-50' : 'hover:bg-gray-600'
            }`}
          >
            <FaUndo className="mr-1" /> Path
          </button>
          <button
            onClick={resetGrid}
            disabled={isRunning}
            className={`py-1 text-xs bg-gray-700 rounded flex items-center justify-center ${
              isRunning ? 'opacity-50' : 'hover:bg-gray-600'
            }`}
          >
            <FaArrowsAlt className="mr-1" /> Reset
          </button>
        </div>

        {/* Legend */}
        <div className="pt-2 border-t border-gray-600">
          <h3 className="text-xs uppercase tracking-wider text-gray-300 mb-1">Legend</h3>
          <div className="grid grid-cols-2 gap-1 text-2xs">
            <div className="flex items-center">
              <div className="w-2 h-2 mr-1 rounded-sm bg-green-600"></div>
              <span>Start</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 mr-1 rounded-sm bg-red-600"></div>
              <span>End</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 mr-1 rounded-sm bg-gray-600"></div>
              <span>Wall</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 mr-1 rounded-sm bg-blue-500"></div>
              <span>Visited</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 mr-1 rounded-sm bg-yellow-400"></div>
              <span>Path</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;