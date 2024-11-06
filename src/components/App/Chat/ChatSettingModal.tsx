import React, { FC } from 'react';
import CloseButton from '../Common/CloseButton';

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
          <div>
            <div>close chat</div>
            <div>chat moderator father</div>
          </div>
        )}
        <div>
          <div>users</div>
          <div>Mark all messages as read </div>
        </div>
      </div>
    </div>
  );
};

export default ChatSettingModal;
