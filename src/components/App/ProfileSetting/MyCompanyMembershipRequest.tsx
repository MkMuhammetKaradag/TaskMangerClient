import  {  useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';


import TabBar from '../ProjectDetail/TabBar';
import CloseButton from '../Common/CloseButton';
import ManageMyMembershipRequests from './ManageMyMembershipRequests';
import { JoinRequestStatus } from '../../../types/graphql/joinRequest';

const MyCompanyMembershipRequest = () => {
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
          <ManageMyMembershipRequests
            status={JoinRequestStatus.PENDING}
          ></ManageMyMembershipRequests>
        );
      case 'APPROVED':
        return (
          <ManageMyMembershipRequests
            status={JoinRequestStatus.APPROVED}
          ></ManageMyMembershipRequests>
        );
      case 'REJECTED':
        return (
          <ManageMyMembershipRequests
            status={JoinRequestStatus.REJECTED}
          ></ManageMyMembershipRequests>
        );
      case 'CANCELED':
        return (
          <ManageMyMembershipRequests
            status={JoinRequestStatus.CANCELED}
          ></ManageMyMembershipRequests>
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

export default MyCompanyMembershipRequest;
