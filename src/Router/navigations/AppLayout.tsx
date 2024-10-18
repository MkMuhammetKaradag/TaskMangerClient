import React from 'react';
import Sidebar from '../../components/App/Common/SideBar';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col md:flex-row">
      <Sidebar />
      <main className="flex-1 p-5 md:ml-64 mb-16 md:mb-0">{children}</main>
    </div>
  );
};

export default AppLayout;
