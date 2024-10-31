import { Outlet } from 'react-router-dom';
import ChatList from '../../components/App/Direct/ChatList';

const DirectPage = () => {
  return (
    <div className="flex  h-[95vh] ">
      <div className="w-1/4 border-r md:w-1/3 ">
        <ChatList />
      </div>
      <div className=" h-full w-3/4 md:w-2/3 ">
        <Outlet />
      </div>
    </div>
  );
};

export default DirectPage;
