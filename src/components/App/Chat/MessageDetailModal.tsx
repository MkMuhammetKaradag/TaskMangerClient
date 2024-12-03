import React from 'react';
import CloseButton from '../Common/CloseButton';
import { GET_MESSAGE_READERS } from '../../../graphql/queries';
import { useQuery } from '@apollo/client';
import {  MessageReaders } from '../../../types/graphql/message';

interface MessageDetailModalProps {
  onClose: () => void;
  messageId: String;
}

interface GetMessageReadersQueryResult {
  getMessageReaders: MessageReaders;
}

interface GetMessageReadersOperationVariables {
  messageId: String;
}
const MessageDetailModal: React.FC<MessageDetailModalProps> = ({
  onClose,
  messageId,
}) => {
  const { data, loading, error } = useQuery<
    GetMessageReadersQueryResult,
    GetMessageReadersOperationVariables
  >(GET_MESSAGE_READERS, {
    variables: { messageId: messageId },
    fetchPolicy: 'no-cache',
  });

  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error...</div>;
  }
  if (!data) {
    return <div>No data...</div>;
  }

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <CloseButton onClick={onClose} />
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-w-4xl  mx-4 max-h-[80vh] rounded-2xl bg-white overflow-hidden flex flex-col p-10"
      >
        <h2 className="text-xl font-bold">Users who read the message</h2>
        <div className="gap-2 flex flex-col mt-4">
          {data.getMessageReaders.isRead.map((participant) => {
            return (
              <div className="flex items-center " key={participant._id}>
                <img
                  src={
                    participant.profilePhoto || 'https://via.placeholder.com/40'
                  }
                  alt={participant.userName}
                  className="w-10 h-10 rounded-full border-2 border-gray-800 object-cover"
                />
                <span className="ml-4">{participant.userName}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MessageDetailModal;
