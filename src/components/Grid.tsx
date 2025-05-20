import { useRef } from 'react';
import * as THREE from 'three';
import { useGridStore } from '../store/userGridStore';
import Tile from './Tile';

const Grid = () => {
 const { grid, startNode, endNode, currentNode } = useGridStore();
  const groupRef = useRef<THREE.Group>(null);

  const gridWidth = grid[0].length;
  const gridHeight = grid.length;
  const centerX = -gridWidth / 2 + 0.5;
  const centerY = -gridHeight / 2 + 0.5;

  return (
    <group ref={groupRef} position={[centerX, centerY, 0]}>
      {/* Tiles */}
      {grid.map((row, rowIndex) =>
        row.map((node, colIndex) => (
          <Tile
            key={`${rowIndex}-${colIndex}`}
            node={node}
            isStart={rowIndex === startNode.row && colIndex === startNode.col}
            isEnd={rowIndex === endNode.row && colIndex === endNode.col}
            isCurrent={currentNode ? (rowIndex === currentNode.row && colIndex === currentNode.col) : false}
          />
        ))
      )}
    </group>
  );
};

export default Grid;