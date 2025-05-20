import type { Node } from '../store/userGridStore';

const heuristic = (a: Node, b: Node) => {
  // Manhattan distance
  return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
};

export const aStar = (
  grid: Node[][],
  startNode: Node,
  endNode: Node
) => {
  const openSet: Node[] = [];
  const visitedNodesInOrder: Node[] = [];
  const animationSteps: { grid: Node[][]; currentNode: Node }[] = [];

  startNode.g = 0;
  startNode.h = heuristic(startNode, endNode);
  startNode.f = startNode.g + startNode.h;
  openSet.push(startNode);

  while (openSet.length > 0) {
    openSet.sort((a, b) => a.f! - b.f!);
    const current = openSet.shift()!;
    current.isVisited = true;
    visitedNodesInOrder.push(current);

    // Snapshot before updating neighbors, with currentNode
    animationSteps.push({
      grid: deepCopyGrid(grid),
      currentNode: current,
    });

    if (current === endNode) {
      return {
        animationSteps,
        visitedNodes: visitedNodesInOrder,
        path: getPath(endNode),
      };
    }

    const neighbors = getNeighbors(current, grid);
    for (const neighbor of neighbors) {
      const tentativeG = current.g! + 1;
      if (tentativeG < neighbor.g!) {
        neighbor.previous = current;
        neighbor.g = tentativeG;
        neighbor.h = heuristic(neighbor, endNode);
        neighbor.f = neighbor.g + neighbor.h;
        if (!openSet.includes(neighbor)) {
          openSet.push(neighbor);
        }
      }
    }
  }

  return { animationSteps, visitedNodes: visitedNodesInOrder, path: [] };
};


const getNeighbors = (node: Node, grid: Node[][]) => {
  const neighbors: Node[] = [];
  const { row, col } = node;
  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
  return neighbors.filter((neighbor) => !neighbor.isVisited && !neighbor.isWall);
};

const getPath = (endNode: Node) => {
  const path: Node[] = [];
  let currentNode: Node | null = endNode;
  while (currentNode !== null) {
    path.unshift(currentNode);
    currentNode = currentNode.previous;
  }
  return path;
};

// Deep copy the grid (to avoid mutation bugs in animation)
const deepCopyGrid = (grid: Node[][]): Node[][] =>
  grid.map(row => row.map(node => ({ ...node })));
