import React from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { MdVideoCall } from 'react-icons/md';
import { useParams } from 'react-router-dom';
import Messages from '../../components/App/Chat/Messages';

const ChatPage = () => {
  const { chatId } = useParams<{ chatId: string }>();
  if (!chatId) {
    return <div className="text-center p-4">Sohbet bulunamadı</div>;
  }
  return (
    <div className="flex flex-col h-[95vh]">
      <ChatHeader chatId={chatId} />
      <Messages chatId={chatId} />
      {/* <MessageInput chatId={chatId} /> */}
    </div>
  );
};

interface ChatHeaderProps {
  chatId: string;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ chatId }) => (
  <div className="bg-gray-200 p-4 flex justify-between items-center">
    <h2 className="text-xl font-bold">Sohbet</h2>

    <div className="flex gap-5">
      <MdVideoCall
        className="cursor-pointer text-blue-600 hover:text-blue-800"
        size={30}
      />
      <BsThreeDotsVertical size={30} />
    </div>
  </div>
);
export default ChatPage;
