
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import CloseButton from '../Common/CloseButton';
import { gql, useQuery } from '@apollo/client';
import { User, UserRole } from '../../../types/redux';
import CompanyEmployeCard from './CompanyEmployeCard';
import { useAppSelector } from '../../../redux/hooks';
export const GET_COMPANY_EMPLOYEES = gql`
  query GetCompanyEmployees($companyId: String) {
    getCompanyEmployees(companyId: $companyId) {
      _id
      firstName
      lastName
      userName
      profilePhoto
      roles
    }
  }
`;
const CompanyEmployees = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useAppSelector((state) => state.auth.user);
  const { companyId } = useParams<{
    companyId: string;
  }>();

  const { data, loading, error } = useQuery(GET_COMPANY_EMPLOYEES, {
    variables: { companyId: companyId || null },
  });

  const handleClose = () => {
    const backgroundLocation = location.state?.backgroundLocation;
    navigate(backgroundLocation?.pathname || '/', { replace: true });
  };

  // Show loading or error message
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data) return <div>Employees null</div>;

  const employees = data.getCompanyEmployees as User[];
  return (
    <div
      onClick={handleClose}
      className="fixed inset-0 overflow-auto bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <CloseButton onClick={handleClose} />
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-w-screen-sm  h-[70vh] p-10  mt-10 md:mt-0 w-full mx-auto bg-white  rounded-lg shadow overflow-auto"
      >
        <h2 className="text-xl font-semibold mb-4">Company Employees</h2>
        <div className="space-y-4">
          {employees.map((employee: User) => (
            <CompanyEmployeCard
              key={employee._id}
              companyId={companyId}
              employee={employee}
              isAdmin={
                user?.roles.some((role) =>
                  [UserRole.ADMIN, UserRole.EXECUTIVE].includes(role)
                ) || false
              }
              isCurrentUser={user?._id == employee._id}
            ></CompanyEmployeCard>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CompanyEmployees;
