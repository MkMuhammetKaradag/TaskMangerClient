import React, { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import UserSearch from '../../components/App/CreateChat/UserSearch';

const CREATE_CHAT = gql`
  mutation CreateChat($input: CreateChatInput!) {
    createChat(input: $input) {
      _id
    }
  }
`;

interface User {
  _id: string;
  userName: string;
}

const CreateChatPage: React.FC = () => {
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [createChat, { loading, error }] = useMutation(CREATE_CHAT);

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
          },
        },
      });
      alert(`Chat oluşturuldu! Chat ID: ${data.createChat._id}`);
    } catch (err) {
      console.error('Chat oluşturulurken hata:', err);
    }
  };

  return (
    <div className="p-4">
      <h2>Yeni Sohbet Oluştur</h2>
      <UserSearch onSelectUser={handleUserSelect} />
      <div className="my-2">
        {selectedUsers.map((user) => (
          <div>
            <span key={user._id} className="mr-2 px-2 py-1 border rounded">
              {user.userName}
            </span>
            <button
              className="ml-2 px-2 py-1 border rounded bg-red-500 hover:bg
            red-700 text-white"
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
        className="mt-4 p-2 bg-blue-500 text-white rounded"
      >
        {loading ? 'Oluşturuluyor...' : 'Sohbet Oluştur'}
      </button>
      {error && <p className="text-red-500">Hata: {error.message}</p>}
    </div>
  );
};

export default CreateChatPage;
