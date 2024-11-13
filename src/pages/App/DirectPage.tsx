import { Outlet } from 'react-router-dom';
import ChatList from '../../components/App/Direct/ChatList';

const DirectPage = () => {
  return (
    <div className="flex  h-[95vh] ">
      <div className=" border-r md:w-1/3 md:flex hidden     ">
        <ChatList />
      </div>
      <div className=" h-full w-full md:w-3/4">
        <Outlet />
      </div>
    </div>
  );
};

export default DirectPage;
