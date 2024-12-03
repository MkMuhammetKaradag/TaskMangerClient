import React, { useState, useEffect,  useCallback } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';
import InfiniteScroll from 'react-infinite-scroll-component';

import { useAppSelector } from '../../../redux/hooks';
import { Message } from '../../../types/graphql/message';
import { GET_CHAT_MESSAGES } from '../../../graphql/queries';
import { ADD_MESSAGE_TO_CHAT_SUBSCRIPTION } from '../../../graphql/subscriptions';
import MessageItem from './MessageItem';
import { MARK_MESSAGES_AS_READ } from '../../../graphql/mutations';

interface MessagesProps {
  chatId: string;
}

const Messages: React.FC<MessagesProps> = ({ chatId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [extraPassValue, setExtraPassValue] = useState(0);

  const user = useAppSelector((state) => state.auth.user);
  const [markMessagesAsRead] = useMutation(MARK_MESSAGES_AS_READ);
  const [loadMessages, { loading, data, subscribeToMore }] = useLazyQuery(
    GET_CHAT_MESSAGES,
    {
      variables: { input: { chatId, page, limit: 15, extraPassValue: 0 } },
      fetchPolicy: 'network-only',
      onCompleted(data) {
        if (data?.getChatMessages?.messages && user?._id) {
          const newMessages = data.getChatMessages.messages as Message[];

          const unreadMessageIds = newMessages
            .filter(
              (msg) => msg.sender._id !== user._id && !msg.messageIsReaded
            )
            .map((msg) => msg._id);

          if (unreadMessageIds.length > 0) {
            markMessagesAsRead({
              variables: {
                messageIds: unreadMessageIds,
                userId: user._id,
              },
            }).catch((error) => {
              console.error('Error marking messages as read:', error);
            });
          }
        }
      },
    }
  );

  useEffect(() => {
    if (chatId) {
      setMessages([]);
      setPage(1);
      setHasMore(true);

      loadMessages();
    }
  }, [chatId, loadMessages]);

  useEffect(() => {
    if (data?.getChatMessages) {
      const { messages: newMessages, totalPages } = data.getChatMessages;
      setMessages((prevMessages) => [
        ...newMessages.slice().reverse(),
        ...prevMessages,
      ]);
      setHasMore(page < totalPages);
    }
  }, [data, page]);

  const loadMoreMessages = useCallback(() => {
    if (!loading && hasMore) {
      setPage((prevPage) => prevPage + 1);
      loadMessages({
        variables: {
          input: { chatId, page: page + 1, limit: 15, extraPassValue },
        },
      });
    }
  }, [loading, hasMore, loadMessages, chatId, page, extraPassValue]);

  useEffect(() => {
    if (subscribeToMore) {
      const unsubscribe = subscribeToMore({
        document: ADD_MESSAGE_TO_CHAT_SUBSCRIPTION,
        variables: { chatId },
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData.data) return prev;
          const newMessage = subscriptionData.data.addMessageToChat as Message;
          setExtraPassValue((prev) => prev + 1);
          if (newMessage && newMessage.sender._id !== user?._id) {
            markMessagesAsRead({
              variables: {
                messageIds: [newMessage._id],
              },
            }).catch(console.error);
          }
          if (newMessage) {
            setMessages((prevMessages) => [...prevMessages, newMessage]);
          }
          return prev;
        },
      });
      return () => unsubscribe();
    }
  }, [subscribeToMore, chatId]);

  return (
    <div
      id="scrollableDiv"
      className="h-full overflow-y-auto flex flex-col-reverse"
    >
      <InfiniteScroll
        dataLength={messages.length}
        next={loadMoreMessages}
        hasMore={hasMore}
        loader={<h4 className="text-center py-2">Yükleniyor...</h4>}
        scrollableTarget="scrollableDiv"
        inverse={true}
        style={{ display: 'flex', flexDirection: 'column-reverse' }}
        endMessage={
          <p className="text-center py-2">
            {messages.length > 0
              ? 'Tüm mesajlar yüklendi!'
              : 'Henüz mesaj yok.'}
          </p>
        }
      >
        <div className="p-4">
          {messages.map((message) => (
            <MessageItem
              key={message._id}
              message={message}
              isCurrentUser={user?._id === message.sender._id}
            />
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
};

export default React.memo(Messages);
