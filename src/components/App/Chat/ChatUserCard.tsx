import { gql, useMutation } from '@apollo/client';
import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { BiCog, BiLinkAlt, BiUser } from 'react-icons/bi';
import { GET_CHAT_USERS } from './ChatUsersModal';

const ADD_CHAT_ADMIN = gql`
  mutation AddChatAdmin($chatId: String!, $userId: String!) {
    addChatAdmin(chatId: $chatId, userId: $userId) {
      _id
    }
  }
`;

const REMOVE_CHAT_ADMIN = gql`
  mutation RemoveChatAdmin($chatId: String!, $userId: String!) {
    removeChatAdmin(chatId: $chatId, userId: $userId) {
      _id
    }
  }
`;

const REMOVE_CHAT_PARTICIPANT = gql`
  mutation RemoveChatParticipant($chatId: String!, $userId: String!) {
    removeChatParticipant(chatId: $chatId, userId: $userId) {
      _id
    }
  }
`;

const ADD_CHAT_PARTICIPANT = gql`
  mutation AddChatParticipant($chatId: String!, $userId: String!) {
    addChatParticipant(chatId: $chatId, userId: $userId) {
      _id
    }
  }
`;

interface ChatUserCardProps {
  isAdmin: boolean;
  chatId: string;
  isCurrentUser: boolean;
  participant: {
    _id: string;
    profilePhoto: string | null;
    userName: string;
    isAdmin: boolean;
    status: string;
  };
}
const ChatUserCard: FC<ChatUserCardProps> = ({
  chatId,
  participant,
  isAdmin,
  isCurrentUser,
}) => {
  //   const [showModal, setShowModal] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [longPressTimeout, setLongPressTimeout] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Mutation hooks
  const [addAdmin, { loading: addingAdmin }] = useMutation(ADD_CHAT_ADMIN, {
    refetchQueries: [{ query: GET_CHAT_USERS, variables: { chatId } }],
    onCompleted: () => {
      // Başarılı olduğunda bildirim göster
      alert(`${participant.userName} is now an admin`);
    },

    onError: (error) => {
      alert(`Error making admin: ${error.message}`);
    },
  });

  const [removeParticipant, { loading: removingParticipant }] = useMutation(
    REMOVE_CHAT_PARTICIPANT,
    {
      refetchQueries: [{ query: GET_CHAT_USERS, variables: { chatId } }],

      onCompleted: () => {
        alert(`${participant.userName} has been removed from the chat`);
      },
      onError: (error) => {
        alert(`Error removing participant: ${error.message}`);
      },
    }
  );

  const [removeAdmin, { loading: removingAdmin }] = useMutation(
    REMOVE_CHAT_ADMIN,
    {
      refetchQueries: [{ query: GET_CHAT_USERS, variables: { chatId } }],
      onCompleted: () => {
        alert(`${participant.userName} is no longer an admin`);
      },
      onError: (error) => {
        alert(`Error removing admin: ${error.message}`);
      },
    }
  );

  const handleAdminStatusChange = async () => {
    if (participant.isAdmin) {
      // Admin'i kaldır
      await removeAdmin({
        variables: {
          chatId: chatId,
          userId: participant._id,
        },
      });
    } else {
      // Admin yap
      await addAdmin({
        variables: {
          chatId: chatId,
          userId: participant._id,
        },
      });
    }
  };

  const handleRemoveParticipant = async () => {
    console.log('hello');
    if (
      window.confirm(
        `Are you sure you want to remove ${participant.userName} from the chat?`
      )
    ) {
      await removeParticipant({
        variables: {
          chatId,
          userId: participant._id,
        },
      });
    }
  };

  // Uzun basma işlemini başlat
  const handleTouchStart = useCallback(() => {
    if (!isAdmin || isCurrentUser) return; // Sadece kendi mesajlarımız için çalışsın
    setIsPressed(true);
    const timeout = setTimeout(() => {
      setIsDropdownOpen(true);
    }, 500); // 500ms sonra modal açılsın

    setLongPressTimeout(timeout);
  }, [isAdmin, isCurrentUser]);

  // Basma işlemi bitti
  const handleTouchEnd = useCallback(() => {
    if (longPressTimeout) {
      setIsPressed(false);
      clearTimeout(longPressTimeout);
      setLongPressTimeout(null);
    }
  }, [longPressTimeout]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const dropdownMenuItems = [
    {
      icon: <BiCog className="w-5 h-5 mr-2" />,
      label: participant.isAdmin
        ? 'esign from administration '
        : 'make me admin',
      onClick: handleAdminStatusChange,
      disabled: addingAdmin || removingAdmin,
    },
    {
      icon: <BiUser className="w-5 h-5 mr-2" />,
      label: 'remove user',
      onClick: handleRemoveParticipant,
      disbled: removingParticipant,
    },
  ];

  return (
    <div
      key={participant._id}
      className={`${
        isAdmin && !isCurrentUser && 'cursor-pointer'
      }  flex items-center gap-4 p-2 border-b relative  transition-colors duration-500 ${
        isPressed ? 'bg-gray-200' : 'bg-white'
      }`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchMove={handleTouchEnd} // Kaydırma sırasında iptal et
      onMouseDown={handleTouchStart}
      onMouseUp={handleTouchEnd}
      onMouseLeave={handleTouchEnd}
    >
      <img
        src={participant.profilePhoto || '/default-avatar.png'}
        alt={`${participant.userName}'s profile`}
        className="w-10 h-10 rounded-full"
      />
      <div className="flex-1">
        <p className="font-semibold">{participant.userName}</p>
        <p className="text-sm text-gray-500">
          {participant.isAdmin ? 'Admin' : 'Member'}
        </p>
        <p className="text-sm text-gray-500">Status: {participant.status}</p>
      </div>

      {isDropdownOpen && (
        <div
          ref={dropdownRef}
          className="absolute right-0 top-full w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
        >
          {dropdownMenuItems.map((item, index) => (
            <div
              key={index}
              className={`${
                item.disabled
                  ? 'opacity-50 cursor-not-allowed'
                  : 'cursor-pointer hover:bg-gray-100'
              } bg-white px-4 py-3 flex items-center`}
              onClick={() => {
                item.onClick();
                setIsDropdownOpen(false);
              }}
            >
              {item.icon}
              <span className="text-gray-800">
                {item.label} {item.disabled && '...'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatUserCard;
