import React, { FC } from 'react';
import { useAppSelector } from '../../redux/hooks';
import { FiMessageSquare, FiSettings } from 'react-icons/fi';
import { IoChatbubbles, IoChatbubblesOutline } from 'react-icons/io5';
import { CREATE_CHAT } from '../../graphql/mutations';
import { gql, useMutation, useQuery } from '@apollo/client';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

export const GET_USER_PROFILE = gql`
  query GetUserProfile($userId: String!) {
    getUserProfile(userId: $userId) {
      _id
      firstName
      lastName
      roles
      userName
      status
      profilePhoto
      company {
        _id
        name
      }
      chatId
    }
  }
`;

interface UserProfileProps {
  _id: string;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  profilePhoto: string | null;
  roles: string[];
  status: string;
  isCompanyAdmin: boolean;
  company?: {
    _id: string;
    name: string;
  };
  chatId: string | null;
}

interface ProfileHeder {
  _id: string;
  profilePhoto: string | null;
  firstName: string;
  lastName: string;
  userName: string;
  chatId: string | null;
}
const ProfileHeder: FC<ProfileHeder> = ({
  _id,
  profilePhoto,
  firstName,
  lastName,
  userName,
  chatId,
}) => {
  const userId = useAppSelector((s) => s.auth.user?._id);
  const navigate = useNavigate();
  const [createChat, { data, loading, error }] = useMutation(CREATE_CHAT, {
    onCompleted: (data) => {
      console.log(data);
      navigate(`/direct/t/${data.createChat._id}`);
    },
  });
  const handleCreateChat = async () => {
    try {
      const response = await createChat({
        variables: {
          input: {
            participants: [userId, _id],
            chatName: null,
          },
        },
      });
      toast.success('Chat created');

      console.log('Chat created:', response.data.createChat._id);
    } catch (err) {
      console.error('Failed to create chat:', err);
    }
  };
  return (
    <div className="flex items-center justify-between  border-b-2 shadow-lgc p-2">
      <div className="flex items-center space-x-4">
        {profilePhoto ? (
          <img
            src={profilePhoto}
            alt={`${firstName} ${lastName}`}
            className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
            No Image
          </div>
        )}
        <div>
          <h1 className="text-2xl font-semibold">
            {firstName} {lastName}
          </h1>
          <p className="text-gray-600">@{userName}</p>
        </div>
      </div>
      <div>
        {userId === _id ? (
          <div>
            <Link to={`/profile-setting`}>
              <FiSettings size={24} className="hover:cursor-pointer" />
            </Link>
          </div>
        ) : chatId ? (
          <div className="flex relative group  items-center space-x-2">
            <Link to={`/direct/t/${chatId}`}>
              <IoChatbubbles
                size={24}
                className="text-gray-600 hover:cursor-pointer "
              />
            </Link>
            <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-max bg-gray-800 text-white text-xs rounded px-2 py-1">
              open direct chat with user
            </div>
          </div>
        ) : (
          <div className="flex relative group hover:cursor-pointer  items-center space-x-2">
            <button onClick={handleCreateChat} disabled={loading}>
              <IoChatbubblesOutline size={24} className="text-gray-600" />
            </button>

            <div className="absolute left-0 bottom-full mb-2 hidden group-hover:block w-max bg-gray-800 text-white text-xs rounded px-2 py-1">
              create direct chat with user
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const UserPage: React.FC = () => {
  const user = useAppSelector((s) => s.auth.user);
  const { userId } = useParams<{
    userId: string;
  }>();
  const { data, loading, error } = useQuery(GET_USER_PROFILE, {
    variables: { userId: userId || user?._id },
    // skip: !userId,
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }
  const userProfile = data?.getUserProfile as UserProfileProps;

  return (
    <div className="max-w-4xl mx-auto p-10 bg-white shadow-md rounded-lg">
      {userProfile ? (
        <>
          <ProfileHeder
            _id={userProfile._id}
            chatId={userProfile.chatId}
            firstName={userProfile.firstName}
            lastName={userProfile.lastName}
            userName={userProfile.userName}
            profilePhoto={userProfile.profilePhoto}
          />
          <div className="mt-6 space-y-4">
            <div>
              <h2 className="text-lg font-medium text-gray-700">Roles:</h2>
              <ul className="text-gray-600">
                {userProfile.roles.map((role: string, index: number) => (
                  <li key={index}>- {role}</li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-lg font-medium text-gray-700">Status:</h2>
              <p
                className={`text-sm px-3 py-1 rounded-full inline-block ${
                  userProfile.status === 'online'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {userProfile.status}
              </p>
            </div>
            {userProfile.company && (
              <div>
                <h2 className="text-lg font-medium text-gray-700">Company:</h2>
                <Link to={`/company/${userProfile.company._id}`}>
                  <p className="text-gray-600">{userProfile.company.name}</p>
                </Link>
              </div>
            )}
          </div>
        </>
      ) : (
        <div>No user profile found.</div>
      )}
    </div>
  );
};
export default UserPage;
