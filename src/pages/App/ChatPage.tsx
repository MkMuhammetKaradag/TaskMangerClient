import React, { useState } from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { MdVideoCall } from 'react-icons/md';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Messages from '../../components/App/Chat/Messages';
import MessageInput from '../../components/App/Chat/MessageInput';
import { BiCog, BiLinkAlt, BiUser } from 'react-icons/bi';
import { LEAVE_CHAT_MUTATION } from '../../graphql/mutations';
import { useMutation } from '@apollo/client';
import { GET_USER_CHATS } from '../../graphql/queries';

const ChatPage = () => {
  const { chatId } = useParams<{ chatId: string }>();
  const location = useLocation();
  const chatName = location.state?.chatName as string | null; // Gönderilen mesajı al
  if (!chatId) {
    return <div className="text-center p-4">Sohbet bulunamadı</div>;
  }
  return (
    <div className="flex flex-col h-[95vh]">
      <ChatHeader chatId={chatId} chatName={chatName} />
      <Messages chatId={chatId} />
      <MessageInput chatId={chatId} />
    </div>
  );
};

interface ChatHeaderProps {
  chatId: string;
  chatName: string | null;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ chatId, chatName }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [leaveChat, { loading, error }] = useMutation(LEAVE_CHAT_MUTATION, {
    refetchQueries: [
      {
        query: GET_USER_CHATS, // Tekrar çalıştırılacak sorgu
      },
    ],
  });
  const navigate = useNavigate();
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLeaveChat = async () => {
    try {
      console.log('neber');
      await leaveChat({
        variables: {
          chatId,
        },
      });
      navigate('/direct');
      console.log("Chat'ten başarıyla ayrıldınız.");
    } catch (err) {
      console.error("Chat'ten ayrılırken hata oluştu:", err);
    }
  };
  const dropdownMenuItems = [
    {
      icon: <BiCog className="w-5 h-5 mr-2" />,
      label: 'Ayarlar',
      onClick: () => {
        // Ayarlar sayfasına yönlendirme veya modal açma
        console.log('Ayarlar tıklandı');
      },
    },
    {
      icon: <BiUser className="w-5 h-5 mr-2" />,
      label: 'kişiler',
      onClick: () => {
        // Kullanıcı yönetimi sayfasına yönlendirme
        console.log('Kullanıcılar tıklandı');
      },
    },
    {
      icon: <BiLinkAlt className="w-5 h-5 mr-2" />,
      label: loading ? 'Exiting...' : 'Chat Leave',
      onClick: () => handleLeaveChat(),
    },
  ];

  return (
    <div
      onClick={() => setIsDropdownOpen(false)}
      className="bg-gray-200 p-4 flex justify-between items-center"
    >
      <h2 className="text-xl font-bold">{chatName ? chatName : 'Sohbet'}</h2>

      <div className="flex gap-5">
        <MdVideoCall
          className="cursor-pointer text-blue-600 hover:text-blue-800"
          size={30}
        />
        <div onClick={(e) => e.stopPropagation()} className="relative">
          <BsThreeDotsVertical onClick={toggleDropdown} size={30} />
          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
              {dropdownMenuItems.map((item, index) => (
                <div
                  key={index}
                  className={`${
                    loading ? 'bg-gray-50' : 'bg-white'
                  }  px-4 py-3 hover:bg-gray-100 cursor-pointer flex items-center`}
                  onClick={() => {
                    item.onClick();
                    setIsDropdownOpen(false);
                  }}
                >
                  {item.icon}
                  <span className="text-gray-800">{item.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default ChatPage;
