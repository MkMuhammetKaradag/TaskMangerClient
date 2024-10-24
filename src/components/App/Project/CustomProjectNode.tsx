import { Handle, Position } from '@xyflow/react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

export const CustomProjectNode: React.FC<{
  data: { title: string };
}> = ({ data: { title } }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { projectId } = useParams<{ projectId: string }>();
  return (
    <div
      onClick={() =>
        navigate(`/p/${projectId}/project`, {
          state: {
            backgroundLocation: location,
          },
        })
      }
      className="px-4  hover:cursor-pointer py-2 shadow-md rounded-md bg-white border-2 border-stone-400"
    >
      <h1>{title}</h1>

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};
