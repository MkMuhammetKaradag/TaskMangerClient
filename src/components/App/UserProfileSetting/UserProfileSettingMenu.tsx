
import { IconType } from 'react-icons';
import { UserRole } from '../../../types/redux';

import { MdEdit, MdOutlineEdit } from 'react-icons/md';
import {
  AiFillSetting,

  AiOutlineSetting,

} from 'react-icons/ai';
import { BiSend, BiSolidSend } from 'react-icons/bi';
import { Link, useLocation } from 'react-router-dom';
import {  useAppSelector } from '../../../redux/hooks';

interface MenuItem {
  icon: IconType;
  outlineIcon: IconType;
  text: string;
  link: string;
  backgroundLocation?: boolean;
  roles?: UserRole[]; // Hangi rollerin görebileceğini belirlemek için
}

const MENU_ITEMS: MenuItem[] = [
  {
    icon: MdEdit,
    outlineIcon: MdOutlineEdit,
    text: 'Edit',
    link: '/profile-setting',
  },
  {
    icon: AiFillSetting,
    outlineIcon: AiOutlineSetting,
    text: 'Setting',
    link: '/profile-setting/setting',
  },
  // {
  //   icon: BiSolidSend,
  //   outlineIcon: BiSend,
  //   text: 'company request',
  //   link: '/profile-setting/company-request',
  //   roles: [UserRole.ADMIN, UserRole.EXECUTIVE, UserRole.WORKER],
  // },
  {
    icon: BiSolidSend,
    outlineIcon: BiSend,
    text: 'my request',
    link: '/profile-setting/company-membership-request',
    backgroundLocation: true,
    // roles: [UserRole.ADMIN, UserRole.EXECUTIVE, UserRole.WORKER],
  },
];
const UserProfileSettingMenu = () => {
  const location = useLocation();

  const user = useAppSelector((state) => state.auth.user);

  const filteredMenuItems = MENU_ITEMS.filter((item) => {
    if (!item.roles) return true; // Rol belirtilmemişse herkes görebilir
    return user?.roles && item.roles.some((role) => user.roles.includes(role));
  });

  const renderMenuItem = (item: MenuItem, index: number) => {
    const isActive = location.pathname === item.link;

    const IconComponent = isActive ? item.icon : item.outlineIcon;

    const commonClasses = `flex items-center p-2 rounded w-full transition-all ${
      isActive ? 'text-gray-500' : 'text-gray-800'
    } hover:bg-gray-100`;

    return (
      <Link
        key={index}
        state={
          item.backgroundLocation
            ? {
                backgroundLocation: location,
              }
            : undefined
        }
        to={item.link}
        className={commonClasses}
      >
        <IconComponent className="text-2xl min-w-[1.5rem]" />
        {renderMenuText(item.text)}
      </Link>
    );
  };

  const renderMenuText = (text: string) => (
    <span
      className={`ml-4 transition-all duration-300 ease-in-out whitespace-nowrap hidden lg:inline`}
    >
      {text}
    </span>
  );

  return (
    <div className="flex relative">
      <nav className="flex-grow">{filteredMenuItems.map(renderMenuItem)}</nav>
    </div>
  );
};

export default UserProfileSettingMenu;
