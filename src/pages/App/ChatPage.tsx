import React from 'react';
import { useParams } from 'react-router-dom';

const ChatPage = () => {
  const { chatId } = useParams<{ chatId: string }>();
  return <div>ChatPage:{chatId}</div>;
};

export default ChatPage;
