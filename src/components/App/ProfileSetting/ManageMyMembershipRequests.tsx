import { useMutation, useQuery } from '@apollo/client';
import { FC } from 'react';

import RefreshButton from '../CompanyJoinRequests/RefreshButton';
import {
  JoinRequest,
  JoinRequestStatus,
} from '../../../types/graphql/joinRequest';
import { GET_MY_COMPANY_MEMBERSHIP_REQUESTS } from '../../../graphql/queries';
import { CANCEL_JOIN_COMPANY_REQUEST } from '../../../graphql/mutations';
import { toast } from 'react-toastify';
interface ManageMyJoinRequestsProps {
  status: JoinRequestStatus;
}

const ManageMyMembershipRequests: FC<ManageMyJoinRequestsProps> = ({
  status,
}) => {
  const { loading, error, data, refetch } = useQuery(
    GET_MY_COMPANY_MEMBERSHIP_REQUESTS,
    {
      variables: { status: status },
    }
  );

  const [cancelJoinCompanyRequest, { loading: loadingCancelMutation }] =
    useMutation(CANCEL_JOIN_COMPANY_REQUEST, {
      refetchQueries: [
        { query: GET_MY_COMPANY_MEMBERSHIP_REQUESTS, variables: { status } },
      ],
    });

  const handleCanceledRequest = async (companyId: string) => {
    try {
      if (!companyId) {
        alert('Şirket bulunamadı');
        return;
      }

      await cancelJoinCompanyRequest({
        variables: { companyId },
      });
      toast.success('Şirket üyelik talebiniz iptal edildi');
    } catch (error: any) {
      toast.error(
        error.message || 'Bir hata oluştu. Lütfen daha sonra tekrar deneyin'
      );
    }
  };
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="space-y-4 p-4 flex flex-col">
      <RefreshButton onRefresh={refetch} loading={loading} />

      {data?.getMyCompanyMembershipRequests.map((request: JoinRequest) => (
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
            <button
              disabled={loadingCancelMutation}
              onClick={() => handleCanceledRequest(request.company._id)}
              className="bg-red-300 p-2 text-gray-100 hover:bg-red-500 cursor-pointer items-center justify-center flex rounded-md"
            >
              cancel
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default ManageMyMembershipRequests;
