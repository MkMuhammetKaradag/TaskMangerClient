import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import { useQuery } from '@apollo/client';
import { useParams } from 'react-router-dom';
import { GET_ALL_TASKS_BY_PROJECT } from '../../graphql/queries';
import Draggable from 'react-draggable';
import { Task } from '../../types/graphql';
import Xarrow, { useXarrow, Xwrapper } from 'react-xarrows';
import {
  getTaskPriorityColor,
  getTaskStatusColor,
  getTaskStatusText,
} from '../../utils/status';
import TaskDiagram from '../../components/App/Project/TaskDiagram';

interface ProjectTasksQueryResult {
  getAllTasksByProject: Task[];
}

interface OperationVariables {
  projectId?: string;
}

const DraggableBox = React.memo(
  ({
    task,
    index,
    bounds,
  }: {
    task: Task;
    index: number;
    bounds: { left: number; top: number; right: number; bottom: number };
  }) => {
    const taskRef = useRef<HTMLDivElement>(null);
    const updateXarrow = useXarrow();

    return (
      <Draggable
        nodeRef={taskRef}
        onDrag={updateXarrow}
        onStop={updateXarrow}
        bounds={'parent'}
        defaultPosition={{
          x: 100 + (index % 8) * 230,
          y: Math.floor(index / 8) * 200,
        }}
      >
        <div
          ref={taskRef}
          id={task._id}
          className="absolute border w-56 border-gray-500 shadow-md p-5 rounded-md cursor-move"
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
          <p className="m-1">
            Due: {new Date(+task.dueDate).toLocaleDateString()}
          </p>
        </div>
      </Draggable>
    );
  }
);

const Project = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { data, loading, error } = useQuery<
    ProjectTasksQueryResult,
    OperationVariables
  >(GET_ALL_TASKS_BY_PROJECT, {
    variables: { projectId },
  });

  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    if (data) {
      setTasks(data.getAllTasksByProject);
    }
  }, [data]);


  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="p-5 h-screen overflow-auto">
      <h1>Project Tasks</h1>
      <div>
        {/* <div
          ref={divRef}
          style={{
            height: '90vh',
            minHeight: '400px',
            minWidth: '600px',
            width: '100%',
          }}
          className="relative  zoomable  border-2 border-blue-500"
        >
          <Xwrapper>
            <Draggable
              nodeRef={projectRef}
              bounds={'parent'}
              defaultPosition={{ x: 20, y: 20 }}
            >
              <div
                ref={projectRef}
                id="project"
                className="absolute cursor-move border p-3 rounded-md bg-gray-200 border-black shadow-md"
              >
                Project
              </div>
            </Draggable>
            {tasks.map((task, index) => (
              <React.Fragment key={task._id}>
                <DraggableBox index={index} task={task} bounds={bounds} />
                <Xarrow
                  color={getTaskStatusColor(task.status)}
                  headSize={3}
                  strokeWidth={3}
                  start={task._id}
                  end={task.parentTask?._id || 'project'}
                />
              </React.Fragment>
            ))}
          </Xwrapper>
        </div> */}
        <TaskDiagram tasks={tasks}></TaskDiagram>
      </div>
    </div>
  );
};

export default Project;
