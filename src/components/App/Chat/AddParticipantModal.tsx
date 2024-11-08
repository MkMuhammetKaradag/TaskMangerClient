import React, { FC, useState } from 'react';

import CloseButton from '../Common/CloseButton';
import UserSearch from '../CreateChat/UserSearch';
import { gql, useMutation } from '@apollo/client';
import { GET_CHAT_USERS } from './ChatUsersModal';
import { ADD_CHAT_PARTICIPANT } from '../../../graphql/mutations';

interface User {
  _id: string;
  userName: string;
  profilePhoto: string | null;
}
interface AddParticipantModalProps {
  chatId: string;
  onClose: () => void;
}
const AddParticipantModal: FC<AddParticipantModalProps> = ({
  chatId,
  onClose,
}) => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [addParticipant, { loading, error }] = useMutation(
    ADD_CHAT_PARTICIPANT,
    {
      refetchQueries: [{ query: GET_CHAT_USERS, variables: { chatId } }],

      onCompleted: () => {
        alert(`${selectedUser?.userName} has been add from the chat`);
      },
      onError: (error) => {
        alert(`Error removing participant: ${error.message}`);
      },
    }
  );
  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
  };
  const handleAddParticipant = async () => {
    if (!selectedUser) return;
    const participantIds = selectedUser?._id;

    await addParticipant({
      variables: {
        chatId,
        userId: participantIds,
      },
    });
  };
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <CloseButton onClick={onClose} />
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-w-4xl items-center w-full mx-auto p-10 rounded-2xl bg-white overflow-hidden flex flex-col"
      >
        <UserSearch onSelectUser={handleUserSelect} />

        <div className="p-3">
          {selectedUser && (
            <div
              key={selectedUser._id}
              className=" flex justify-between border rounded"
            >
              <span className="mr-2 px-2 py-1">{selectedUser.userName}</span>
              <button
                className="ml-2 px-2 py-1  rounded bg-red-400 hover:bg-red-600 text-white"
                onClick={() => setSelectedUser(null)}
              >
                -
              </button>
            </div>
          )}
        </div>
        <button
          onClick={handleAddParticipant}
          disabled={!selectedUser && loading}
          className={`${
            !selectedUser || loading ? 'bg-blue-300 cursor-default' : ''
          } mt-4 p-2 w-48 bg-blue-500 text-white rounded`}
        >
          {loading ? 'adding...' : 'add participant Chat'}
        </button>
        {error && <p className="text-red-500">Hata: {error.message}</p>}
      </div>
    </div>
  );
};

export default AddParticipantModal;
