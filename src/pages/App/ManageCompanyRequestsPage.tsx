import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import CloseButton from '../../components/App/Common/CloseButton';
import TabBar from '../../components/App/ProjectDetail/TabBar';
import JoinRequests from '../../components/App/CompanyJoinRequests/JoinRequests';
import { JoinRequestStatus } from '../../types/graphql/joinRequest';
import CreateRequests from '../../components/App/CompanyRequest/CreateRequests';
import { CompanyRequestStatus } from '../../types/graphql/CompanyRequest';

const ManageCompanyRequestsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClose = () => {
    const backgroundLocation = location.state?.backgroundLocation;
    navigate(backgroundLocation?.pathname || '/', { replace: true });
  };
  const [activeTab, setActiveTab] = useState('PENDING');

  const renderContent = () => {
    switch (activeTab) {
      case 'PENDING':
        return (
          <CreateRequests
            status={CompanyRequestStatus.PENDING}
          ></CreateRequests>
        );
      case 'APPROVED':
        return (
          <CreateRequests
            status={CompanyRequestStatus.APPROVED}
          ></CreateRequests>
        );
      case 'REJECTED':
        return (
          <CreateRequests
            status={CompanyRequestStatus.REJECTED}
          ></CreateRequests>
        );
      case 'CANCELED':
        return (
          <CreateRequests
            status={CompanyRequestStatus.CANCELED}
          ></CreateRequests>
        );
      default:
        return null;
    }
  };
  const tabs = [
    { label: 'PENDING', value: 'PENDING' },
    { label: 'CANCELED', value: 'CANCELED' },
    { label: 'APPROVED', value: 'APPROVED' },
    { label: 'REJECTED', value: 'REJECTED' },
  ];
  return (
    <div
      onClick={handleClose}
      className="fixed inset-0 overflow-auto bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <CloseButton onClick={handleClose} />
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-w-screen-sm  h-[70vh] p-10  mt-10 md:mt-0 w-full mx-auto bg-white flex flex-col  rounded-lg shadow"
      >
        <TabBar activeTab={activeTab} onTabChange={setActiveTab} tabs={tabs} />
        <div className="flex-grow h-full overflow-y-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default ManageCompanyRequestsPage;
