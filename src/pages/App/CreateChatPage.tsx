import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import UserSearch from '../../components/App/CreateChat/UserSearch';
import CloseButton from '../../components/App/Common/CloseButton';
import { useLocation, useNavigate } from 'react-router-dom';
import { GET_USER_CHATS } from '../../graphql/queries';
import { CREATE_CHAT } from '../../graphql/mutations';



interface User {
  _id: string;
  userName: string;
}

const CreateChatPage: React.FC = () => {
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [chatName, setChatName] = useState('');
  const [createChat, { loading, error }] = useMutation(CREATE_CHAT, {
    refetchQueries: [
      {
        query: GET_USER_CHATS, // Tekrar çalıştırılacak sorgu
      },
    ],
  });
  const navigate = useNavigate();
  const location = useLocation();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChatName(e.target.value);
  };

  const handleUserSelect = (user: User) => {
    setSelectedUsers((prevUsers) =>
      prevUsers.find((u) => u._id === user._id)
        ? prevUsers
        : [...prevUsers, user]
    );
  };

  const handleCreateChat = async () => {
    try {
      const participantIds = selectedUsers.map((user) => user._id);
      const { data } = await createChat({
        variables: {
          input: {
            participants: participantIds,
            chatName: chatName,
          },
        },
      });
      alert(`Chat oluşturuldu! Chat ID: ${data.createChat._id}`);
    } catch (err) {
      console.error('Chat oluşturulurken hata:', err);
    }
  };
  const handleClose = () => {
    const backgroundLocation = location.state?.backgroundLocation;
    navigate(backgroundLocation?.pathname || '/', { replace: true });
  };
  return (
    <div
      onClick={handleClose}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <CloseButton onClick={handleClose} />
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-w-4xl items-center w-full mx-auto p-10 rounded-2xl bg-white overflow-hidden flex flex-col"
      >
        <div className="flex justify-center p-2 items-center mb-4">
          <h2 className="text-xl font-bold">Yeni Sohbet Oluştu</h2>
        </div>
        <input
          type="text"
          placeholder="Chat Name"
          value={chatName}
          onChange={handleInputChange}
          className="w-80 p-2  mb-3  border  rounded-md shadow-lg"
        />
        <UserSearch onSelectUser={handleUserSelect} />

        <div className="p-3">
          {selectedUsers.map((user) => (
            <div
              key={user._id}
              className=" flex justify-between border rounded"
            >
              <span className="mr-2 px-2 py-1">{user.userName}</span>
              <button
                className="ml-2 px-2 py-1  rounded bg-red-400 hover:bg-red-600 text-white"
                onClick={() =>
                  setSelectedUsers((prevUsers) =>
                    prevUsers.filter((u) => u._id !== user._id)
                  )
                }
              >
                -
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={handleCreateChat}
          disabled={selectedUsers.length === 0 || loading}
          className="mt-4 p-2 w-48 bg-blue-500 text-white rounded"
        >
          {loading ? 'Creating...' : 'Create Chat'}
        </button>
        {error && <p className="text-red-500">Hata: {error.message}</p>}
      </div>
    </div>
  );
};

export default CreateChatPage;
