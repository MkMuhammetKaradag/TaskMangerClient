import React, { useState } from 'react';
import { IconType } from 'react-icons';
import {
  AiOutlineSearch,
  AiOutlineUser,
  AiFillHome,
  AiOutlineHome,
  AiFillProject,
  AiOutlineProject,
  AiFillShop,
  AiOutlineShop,
  AiFillBell,
  AiOutlineBell,
  AiOutlinePlus,
} from 'react-icons/ai';
import { RiTaskFill, RiTaskLine } from 'react-icons/ri';
import { Link, useLocation } from 'react-router-dom';
import { useApolloClient, useMutation } from '@apollo/client';
import { logout } from '../../../redux/slices/AuthSlice';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { LOGOUT_USER } from '../../../graphql/mutations';
import SearchPanel from './SearchPanel';
import { UserRole } from '../../../types/redux';

// Types
interface MenuItem {
  icon: IconType;
  outlineIcon: IconType;
  text: string;
  link: string;
  roles?: UserRole[]; // Hangi rollerin görebileceğini belirlemek için
}

// Constants
const MENU_ITEMS: MenuItem[] = [
  {
    icon: AiFillHome,
    outlineIcon: AiOutlineHome,
    text: 'Ana Sayfa',
    link: '/',
  },
  {
    icon: AiOutlineSearch,
    outlineIcon: AiOutlineSearch,
    text: 'Ara',
    link: 'search',
  },
  {
    icon: AiFillProject,
    outlineIcon: AiOutlineProject,
    text: 'Projects',
    link: '/projects',
  },
  {
    icon: RiTaskFill,
    outlineIcon: RiTaskLine,
    text: 'Tasks',
    link: '/tasks',
  },
  {
    icon: AiFillShop,
    outlineIcon: AiOutlineShop,
    text: 'Company',
    link: '/direct',
  },
  {
    icon: AiOutlineBell,
    outlineIcon: AiOutlineBell,
    text: 'Bildirimler',
    link: '/notifications',
  },
  // Yeni eklenen rol bazlı menü öğeleri
  {
    icon: AiOutlinePlus,
    outlineIcon: AiOutlinePlus,
    text: 'Create Project',
    link: '/create-project',
    roles: [UserRole.ADMIN, UserRole.EXECUTIVE], // Sadece admin ve executive görebilir
  },
  {
    icon: AiOutlinePlus,
    outlineIcon: AiOutlinePlus,
    text: 'Create Task',
    link: '/create-task',
    roles: [UserRole.ADMIN, UserRole.EXECUTIVE, UserRole.WORKER], // Admin, executive ve worker görebilir
  },
];

const Sidebar: React.FC = () => {
  // State
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Hooks
  const user = useAppSelector((state) => state.auth.user);
  const { pathname } = useLocation();
  const [logoutUser] = useMutation(LOGOUT_USER);
  const dispatch = useAppDispatch();
  const client = useApolloClient();

  // Handlers
  const handleLogout = async () => {
    try {
      await logoutUser();
      dispatch(logout());
      await client.clearStore();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleSearch = () => {
    setIsExpanded((prev) => !prev);
    setIsSearchOpen((prev) => !prev);
  };

  // Kullanıcının rolüne göre menü öğelerini filtreleme
  const filteredMenuItems = MENU_ITEMS.filter((item) => {
    if (!item.roles) return true; // Rol belirtilmemişse herkes görebilir
    return user?.roles && item.roles.some((role) => user.roles.includes(role));
  });
  console.log(user?.roles);

  // Render functions
  const renderMenuItem = (item: MenuItem, index: number) => {
    const isActive = pathname === item.link;
    const IconComponent = isActive ? item.icon : item.outlineIcon;

    const commonClasses = `flex items-center p-2 rounded w-full transition-all ${
      isActive ? 'text-white' : 'text-gray-300'
    } hover:bg-gray-900`;

    if (item.text === 'Ara') {
      return (
        <button key={index} onClick={toggleSearch} className={commonClasses}>
          <IconComponent className="text-2xl min-w-[1.5rem]" />
          {renderMenuText(item.text)}
        </button>
      );
    }

    return (
      <Link
        key={index}
        to={item.link === '/user' ? `/user/${user?._id}` : item.link}
        className={commonClasses}
      >
        <IconComponent className="text-2xl min-w-[1.5rem]" />
        {renderMenuText(item.text)}
      </Link>
    );
  };

  const renderMenuText = (text: string) => (
    <span
      className={`ml-4 transition-all text-white duration-300 ease-in-out whitespace-nowrap ${
        isExpanded ? 'max-w-[200px] opacity-100' : 'max-w-0 opacity-0'
      }`}
    >
      {text}
    </span>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className={`fixed z-20 left-0 top-0 h-full bg-black text-white p-2 md:flex flex-col hidden transition-all duration-300 ease-in-out ${
          isExpanded ? 'w-64' : 'w-16'
        }`}
      >
        <div className="mb-10 flex items-center h-14">
          <h1
            className={`text-2xl font-bold ${isExpanded ? 'block' : 'hidden'}`}
          >
            Task
          </h1>
        </div>

        <nav className="flex-grow">{filteredMenuItems.map(renderMenuItem)}</nav>

        <div className="relative bottom-0 bg-gray-900">
          <button
            onClick={() => toggleMenu()}
            className="flex items-center hover:bg-gray-900 p-2 rounded w-full transition-all duration-300 ease-in-out overflow-hidden"
          >
            <AiOutlineUser className="text-2xl min-w-[1.5rem] flex-shrink-0" />
            {renderMenuText('Daha fazla')}
          </button>
          {isMenuOpen && (
            <div className="absolute bottom-full w-full left-0 bg-gray-800 rounded-t-md shadow-lg">
              <Link
                to={`/user/${user?._id}`}
                className="block px-4 py-2 hover:bg-gray-700"
                onClick={toggleMenu}
              >
                Profil
              </Link>
              <button
                className="block w-full text-left px-4 py-2 hover:bg-gray-700"
                onClick={() => {
                  toggleMenu();
                  handleLogout();
                }}
              >
                Çıkış Yap
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Search Panel */}
      <SearchPanel isOpen={isSearchOpen} onClose={toggleSearch} />

      {/* Mobile Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-black text-white p-2 z-50 flex justify-around md:hidden">
        {filteredMenuItems.slice(0, 5).map((item, index) => (
          <button key={index} className="flex flex-col items-center">
            <item.icon className="text-2xl" />
          </button>
        ))}
      </div>
    </>
  );
};

export default Sidebar;
