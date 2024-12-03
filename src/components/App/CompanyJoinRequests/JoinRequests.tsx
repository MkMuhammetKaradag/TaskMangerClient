import { FC } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { GET_COMPANY_JOIN_REQUESTS } from '../../../graphql/queries';
import {
  JoinRequest,
  JoinRequestStatus,
} from '../../../types/graphql/joinRequest';
import { FaCheck } from 'react-icons/fa';
import { AiOutlineClose } from 'react-icons/ai';
import { RESPOND_TO_JOIN_REQUEST } from '../../../graphql/mutations';

import RefreshButton from './RefreshButton';

interface RequestsProps {
  companyId: string | null;
  status: JoinRequestStatus;
}
const JoinRequests: FC<RequestsProps> = ({ companyId, status }) => {
  const { loading, error, data, refetch } = useQuery(
    GET_COMPANY_JOIN_REQUESTS,
    {
      variables: { status: status, companyId },
    }
  );

  const [RespondToJoinRequest] = useMutation(RESPOND_TO_JOIN_REQUEST, {
    refetchQueries: [
      {
        query: GET_COMPANY_JOIN_REQUESTS,
        variables: { status, companyId },
      },
    ],
  });

  const handleRespondToJoinRequest = (requestId: string, approve: boolean) => {
    try {
      RespondToJoinRequest({
        variables: {
          requestId: requestId,
          approve,
        },
      });
    } catch (error) {
      console.error(error);
    }
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

      {data?.getCompanyJoinRequests.map((request: JoinRequest) => (
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
          {status == JoinRequestStatus.PENDING && (
            <div className="flex space-x-3 items-center">
              <div
                onClick={() => handleRespondToJoinRequest(request._id, true)}
                className="bg-green-300 hover:bg-green-500 cursor-pointer items-center justify-center flex  w-10 h-10 rounded-full"
              >
                <FaCheck className="text-white" size={20} />
              </div>
              <div
                onClick={() => handleRespondToJoinRequest(request._id, false)}
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

export default JoinRequests;
