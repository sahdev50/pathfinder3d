import type { Node } from '../store/userGridStore';

export const dijkstra = (
  grid: Node[][],
  startNode: Node,
  endNode: Node
) => {
  const visitedNodesInOrder: Node[] = [];
  const unvisitedNodes: Node[] = [];

  const animationSteps: { grid: Node[][]; currentNode: Node }[] = [];

  for (const row of grid) {
    for (const node of row) {
      node.distance = Infinity;
      node.previous = null;
      node.isVisited = false;
      node.isPath = false;
      unvisitedNodes.push(node);
    }
  }

  startNode.distance = 0;

  while (unvisitedNodes.length > 0) {
    unvisitedNodes.sort((a, b) => a.distance - b.distance);
    const closestNode = unvisitedNodes.shift()!;
    if (closestNode.isWall) continue;
    if (closestNode.distance === Infinity) break;

    closestNode.isVisited = true;
    visitedNodesInOrder.push(closestNode);

    // Snapshot after visiting node, include currentNode only
    const snapshot = deepCopyGrid(grid);
    animationSteps.push({
      grid: snapshot,
      currentNode: closestNode,
    });

    if (closestNode === endNode) {
      const path = reconstructPath(endNode);
      return { animationSteps, visitedNodes: visitedNodesInOrder, path };
    }

    updateUnvisitedNeighbors(closestNode, grid);
  }

  return { animationSteps, visitedNodes: visitedNodesInOrder, path: [] };
};

const reconstructPath = (endNode: Node): Node[] => {
  const path: Node[] = [];
  let current: Node | null = endNode;
  while (current !== null) {
    path.unshift(current);
    current = current.previous;
  }
  return path;
};

const updateUnvisitedNeighbors = (node: Node, grid: Node[][]) => {
  const neighbors = getUnvisitedNeighbors(node, grid);
  for (const neighbor of neighbors) {
    const tentativeDistance = node.distance + 1; // assuming uniform cost
    if (tentativeDistance < neighbor.distance) {
      neighbor.distance = tentativeDistance;
      neighbor.previous = node;
    }
  }
};

const getUnvisitedNeighbors = (node: Node, grid: Node[][]): Node[] => {
  const { row, col } = node;
  const neighbors: Node[] = [];

  if (row > 0) neighbors.push(grid[row - 1][col]);
  if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
  if (col > 0) neighbors.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);

  return neighbors.filter(n => !n.isVisited && !n.isWall);
};




// Deep copy the grid (to avoid mutation bugs in animation)
const deepCopyGrid = (grid: Node[][]): Node[][] =>
  grid.map(row => row.map(node => ({ ...node })));
