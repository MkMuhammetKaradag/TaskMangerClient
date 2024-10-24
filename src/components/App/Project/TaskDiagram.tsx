import React, { useState, useCallback, useEffect } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  applyNodeChanges,
  applyEdgeChanges,
  OnNodesChange,
  OnEdgesChange,
  NodeTypes,
  MarkerType,
  OnConnect,
  addEdge,
  Connection,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Task } from '../../../types/graphql';
import { getTaskStatusColor } from '../../../utils/status';

import DownloadButton from './DownloadButton';
import {
  buildTaskTree,
  createNodes,
} from '../../../utils/TaskDiagram/createNodes';
import { CustomTaskNode } from './CustomTaskNode';
import { CustomProjectNode } from './CustomProjectNode';

const nodeTypes: NodeTypes = {
  customTaskNode: CustomTaskNode,
  customProjectNode: CustomProjectNode,
};

interface TaskDiagramProps {
  tasks: Task[];
}

function generateHierarchicalTaskNodes(tasks: Task[]): Node[] {
  const taskTree = buildTaskTree(tasks);

  return createNodes(taskTree);
}

const TaskDiagram: React.FC<TaskDiagramProps> = ({ tasks }) => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );

  // Döngüsel bağlantı kontrolü için yardımcı fonksiyon
  const hasPath = (
    edges: Edge[],
    startNode: string,
    endNode: string,
    visited: Set<string> = new Set()
  ): boolean => {
    if (startNode === endNode) return true;
    if (visited.has(startNode)) return false;

    visited.add(startNode);

    const nextNodes = edges
      .filter((edge) => edge.source === startNode)
      .map((edge) => edge.target);

    return nextNodes.some((node) => hasPath(edges, node, endNode, visited));
  };

  // Bir node'un tüm alt node'larını bulan fonksiyon
  const getAllDescendants = (
    edges: Edge[],
    nodeId: string,
    descendants: Set<string> = new Set()
  ): Set<string> => {
    const childNodes = edges
      .filter((edge) => edge.source === nodeId)
      .map((edge) => edge.target);

    childNodes.forEach((childId) => {
      descendants.add(childId);
      getAllDescendants(edges, childId, descendants);
    });

    return descendants;
  };
  const onConnect = useCallback(
    (connection: Connection) => {
      if (!connection.source || !connection.target) return;

      // Hedefin zaten bir bağlantısı var mı kontrol et
      const targetHasConnection = edges.some(
        (edge) => edge.target === connection.target
      );

      // Döngüsel bağlantı kontrolü
      const wouldCreateCycle = hasPath(
        edges,
        connection.target,
        connection.source
      );

      // Alt node'ları kontrol et
      const descendants = getAllDescendants(edges, connection.target);
      if (descendants.has(connection.source)) {
        alert("Bir node, alt node'unun hedefine bağlanamaz!");
        return;
      }

      if (wouldCreateCycle) {
        alert('Bu bağlantı döngüsel bir yapı oluşturacağı için yapılamaz!');
        return;
      }

      const newConnection = {
        ...connection,
        id: `e${connection.source}-${connection.target}`,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 10,
          height: 10,
          color: '#888',
        },
        style: { stroke: '#888', strokeWidth: 4 },
        interactionWidth: 10,
      };

      if (targetHasConnection) {
        // Eski bağlantıyı sil ve yenisini ekle
        setEdges((edges) => [
          ...edges.filter((edge) => edge.target !== connection.target),
          newConnection,
        ]);
      } else {
        // Yeni bağlantı ekle
        setEdges((edges) => [...edges, newConnection]);
      }
    },
    [edges]
  );

  // Bağlantı silme işlemi için yeni fonksiyon
  const onEdgeClick = useCallback(
    (event: React.MouseEvent, edge: Edge) => {
      console.log(edge.id);
      setEdges((eds) => eds.filter((e) => e.id !== edge.id));
    },
    [setEdges]
  );
  useEffect(() => {
    const projectNode: Node = {
      id: 'project',
      type: 'customProjectNode',
      position: { x: 0, y: 0 },
      data: { title: 'Project' },
    };

    const taskNodes: Node[] = generateHierarchicalTaskNodes(tasks);

    const taskEdges: Edge[] = tasks.map((task) => ({
      id: `e${task._id}-${task.parentTask?._id || 'project'}`,
      source: task.parentTask?._id || 'project',
      target: task._id,
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 10,
        height: 10,
        color: getTaskStatusColor(task.status),
      },
      style: { stroke: getTaskStatusColor(task.status), strokeWidth: 4 },
      interactionWidth: 10,
    }));

    setNodes([projectNode, ...taskNodes]);
    setEdges(taskEdges);
  }, [tasks]);

  return (
    <div className="w-full h-[90vh]">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onEdgeClick={onEdgeClick} // Bağlantı tıklama olayını ekledik
        fitView
        nodeTypes={nodeTypes}
        className="download-image"
        // Mobil için dokunmatik etkileşimleri etkinleştir
        panOnScroll={true}
        panOnDrag={true}
        zoomOnScroll={false}
        zoomOnPinch={true}
        zoomOnDoubleClick={false}
        // Dokunmatik cihazlar için özel ayarlar

        panOnScrollSpeed={0.5}
        minZoom={0.2}
        maxZoom={4}
        // Performans optimizasyonları
        defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
        snapToGrid={false}
        // Mobil için CSS ayarları
        // style={{
        //   touchAction: 'none',
        //   width: '100%',
        //   height: '100%',
        // }}
      >
        <DownloadButton />
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
};

export default TaskDiagram;
