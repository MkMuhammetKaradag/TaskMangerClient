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
  Handle,
  Position,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Task } from '../../../types/graphql';
import {
  getTaskPriorityColor,
  getTaskStatusColor,
  getTaskStatusText,
} from '../../../utils/status';

const CustomTaskNode: React.FC<{
  data: { title: string; task: Task };
}> = ({ data: { task, title } }) => (
  <div
    className="border w-56 border-gray-500 shadow-md p-5 rounded-md cursor-move"
    style={{
      backgroundColor: getTaskPriorityColor(task.priority),
    }}
  >
    <h3
      onClick={() => console.log('click', task._id)}
      className=" cursor-pointer m-0 mb-2"
    >
      {task.title}
    </h3>
    <p
      className="m-1 p-1 inline-block rounded"
      style={{
        backgroundColor: getTaskStatusColor(task.status),
      }}
    >
      Status: {getTaskStatusText(task.status)}
    </p>
    <p className="m-1">Priority: {task.priority}</p>
    <p className="m-1">Due: {new Date(+task.dueDate).toLocaleDateString()}</p>

    <Handle type="target" position={Position.Top} />
    <Handle type="source" position={Position.Bottom} />
  </div>
);

const CustomProjectNode: React.FC<{
  data: { title: string };
}> = ({ data: { title } }) => (
  <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-stone-400">
    <h1>{title}</h1>

    {/* <Handle type="target" position={Position.Top} /> */}
    <Handle type="source" position={Position.Bottom} />
  </div>
);

const nodeTypes: NodeTypes = {
  customTaskNode: CustomTaskNode,
  customProjectNode: CustomProjectNode,
};

interface TaskDiagramProps {
  tasks: Task[];
}
interface TreeNode extends Task {
  children: TreeNode[];
}

function buildTaskTree(tasks: Task[]): TreeNode[] {
  const taskMap: Record<string, TreeNode> = {};
  const roots: TreeNode[] = [];

  // First pass: create TreeNode objects
  tasks.forEach((task) => {
    taskMap[task._id] = { ...task, children: [] };
  });

  // Second pass: build the tree structure
  tasks.forEach((task) => {
    if (task.parentTask) {
      const parent = taskMap[task.parentTask._id];
      if (parent) {
        parent.children.push(taskMap[task._id]);
      }
    } else {
      roots.push(taskMap[task._id]);
    }
  });

  return roots;
}
function createNodes(tree: TreeNode[], x = 0, y = 100, level = 0): Node[] {
  let nodes: Node[] = [];
  const HORIZONTAL_SPACING = 300;
  const VERTICAL_SPACING = 200;
  if (y == 100) {
    x = tree.length * -123;
  }

  tree.forEach((task, index) => {
    const node: Node = {
      id: task._id,
      type: 'customTaskNode',
      position: {
        x: x + index * HORIZONTAL_SPACING,
        y: y + level * VERTICAL_SPACING,
      },
      data: { title: task.title, task: task },
    };
    nodes.push(node);

    if (task.children.length > 0) {
      const childNodes = createNodes(
        task.children,
        x +
          index * HORIZONTAL_SPACING -
          ((task.children.length - 1) * HORIZONTAL_SPACING) / 2,
        y + VERTICAL_SPACING,
        level + 1
      );
      nodes = nodes.concat(childNodes);
    }
  });

  return nodes;
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
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
};

export default TaskDiagram;
