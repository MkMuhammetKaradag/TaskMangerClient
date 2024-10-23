import { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { TaskColumn } from './TaskColumn';
import { TaskCard } from './TaskCard';
import { Task, TaskStatus } from '../../../types/graphql';
import { useMutation } from '@apollo/client';
import { UPDATE_TASK_STATUS } from '../../../graphql/mutations';

const statusColumns = ['TODO', 'IN_PROGRESS', 'DONE', 'REVIEW'];
interface UpdateTaskStatusMutationResult {
  getAllMyTasks: Task[];
}

interface UpdateTaskStatusVariables {
  input: {
    taskId: string;
    status: TaskStatus;
  };
}

export const KanbanBoard = ({ initialTasks }: { initialTasks: Task[] }) => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [updateTaskStatus, { loading }] = useMutation<
    UpdateTaskStatusMutationResult,
    UpdateTaskStatusVariables
  >(UPDATE_TASK_STATUS);

  const handeChangeStatus = (taskId: string, status: TaskStatus) => {
    try {
      updateTaskStatus({
        variables: {
          input: { taskId, status },
        },
      });
      return true;
    } catch (error) {
      return false;
      console.error(error);
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const findContainer = (id: string) => {
    const task = tasks.find((task) => task._id === id);
    return task ? task.status : null;
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveId(null);
      return;
    }

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeTask = tasks.find((task) => task._id === activeId);
    const overTask = tasks.find((task) => task._id === overId);

    if (!activeTask) {
      setActiveId(null);
      return;
    }

    // Eğer over bir task ise, onun container'ını bul
    const activeContainer = findContainer(activeId);
    const overContainer = overTask ? findContainer(overId) : overId;

    if (!activeContainer || !overContainer) {
      setActiveId(null);
      return;
    }

    // Aynı container içinde sıralama
    if (activeContainer === overContainer) {
      const containerTasks = tasks.filter(
        (task) => task.status === activeContainer
      );
      const otherTasks = tasks.filter(
        (task) => task.status !== activeContainer
      );

      const oldIndex = containerTasks.findIndex(
        (task) => task._id === activeId
      );
      const newIndex = containerTasks.findIndex((task) => task._id === overId);

      if (oldIndex !== -1 && newIndex !== -1) {
        const reorderedContainerTasks = arrayMove(
          containerTasks,
          oldIndex,
          newIndex
        );

        // Yeni sıralanmış array'i ve diğer container'ların task'larını birleştir

        setTasks([...otherTasks, ...reorderedContainerTasks]);
      }
    }
    // Farklı container'lar arası geçiş
    else {
      const updatedTasks = tasks.map((task) => {
        if (task._id === activeId) {
          return {
            ...task,
            status: overContainer as Task['status'],
          };
        }
        return task;
      });
      const otherTasks = updatedTasks.filter(
        (task) => task.status !== overContainer
      );

      // Hedef container'daki taskların sırasını ayarla
      const targetContainerTasks = tasks.filter(
        (task) => task.status === overContainer
      );

      const targetIndex = overTask
        ? targetContainerTasks.findIndex((task) => task._id === overId)
        : targetContainerTasks.length;

      const movedTask = updatedTasks.find((task) => task._id === activeId)!;
      const newTargetTasks = [...targetContainerTasks];

      // Task'ı hedef pozisyona ekle
      if (targetIndex !== -1) {
        newTargetTasks.splice(targetIndex, 0, movedTask);
      } else {
        newTargetTasks.push(movedTask);
      }

      //   console.log(newTargetTasks);
      // Taşınan task'ı çıkar (duplike olmaması için)
      //   const finalTargetTasks = newTargetTasks.filter(
      //     (task, index, self) =>
      //       index === self.findIndex((t) => t._id === task._id)
      //   );
      if (handeChangeStatus(movedTask._id, overContainer as Task['status'])) {
        setTasks([...otherTasks, ...newTargetTasks]);
      }
      // console.log(overContainer, movedTask._id); // change task status
    }

    setActiveId(null);
  };

  const getTasksByStatus = (status: Task['status']) => {
    return tasks.filter((task) => task.status === status);
  };

  return (
    <div className="p-4">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex   justify-between">
          {statusColumns.map((status) => (
            <TaskColumn
              key={status}
              status={status as Task['status']}
              tasks={getTasksByStatus(status as Task['status'])}
            />
          ))}
        </div>

        <DragOverlay
          dropAnimation={{
            duration: 200,
            easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
          }}
        >
          {activeId ? (
            <TaskCard
              task={tasks.find((task) => task._id === activeId)!}
              isDragging={true}
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};
