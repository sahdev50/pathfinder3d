import { useRef, useEffect } from 'react';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';
import { useGridStore, type Node } from '../store/userGridStore';

interface TileProps {
  node: Node;
  isStart: boolean;
  isEnd: boolean;
  isCurrent: boolean;  // NEW
}

const Tile = ({ node, isStart, isEnd, isCurrent }: TileProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { setNode, setStartNode, setEndNode, isRunning, isDrawingWalls } = useGridStore();

  useFrame(() => {
    if (!meshRef.current) return;

    if (isCurrent) {
      // Pulse effect for current node
      const pulse = 1 + Math.sin(Date.now() * 0.02) * 0.2;
      meshRef.current.scale.set(pulse, pulse, pulse);
      const material = meshRef.current.material as THREE.MeshStandardMaterial;
      material.emissive.set('#FF5722');
      material.emissiveIntensity = 0.7;

    } else if (node.isVisited) {
      const scale = 0.9 + Math.sin(Date.now() * 0.01) * 0.1;
      meshRef.current.scale.set(scale, scale, scale);
      const material = meshRef.current.material as THREE.MeshStandardMaterial;
      material.emissive.set('#000000');
      material.emissiveIntensity = 0;
    } else {
      // Reset scale & emissive
      meshRef.current.scale.set(1, 1, 1);
      const material = meshRef.current.material as THREE.MeshStandardMaterial;
      material.emissive.set('#000000');
      material.emissiveIntensity = 0;
    }

    if (node.isPath) {
      meshRef.current.position.z = 0.5 + Math.sin(Date.now() * 0.005) * 0.1;
    } else {
      meshRef.current.position.z = getHeight() / 2;
    }
  });

  useEffect(() => {
    return () => {
      if (meshRef.current) {
        meshRef.current.scale.set(1, 1, 1);
        meshRef.current.position.z = getHeight() / 2;
        const material = meshRef.current.material as THREE.MeshStandardMaterial;
      material.emissive.set('#000000');
      material.emissiveIntensity = 0;
      }
    };
  }, [node, isCurrent]);

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    if (isRunning) return;

    if (isDrawingWalls) {
      if (e.nativeEvent.button === 0) {
        setNode(node.row, node.col);
      }
    } else {
      if (e.nativeEvent.button === 0) {
        setStartNode(node.row, node.col);
      }
    }
  };

  const handlePointerEnter = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    if (isRunning) return;

    if (isDrawingWalls && e.nativeEvent.buttons === 1) {
      setNode(node.row, node.col);
    }
  };

  const handleContextMenu = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    if (isRunning || isDrawingWalls) return;
    setEndNode(node.row, node.col);
  };

  const getColor = () => {
    if (isStart) return '#4CAF50';
    if (isEnd) return '#F44336';
    if (node.isPath) return '#FFEB3B';
    if (node.isVisited) return '#2196F3';
    if (node.isWall) return '#607D8B';
    return '#FFFFFF';
  };

  const getHeight = () => {
    if (node.isPath) return 0.4;
    if (node.isVisited) return 0.3;
    if (isStart || isEnd) return 0.5;
    if (node.isWall) return 0.3;
    return 0.2;
  };

  return (
    <mesh
      ref={meshRef}
      position={[node.col, node.row, getHeight() / 2]}
      onPointerDown={handlePointerDown}
      onPointerEnter={handlePointerEnter}
      onContextMenu={handleContextMenu}
      castShadow
      receiveShadow
    >
      <boxGeometry args={[0.95, 0.95, getHeight()]} />
      <meshStandardMaterial
        color={getColor()}
        roughness={0.5}
        metalness={0.1}
        emissive={'#000000'} // default emissive
        emissiveIntensity={0}
      />
    </mesh>
  );
};

export default Tile;
