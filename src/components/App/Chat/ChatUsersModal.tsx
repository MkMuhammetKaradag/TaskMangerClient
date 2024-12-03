import  { FC } from 'react';
import CloseButton from '../Common/CloseButton';
import { gql, useQuery } from '@apollo/client';
import ChatUserCard from './ChatUserCard';
import { useAppSelector } from '../../../redux/hooks';

export const GET_CHAT_USERS = gql`
  query getChatUsers($chatId: String!) {
    getChatUsers(chatId: $chatId) {
      _id
      participants {
        _id
        status
        isAdmin
        userName
        profilePhoto
      }
    }
  }
`;

interface ChatUsersModalProps {
  onClose: () => void;
  chatId: string;
  chatName: string | null;
  isAdmin: boolean;
}
const ChatUsersModal: FC<ChatUsersModalProps> = ({
  chatId,
  onClose,
  chatName,
  isAdmin,
}) => {
  const user = useAppSelector((s) => s.auth.user);
  const { data, loading, error } = useQuery(GET_CHAT_USERS, {
    variables: { chatId },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading chat users</p>;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <CloseButton onClick={onClose} />
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-w-4xl  w-96   mx-4 max-h-[80vh] rounded-2xl bg-white overflow-hidden flex flex-col p-2"
      >
        <h2 className="text-xl font-bold">
          {chatName ? chatName : 'Chat'} Users
        </h2>
        <div className="mt-4 overflow-y-auto  h-full">
          {data?.getChatUsers.participants.map((participant: any) => (
            <ChatUserCard
              chatId={chatId}
              participant={participant}
              isAdmin={isAdmin}
              isCurrentUser={participant._id == user?._id}
              key={participant._id}
            ></ChatUserCard>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatUsersModal;
