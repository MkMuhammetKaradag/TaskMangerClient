import { FC } from 'react';
import { useQuery } from '@apollo/client';

import { JoinRequest } from '../../../types/graphql/joinRequest';
import { FaCheck } from 'react-icons/fa';
import { AiOutlineClose } from 'react-icons/ai';

import RefreshButton from '../CompanyJoinRequests/RefreshButton';
import { CompanyRequestStatus } from '../../../types/graphql/CompanyRequest';
import { GET_COMPANY_REQUESTS } from '../../../graphql/queries/GetCompanyRequests';

interface CreateRequestsProps {
  status: CompanyRequestStatus;
}
const CreateRequests: FC<CreateRequestsProps> = ({ status }) => {
  const { loading, error, data, refetch } = useQuery(GET_COMPANY_REQUESTS, {
    variables: { status: status },
  });

  const handleRespondToJoinRequest = (requestId: string) => {
    console.log(requestId);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="space-y-4 p-4 flex flex-col   ">
      <RefreshButton
        onRefresh={refetch}
        loading={loading}
        // İsterseniz ek prop'ları da kullanabilirsiniz
        // className="custom-class"
        // iconSize={20}
      />

      {data?.getCompanyRequests.map((request: JoinRequest) => (
        <div
          key={request._id}
          className="border flex justify-between rounded-lg p-4"
        >
          <div className="flex items-center gap-4">
            <img
              src={
                request.user.profilePhoto || 'https://via.placeholder.com/40'
              }
              alt={request.user.userName}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <p className="font-medium">{request.user.userName}</p>
              <p className="text-sm text-gray-500">
                {new Date(+request.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          {status == CompanyRequestStatus.PENDING && (
            <div className="flex space-x-3 items-center">
              <div
                onClick={() => handleRespondToJoinRequest(request._id)}
                className="bg-green-300 hover:bg-green-500 cursor-pointer items-center justify-center flex  w-10 h-10 rounded-full"
              >
                <FaCheck className="text-white" size={20} />
              </div>
              <div
                onClick={() => handleRespondToJoinRequest(request._id)}
                className="bg-red-300 hover:bg-red-500 cursor-pointer items-center justify-center flex  w-10 h-10 rounded-full"
              >
                <AiOutlineClose className="text-white " size={20} />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CreateRequests;
