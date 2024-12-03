import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { User, UserRole } from '../../../types/redux';
import { BiCog, BiUser } from 'react-icons/bi';
import { gql, useMutation } from '@apollo/client';
import { GET_COMPANY_EMPLOYEES } from './CompanyEmployees';

interface CompanyEmployeCardProps {
  isAdmin: boolean;
  isCurrentUser: boolean;
  employee: User;
  companyId?: string;
}

const PROMOTE_TO_EXECUTIVE = gql`
  mutation PromoteToExecutive($companyId: String, $userId: String!) {
    promoteToExecutive(companyId: $companyId, userId: $userId) {
      _id
    }
  }
`;

const DEMOTE_FROM_EXECUTIVE = gql`
  mutation DemoteFromExecutive($companyId: String, $userId: String!) {
    demoteFromExecutive(companyId: $companyId, userId: $userId) {
      _id
    }
  }
`;

const REMOVE_EMPLOYEE = gql`
  mutation RemoveEmployee($userId: String!) {
    removeEmployee(userId: $userId) {
      _id
    }
  }
`;

const CompanyEmployeCard: FC<CompanyEmployeCardProps> = ({
  employee,
  isCurrentUser,
  isAdmin,
  companyId,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [longPressTimeout, setLongPressTimeout] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const [promoteToExecutive, { loading: promoteToExecutiveLoading }] =
    useMutation(PROMOTE_TO_EXECUTIVE, {
      refetchQueries: [
        {
          query: GET_COMPANY_EMPLOYEES,
          variables: { companyId: companyId || null },
        },
      ],
    });

  const [demoteFromExecutive] = useMutation(DEMOTE_FROM_EXECUTIVE, {
    refetchQueries: [
      {
        query: GET_COMPANY_EMPLOYEES,
        variables: { companyId: companyId || null },
      },
    ],
  });

  const [removeEmployee, { loading: removeEmployeeLoading }] = useMutation(
    REMOVE_EMPLOYEE,
    {
      refetchQueries: [
        {
          query: GET_COMPANY_EMPLOYEES,
          variables: { companyId: companyId || null },
        },
      ],
    }
  );
  const handleTouchStart = useCallback(() => {
    if (!isAdmin || isCurrentUser) return; // Sadece kendi mesajlarımız için çalışsın
    setIsPressed(true);
    const timeout = setTimeout(() => {
      setIsDropdownOpen(true);
    }, 500); // 500ms sonra modal açılsın

    setLongPressTimeout(timeout);
  }, [isAdmin, isCurrentUser]);

  // Basma işlemi bitti
  const handleTouchEnd = useCallback(() => {
    if (longPressTimeout) {
      setIsPressed(false);
      clearTimeout(longPressTimeout);
      setLongPressTimeout(null);
    }
  }, [longPressTimeout]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleToggleExecutiveRole = async () => {
    try {
      if (employee.roles.includes(UserRole.EXECUTIVE) && confirm('sdsdsdsd')) {
        await demoteFromExecutive({
          variables: {
            companyId: companyId || null,
            userId: employee._id,
          },
        });
      } else {
        await promoteToExecutive({
          variables: {
            companyId: companyId || null,
            userId: employee._id,
          },
        });
      }

      console.log('User role changed');
    } catch (error) {
      console.error('Error while changing user role', error);
    }
  };

  const handleRemoveEmployee = async () => {
    if (confirm('Are you sure you want to remove this user?')) {
      try {
        await removeEmployee({
          variables: {
            userId: employee._id,
          },
        });
        console.log('User removed');
      } catch (error) {
        console.error('Error removing user:', error);
      }
    }
  };

  const dropdownMenuItems = [
    {
      icon: <BiCog className="w-5 h-5 mr-2" />,
      label: employee.roles.some((role) =>
        [UserRole.ADMIN, UserRole.EXECUTIVE].includes(role)
      )
        ? 'resign from management '
        : 'make user executive',
      onClick: handleToggleExecutiveRole,
      disabled: promoteToExecutiveLoading,
    },
    {
      icon: <BiUser className="w-5 h-5 mr-2" />,
      label: 'remove user',
      onClick: handleRemoveEmployee,
      disbled: removeEmployeeLoading,
    },
  ];
  return (
    <div
      className={`${
        isAdmin && !isCurrentUser && 'cursor-pointer'
      }  flex items-center gap-4 p-2 border-b relative  transition-colors duration-500 ${
        isPressed ? 'bg-gray-200' : 'bg-white'
      }`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchMove={handleTouchEnd} // Kaydırma sırasında iptal et
      onMouseDown={handleTouchStart}
      onMouseUp={handleTouchEnd}
      onMouseLeave={handleTouchEnd}
    >
      <img
        src={employee.profilePhoto || 'https://via.placeholder.com/50'}
        alt={employee.userName}
        className="w-12 h-12 rounded-full"
      />
      <div>
        <p className="font-semibold">
          {employee.firstName} {employee.lastName}
        </p>
        <p className="text-gray-500">{employee.userName}</p>
        <p className="text-gray-400 text-sm"></p>
        <p className="text-gray-400 text-sm">
          Role:{' '}
          {employee.roles.some((role: UserRole) => UserRole.EXECUTIVE === role)
            ? 'EXECUTIVE'
            : 'WORKER'}
        </p>
      </div>

      {isDropdownOpen && (
        <div
          ref={dropdownRef}
          className="absolute right-0 top-full w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
        >
          {dropdownMenuItems.map((item, index) => (
            <div
              key={index}
              className={`${
                item.disabled
                  ? 'opacity-50 cursor-not-allowed'
                  : 'cursor-pointer hover:bg-gray-100'
              } bg-white px-4 py-3 flex items-center`}
              onClick={() => {
                item.onClick();
                setIsDropdownOpen(false);
              }}
            >
              {item.icon}
              <span className="text-gray-800">
                {item.label} {item.disabled && '...'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CompanyEmployeCard;
