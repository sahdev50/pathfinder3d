import { create } from 'zustand';
import { aStar } from '../algorithms/aStar';
import { dijkstra } from '../algorithms/dijkstra';

export interface Node {
  row: number;
  col: number;
  isWall: boolean;
  isVisited: boolean;
  isPath: boolean;
  distance: number;
  isCurrent?: boolean;  // Add this for Dijkstra's
  g?: number;       // Keep these for A*
  h?: number;
  f?: number;
  previous: Node | null;
  
}

interface GridState {
  algorithm: 'aStar' | 'dijkstra';
  setAlgorithm: (algorithm: 'aStar' | 'dijkstra') => void;
  grid: Node[][];
  startNode: { row: number; col: number };
  endNode: { row: number; col: number };
  isRunning: boolean;
  _isAnimating: boolean;
  isDrawingWalls: boolean;
  animationSpeed: number;
  dimensions: { rows: number; cols: number };
  currentNode?: Node;
  
  // Grid management
  initializeGrid: (rows: number, cols: number) => void;
  resetGrid: () => void;
  
  // Node manipulation
  setNode: (row: number, col: number) => void;
  setStartNode: (row: number, col: number) => void;
  setEndNode: (row: number, col: number) => void;
  generateRandomWalls: () => void;
  
  // Visualization control
  visualizePath: () => Promise<void>;
  clearPath: () => void;
  clearWalls: () => void;
  
  // State management
  setIsRunning: (isRunning: boolean) => void;
  set_IsAnimating: (_isAnimating: boolean) => void;
  setIsDrawingWalls: (isDrawing: boolean) => void;
  setAnimationSpeed: (speed: number) => void;
}

export const useGridStore = create<GridState>((set, get) => ({
  grid: [],
  algorithm: 'aStar',
  startNode: { row: 0, col: 0 },
  endNode: { row: 14, col: 14 },
  isRunning: false,
  _isAnimating: false,
  isDrawingWalls: false,
  animationSpeed: 10,
  dimensions: { rows: 15, cols: 15 },

  initializeGrid: (rows, cols) => {
    const grid: Node[][] = Array(rows)
      .fill(null)
      .map((_, row) =>
        Array(cols)
          .fill(null)
          .map((_, col) => ({
            row,
            col,
            isWall: false,
            isVisited: false,
            isPath: false,
            distance:Infinity,
            g: Infinity,
            h: 0,
            f: Infinity,
            previous: null,
          }))
      );

    set({
      grid,
      startNode: { row: 0, col: 0 },
      endNode: { row: rows - 1, col: cols - 1 },
      dimensions: { rows, cols },
    });
  },

  resetGrid: () => {
    const { grid, dimensions } = get();
    const newGrid = grid.map(row =>
      row.map(node => ({
        ...node,
        isWall: false,
        isVisited: false,
        isPath: false,
        g: Infinity,
        h: 0,
        f: Infinity,
        previous: null,
      }))
    );
    set({ 
      grid: newGrid,
      startNode: { row: 0, col: 0 },
      endNode: { row: dimensions.rows - 1, col: dimensions.cols - 1 },
    });
  },

  setNode: (row, col) => {
    const { grid, startNode, endNode } = get();
    
    // Don't modify start or end nodes
    if (
      (row === startNode.row && col === startNode.col) ||
      (row === endNode.row && col === endNode.col)
    ) {
      return;
    }

    const newGrid = [...grid];
    newGrid[row][col].isWall = !newGrid[row][col].isWall;
    set({ grid: newGrid });
  },

  setStartNode: (row, col) => {
    const { grid, endNode } = get();
    
    // Prevent placing start on end node
    if (row === endNode.row && col === endNode.col) return;
    
    const newGrid = [...grid];
    
    // Remove wall if placing on wall
    newGrid[row][col].isWall = false;
    
    set({ 
      grid: newGrid,
      startNode: { row, col },
    });
  },

  setEndNode: (row, col) => {
    const { grid, startNode } = get();
    
    // Prevent placing end on start node
    if (row === startNode.row && col === startNode.col) return;
    
    const newGrid = [...grid];
    
    // Remove wall if placing on wall
    newGrid[row][col].isWall = false;
    
    set({ 
      grid: newGrid,
      endNode: { row, col },
    });
  },

  generateRandomWalls: () => {
    const { grid, startNode, endNode } = get();
    const newGrid = grid.map(row =>
      row.map(node => {
        if (
          (node.row === startNode.row && node.col === startNode.col) ||
          (node.row === endNode.row && node.col === endNode.col)
        ) {
          return node;
        }
        
        return {
          ...node,
          isWall: Math.random() < 0.3,
        };
      })
    );
    set({ grid: newGrid });
  },

  clearPath: () => {
    const { grid } = get();
    const newGrid = grid.map(row =>
      row.map(node => ({
        ...node,
        isVisited: false,
        isPath: false,
        g: Infinity,
        h: 0,
        f: Infinity,
        previous: null,
      }))
    );
    set({ grid: newGrid });
  },

  clearWalls: () => {
    const { grid, startNode, endNode } = get();
    const newGrid = grid.map(row =>
      row.map(node => {
        if (
          (node.row === startNode.row && node.col === startNode.col) ||
          (node.row === endNode.row && node.col === endNode.col)
        ) {
          return node;
        }
        return {
          ...node,
          isWall: false,
        };
      })
    );
    set({ grid: newGrid });
  },

  visualizePath: async () => {
  const { grid, startNode, endNode, isRunning, _isAnimating, animationSpeed, algorithm } = get();
  if (isRunning || _isAnimating) return;

  set({ isRunning: true });
  get().clearPath();

  try {
    const start = grid[startNode.row][startNode.col];
    const end = grid[endNode.row][endNode.col];

    let result;
    if (algorithm === 'aStar') {
      result = aStar(grid, start, end);
    } else {
      result = dijkstra(grid, start, end);
    }

    const { animationSteps, path } = result;

    set({ _isAnimating: true });

    for (let i = 0; i < animationSteps.length; i++) {
      if (!get().isRunning) break;

      // Use current store grid to preserve other nodes and states
      const snapshot = JSON.parse(JSON.stringify(get().grid));

      // Mark current node as visited and current
      const { row, col } = animationSteps[i].currentNode;
      snapshot[row][col].isVisited = true;
      snapshot[row][col].isCurrent = true;

      // Clear previous current node
      if (i > 0) {
        const { row: prevRow, col: prevCol } = animationSteps[i - 1].currentNode;
        snapshot[prevRow][prevCol].isCurrent = false;
      }

      set({ grid: snapshot });
      await new Promise((resolve) => setTimeout(resolve, 1000 / animationSpeed));
    }

    // Clear leftover isCurrent flags after animation loop
    const clearedCurrent = get().grid.map(row =>
      row.map(node => ({ ...node, isCurrent: false }))
    );
    set({ grid: clearedCurrent });

    // Animate the final path
    const pathGrid = JSON.parse(JSON.stringify(get().grid));
    for (const node of path) {
      if (!get().isRunning) break;
      await new Promise((resolve) => setTimeout(resolve, 500 / animationSpeed));
      pathGrid[node.row][node.col].isPath = true;
      set({ grid: JSON.parse(JSON.stringify(pathGrid)) });
    }
  } catch (err) {
    console.error('Error during visualization:', err);
  } finally {
    set({ isRunning: false, _isAnimating: false });
  }
},



  setIsRunning: (isRunning) => set({ isRunning }),
  set_IsAnimating: (_isAnimating) => set({ _isAnimating }),
  setAnimationSpeed: (speed) => set({ animationSpeed: speed }),
  setIsDrawingWalls: (isDrawing) => set({ isDrawingWalls: isDrawing }),
  setAlgorithm: (algorithm) => set({ algorithm }),
}));