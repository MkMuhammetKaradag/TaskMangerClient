import React, { FC } from 'react';
import { useQuery } from '@apollo/client';
import { GET_COMPANY_JOIN_REQUESTS } from '../../../graphql/queries';
import {
  JoinRequest,
  JoinRequestStatus,
} from '../../../types/graphql/joinRequest';

interface RequestsProps {
  companyId: string | null;
  status: JoinRequestStatus;
}
const JoinRequests: FC<RequestsProps> = ({ companyId, status }) => {
  const { loading, error, data } = useQuery(GET_COMPANY_JOIN_REQUESTS, {
    variables: { status: status, companyId },
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="space-y-4">
      {data?.getCompanyJoinRequests.map((request: JoinRequest) => (
        <div key={request._id} className="border rounded-lg p-4">
          <div className="flex items-center gap-4">
            <img
              src={request.user.profilePhoto}
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
        </div>
      ))}
    </div>
  );
};

export default JoinRequests;
