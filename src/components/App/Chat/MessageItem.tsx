import React from 'react';
import { MediaContent, Message } from '../../../types/graphql/message';

interface MessageItemProps {
  message: Message;
  isCurrentUser: boolean;
}

const MessageItem: React.FC<MessageItemProps> = React.memo(
  ({ message, isCurrentUser }) => {
    const renderMedia = (media: MediaContent) => {
      switch (media.type) {
        case 'IMAGE':
          return (
            <img
              src={media.url}
              alt="Image message"
              className="max-w-xs rounded-lg w-52 h-52 object-cover"
              loading="lazy"
            />
          );
        case 'VIDEO':
          return (
            <video
              src={media.url}
              controls
              className="max-w-xs rounded-lg"
              poster={media.thumbnail}
            />
          );
        case 'AUDIO':
          return <audio src={media.url} controls className="max-w-xs" />;
        case 'DOCUMENT':
          return (
            <div className="flex items-center space-x-2 text-blue-500 hover:text-blue-700">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
              <a
                href={media.url}
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                View Document
              </a>
            </div>
          );
        default:
          return null;
      }
    };

    const renderContent = () => {
      if (message.type === 'TEXT') {
        return <p className="break-words">{message.content}</p>;
      }

      return (
        <div className="space-y-2">
          {message.media && (
            <div className="mb-1">{renderMedia(message.media)}</div>
          )}
          {message.content && (
            <p className="text-sm text-gray-700 break-words">
              {message.content}
            </p>
          )}
        </div>
      );
    };

    return (
      <div
        className={`mb-2 p-2 space-x-2 flex ${
          isCurrentUser ? 'justify-end' : ''
        }`}
      >
        {!isCurrentUser && (
          <img
            src={
              message.sender.profilePhoto || 'https://via.placeholder.com/40'
            }
            alt="Profile"
            className="w-8 h-8 rounded-full"
          />
        )}
        <div
          className={`${
            isCurrentUser
              ? 'rounded-tl-xl bg-sky-100 text-gray-900'
              : 'rounded-tr-xl bg-slate-100'
          } p-2 shadow rounded-b-xl ${
            message.type === 'MEDIA' ? 'max-w-sm' : ''
          }`}
        >
          {!isCurrentUser && (
            <span className="font-semibold">{message.sender.userName}</span>
          )}
          <div className={`${!isCurrentUser ? 'mt-2' : ''}`}>
            {renderContent()}
          </div>
        </div>
      </div>
    );
  }
);

export default MessageItem;
