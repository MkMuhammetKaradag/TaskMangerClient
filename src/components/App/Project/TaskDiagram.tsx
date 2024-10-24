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
        fitView
        nodeTypes={nodeTypes}
        className="download-image"
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
