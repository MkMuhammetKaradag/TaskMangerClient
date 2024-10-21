import React from 'react';
import { AiOutlineClose } from 'react-icons/ai';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
const CloseButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <div className="absolute top-0 right-0 z-50 justify-end ">
    <button
      onClick={onClick}
      className=" bg-black rounded-full text-gray-100 xl:bg-transparent xl:text-white text-3xl"
    >
      <AiOutlineClose />
    </button>
  </div>
);
const ProjectDetailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { projectId } = useParams<{ projectId: string }>();
  const handleClose = () => {
    const backgroundLocation = location.state?.backgroundLocation;
    navigate(backgroundLocation?.pathname || '/', { replace: true });
  };

  return (
    <div className="fixed inset-0  bg-black bg-opacity-50 flex items-center justify-between z-50">
      <CloseButton onClick={handleClose} />
      <div>hello</div>
      <div>h1 naber</div>
      <span>{projectId}</span>
    </div>
  );
};

export default ProjectDetailPage;
