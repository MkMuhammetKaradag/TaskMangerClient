import React, { FC, useState } from 'react';
import CloseButton from '../Common/CloseButton';
import {  useMutation } from '@apollo/client';
import { GET_USER_CHATS } from '../../../graphql/queries';
import { FREEZE_CHAT, UPDATE_CHAT_NAME } from '../../../graphql/mutations';
import { useNavigate } from 'react-router-dom';
import { MARK_CHAT_MESSAGES_AS_READ } from '../../../graphql/mutations/Chat/MarkChatMessagesAsRead';

interface ChatSettingProps {
  onClose: () => void;
  chatId: string;
  chatName: string | null;
  isAdmin: boolean;
}

const ChatSettingModal: FC<ChatSettingProps> = ({
  chatId,
  onClose,
  chatName,
  isAdmin,
}) => {
  const [chatNameInput, setChatNameInput] = useState('');
  const navigate = useNavigate();
  const [updateChatName, { loading: updateChatNameLoading }] = useMutation(
    UPDATE_CHAT_NAME,
    {
      refetchQueries: [
        {
          query: GET_USER_CHATS,
        },
      ],
      onCompleted: () => {
        navigate('/direct');
      },
    }
  );

  const [freezeChat, { loading: freezeChatLoading }] = useMutation(
    FREEZE_CHAT,

    {
      refetchQueries: [{ query: GET_USER_CHATS }],
      onCompleted: () => {
        navigate('/direct');
      },
    }
  );

  const [markChatMessagesAsRead, { loading: markChatMessagesAsReadLoading }] =
    useMutation(MARK_CHAT_MESSAGES_AS_READ, {
      variables: { chatId },
      onCompleted: () => {
        alert('All messages marked as read');
      },
    });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChatNameInput(e.target.value);
  };

  const handleChangeChatName = async () => {
    try {
      await updateChatName({
        variables: { chatId, name: chatNameInput },
      });

      alert('Chat name updated successfully');
      setChatNameInput('');
    } catch (error) {
      console.error('Error updating chat name:', error);
    }
  };
  const handleFreezeChat = async () => {
    try {
      await freezeChat({ variables: { chatId } });
      alert('Chat has been frozen');
    } catch (error) {
      console.error('Error freezing chat:', error);
    }
  };

  const handleMarkMessagesAsRead = async () => {
    try {
      await markChatMessagesAsRead();
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

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
        <h2 className="text-xl font-bold">
          {chatName ? chatName : 'Chat'} Setting
        </h2>
        {isAdmin && (
          <div className="mt-2">
            <button
              disabled={freezeChatLoading}
              onClick={handleFreezeChat}
              className="border-b p-3 w-full hover:bg-blue-300  hover:cursor-pointer text-white bg-blue-200 rounded-md shadow-lg my-3  flex  items-center  justify-center"
            >
              Freeze Chat
            </button>
            <div className="border-b p-3   flex  items-center  justify-center ">
              <input
                type="text"
                placeholder={chatName || 'chat'}
                value={chatNameInput}
                onChange={handleInputChange}
                className="w-80 p-2  border  rounded-l-md shadow-lg"
              />

              <button
                onClick={handleChangeChatName}
                disabled={chatNameInput.length === 0 || updateChatNameLoading}
                className={`${
                  chatNameInput.length === 0 ? 'bg-blue-200' : 'bg-blue-400'
                } text-white p-2 rounded-r-md shadow-lg`}
              >
                change
              </button>
            </div>
          </div>
        )}
        <div className="border-b p-3  gap-x-3  flex  items-center  justify-center">
          <div>Mark all messages as read </div>
          <button
            onClick={handleMarkMessagesAsRead}
            disabled={markChatMessagesAsReadLoading}
            className="bg-blue-200 p-2 rounded-md text-white hover:bg-blue-300"
          >
            Read
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatSettingModal;
