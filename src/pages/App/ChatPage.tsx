import React, { useCallback, useState } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { MdVideoCall } from 'react-icons/md';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Messages from '../../components/App/Chat/Messages';
import MessageInput from '../../components/App/Chat/MessageInput';
import { BiCog, BiLinkAlt, BiUser } from 'react-icons/bi';
import { LEAVE_CHAT_MUTATION } from '../../graphql/mutations';
import { useMutation } from '@apollo/client';
import { GET_USER_CHATS } from '../../graphql/queries';
import ChatSettingModal from '../../components/App/Chat/ChatSettingModal';
import ChatUsersModal from '../../components/App/Chat/ChatUsersModal';
import AddParticipantModal from '../../components/App/Chat/AddParticipantModal';

const ChatPage = () => {
  const { chatId } = useParams<{ chatId: string }>();
  const location = useLocation();
  const chatName = location.state?.chatName as string | null;
  const isAdmin = location.state?.isAdmin as boolean;
  if (!chatId) {
    return <div className="text-center p-4">Sohbet bulunamadı</div>;
  }
  return (
    <div className="flex flex-col h-[95vh]">
      <ChatHeader chatId={chatId} chatName={chatName} isAdmin={isAdmin} />
      <Messages chatId={chatId} />
      <MessageInput chatId={chatId} />
    </div>
  );
};

interface ChatHeaderProps {
  chatId: string;
  chatName: string | null;
  isAdmin: boolean;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  chatId,
  chatName,
  isAdmin,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null); // New state to control active modal

  const [leaveChat, { loading }] = useMutation(LEAVE_CHAT_MUTATION, {
    refetchQueries: [{ query: GET_USER_CHATS }],
  });
  const navigate = useNavigate();

  const toggleDropdown = () => setIsDropdownOpen((prev) => !prev);

  const handleLeaveChat = async () => {
    if (window.confirm('Are you sure you want to leave the chat?')) {
      try {
        await leaveChat({ variables: { chatId } });
        setIsDropdownOpen(false);
        navigate('/direct');
      } catch (err) {
        console.error('Error while leaving the chat:', err);
      }
    }
  };

  const openModal = useCallback((modal: string) => {
    setActiveModal(modal);
    setIsDropdownOpen(false);
  }, []);

  const closeModal = useCallback(() => setActiveModal(null), []);

  const dropdownMenuItems = [
    {
      icon: <BiCog className="w-5 h-5 mr-2" />,
      label: 'Ayarlar',
      onClick: () => openModal('settings'),
    },
    {
      icon: <BiUser className="w-5 h-5 mr-2" />,
      label: 'Kişiler',
      onClick: () => openModal('users'),
    },
    {
      icon: <BiLinkAlt className="w-5 h-5 mr-2" />,
      label: loading ? 'Çıkılıyor...' : 'Chat Leave',
      onClick: handleLeaveChat,
    },
    isAdmin && {
      icon: <BiLinkAlt className="w-5 h-5 mr-2" />,
      label: 'Add Participant',
      onClick: () => openModal('addParticipant'),
    },
  ].filter(Boolean); // Filter out falsy values if not an admin

  return (
    <div
      className="bg-gray-200 p-4 flex justify-between items-center"
      onClick={() => setIsDropdownOpen(false)}
    >
      <h2 className="text-xl font-bold">{chatName || 'Sohbet'}</h2>

      <div className="flex gap-5">
        <MdVideoCall
          className="cursor-pointer text-blue-600 hover:text-blue-800"
          size={30}
        />
        <div onClick={(e) => e.stopPropagation()} className="relative">
          <BsThreeDotsVertical
            className="cursor-pointer"
            onClick={toggleDropdown}
            size={30}
          />
          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
              {dropdownMenuItems.map(
                (item, index) =>
                  item && (
                    <div
                      key={index}
                      className={`px-4 py-3 ${
                        loading ? 'bg-gray-50' : 'bg-white'
                      } hover:bg-gray-100 cursor-pointer flex items-center`}
                      onClick={item.onClick}
                    >
                      {item.icon}
                      <span className="text-gray-800">{item.label}</span>
                    </div>
                  )
              )}
            </div>
          )}
        </div>
      </div>

      {activeModal === 'settings' && (
        <ChatSettingModal
          onClose={closeModal}
          chatId={chatId}
          chatName={chatName}
          isAdmin={isAdmin}
        />
      )}
      {activeModal === 'users' && (
        <ChatUsersModal
          onClose={closeModal}
          chatId={chatId}
          chatName={chatName}
          isAdmin={isAdmin}
        />
      )}
      {activeModal === 'addParticipant' && (
        <AddParticipantModal onClose={closeModal} chatId={chatId} />
      )}
    </div>
  );
};

export default ChatPage;
