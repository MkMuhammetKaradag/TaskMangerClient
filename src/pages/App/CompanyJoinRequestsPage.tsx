import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import CloseButton from '../../components/App/Common/CloseButton';
import TabBar from '../../components/App/ProjectDetail/TabBar';
import JoinRequests from '../../components/App/CompanyJoinRequests/JoinRequests';
import { JoinRequestStatus } from '../../types/graphql/joinRequest';

const CompanyJoinRequestsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { companyId } = useParams<{
    companyId: string;
  }>();
  const handleClose = () => {
    const backgroundLocation = location.state?.backgroundLocation;
    navigate(backgroundLocation?.pathname || '/', { replace: true });
  };
  const [activeTab, setActiveTab] = useState('PENDING');

  const renderContent = () => {
    switch (activeTab) {
      case 'PENDING':
        return (
          <JoinRequests
            companyId={companyId ? companyId : null}
            status={JoinRequestStatus.PENDING}
          ></JoinRequests>
        );
      case 'APPROVED':
        return (
          <JoinRequests
            companyId={companyId ? companyId : null}
            status={JoinRequestStatus.APPROVED}
          ></JoinRequests>
        );
      case 'REJECTED':
        return (
          <JoinRequests
            companyId={companyId ? companyId : null}
            status={JoinRequestStatus.REJECTED}
          ></JoinRequests>
        );
      default:
        return null;
    }
  };
  const tabs = [
    { label: 'PENDING', value: 'PENDING' },
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
        className="max-w-screen-sm  h-[70vh] p-10  mt-10 md:mt-0 w-full mx-auto bg-white  rounded-lg shadow"
      >
        <TabBar activeTab={activeTab} onTabChange={setActiveTab} tabs={tabs} />
        <div className="flex-grow overflow-y-auto">{renderContent()}</div>
      </div>
    </div>
  );
};

export default CompanyJoinRequestsPage;
