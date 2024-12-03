
import { Outlet } from 'react-router-dom';
import UserProfileSettingMenu from '../../components/App/UserProfileSetting/UserProfileSettingMenu';

const UserProfileSettingPage = () => {
  return (
    <div className="flex  h-[95vh] ">
      <div className=" border-r md:w-[15vw] w-[10vw]      ">
        <UserProfileSettingMenu></UserProfileSettingMenu>
      </div>
      <div className=" h-full md:w-[65vw] w-[90vw]   justify-center flex">
        <Outlet />
      </div>
    </div>
  );
};

export default UserProfileSettingPage;
