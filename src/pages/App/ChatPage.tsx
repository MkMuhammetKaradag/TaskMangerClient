import React, { useCallback, useEffect, useRef, useState } from 'react';
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
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  setActiveChatId,
  setPiPMode,
  setPosition,
} from '../../redux/slices/PipSlice';

interface LocationState {
  chatName: string | null;
  isAdmin: boolean;
}

const ChatPage = () => {
  const { chatId } = useParams<{ chatId: string }>();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { isPiP, position } = useAppSelector((state) => state.pip);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const state = location.state as LocationState | undefined;
  const chatName = state?.chatName ?? null;
  const isAdmin = state?.isAdmin ?? false;

  useEffect(() => {
    if (chatId) {
      dispatch(setActiveChatId(chatId));
    }
  }, [chatId, dispatch]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isPiP) return;
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;

    const containerWidth = containerRef.current?.offsetWidth || 0;
    const containerHeight = containerRef.current?.offsetHeight || 0;

    const newX = Math.min(
      Math.max(0, e.clientX - dragOffset.x),
      window.innerWidth - containerWidth
    );
    const newY = Math.min(
      Math.max(0, e.clientY - dragOffset.y),
      window.innerHeight - containerHeight
    );

    dispatch(setPosition({ x: newX, y: newY }));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isPiP) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isPiP, isDragging]);

  if (!chatId) {
    return <div className="text-center p-4">Sohbet bulunamadı</div>;
  }

  return (
    <div
      ref={containerRef}
      className={` ${isPiP ? 'fixed shadow-lg rounded-lg' : ''}`}
      style={{
        top: isPiP ? position.y : undefined,
        left: isPiP ? position.x : undefined,
        width: isPiP ? '400px' : '100%',
        height: isPiP ? '600px' : '95vh',
        transition: isDragging ? 'none' : 'all 0.3s ease',
        zIndex: isPiP ? 1000 : 1,
        cursor: isPiP ? 'move' : 'default',
      }}
      onMouseDown={handleMouseDown}
    >
      <div className="flex flex-col h-full bg-gray-50">
        <ChatHeader
          containerRef={containerRef}
          chatId={chatId}
          chatName={chatName}
          isAdmin={isAdmin}
        />
        <Messages chatId={chatId} />
        <MessageInput chatId={chatId} />
      </div>
    </div>
  );
};

interface ChatHeaderProps {
  chatId: string;
  chatName: string | null;
  isAdmin: boolean;
  containerRef: React.RefObject<HTMLDivElement>;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  chatId,
  chatName,
  isAdmin,
  containerRef,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null); // New state to control active modal
  const dispatch = useAppDispatch();
  const { isPiP, position } = useAppSelector((state) => state.pip);
  const handlePiPToggle = () => {
    const newPiPState = !isPiP;
    dispatch(setPiPMode(newPiPState));

    if (newPiPState && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      dispatch(
        setPosition({
          x: window.innerWidth - rect.width - 20,
          y: window.innerHeight - rect.height - 20,
        })
      );
    }
  };
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
        <button
          onClick={handlePiPToggle}
          className=" top-10 right-20 z-50 bg-gray-200 hover:bg-gray-300 rounded-full p-1"
          style={{ cursor: 'pointer' }}
        >
          {isPiP ? (
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 8V4m0 0h4M4 4l5 5m11-2V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
              />
            </svg>
          ) : (
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"
              />
            </svg>
          )}
        </button>

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
