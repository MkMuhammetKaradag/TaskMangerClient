import { Task } from '../../types/graphql';
import { Node } from '@xyflow/react';
interface TreeNode extends Task {
  children: TreeNode[];
}

export function buildTaskTree(tasks: Task[]): TreeNode[] {
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

function calculateSubtreeWidth(node: TreeNode, spacing: number): number {
  // Eğer düğümün çocuğu yoksa, minimum genişliği döndür
  if (node.children.length === 0) {
    return spacing;
  }

  // Çocuk düğümlerin toplam genişliğini hesapla
  return node.children
    .map((child) => calculateSubtreeWidth(child, spacing))
    .reduce((a, b) => a + b, 0);
}
export function createNodes(
  tree: TreeNode[],
  x = 0,
  y = 200,
  level = 0
): Node[] {
  let nodes: Node[] = [];
  const HORIZONTAL_SPACING = 300;
  const VERTICAL_SPACING = 200;

  // İlk seviyede x pozisyonunu sıfırla
  if (y === 200) {
    const totalWidth = tree
      .map((task) => calculateSubtreeWidth(task, HORIZONTAL_SPACING))
      .reduce((a, b) => a + b, 0);
    x = -totalWidth / 2;
  }

  let currentX = x;

  tree.forEach((task) => {
    // Alt düğümlerin genişliğini hesapla
    const subtreeWidth = calculateSubtreeWidth(task, HORIZONTAL_SPACING);

    // Mevcut düğümün pozisyonu
    const node: Node = {
      id: task._id,
      type: 'customTaskNode',
      position: {
        x: currentX + subtreeWidth / 2 - HORIZONTAL_SPACING / 2,
        y: y + level * VERTICAL_SPACING,
      },
      data: { title: task.title, task: task },
    };
    nodes.push(node);

    // Eğer alt düğümler varsa, alt düğümlerin konumlarını hesapla
    if (task.children.length > 0) {
      const childNodes = createNodes(
        task.children,
        currentX,
        y + VERTICAL_SPACING,
        level + 1
      );
      nodes = nodes.concat(childNodes);
    }

    // Bir sonraki alt düğümün başlangıç pozisyonu
    currentX += subtreeWidth;
  });

  return nodes;
}
