// VideoCallPage.tsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { JOIN_VIDEO_ROOM_TOKEN } from '../../graphql/mutations';
import LoadingSpinner from '../../components/App/Common/LoadingSpinner';
import CloseButton from '../../components/App/Common/CloseButton';
import '@livekit/components-styles';
import {
  LiveKitRoom,
  RoomAudioRenderer,
  ControlBar,
} from '@livekit/components-react';
import Stage from '../../components/App/VideoCall/Stage';
// const SERVER_URL = 'wss://dcclone-gh7o1vv0.livekit.cloud';
const apiUrl = import.meta.env.VITE_LIVEKIT_SERVER_URL as string;
const VideoCallPage: React.FC = () => {
  console.log(apiUrl);
  const { chatId } = useParams<{ chatId: string }>();
  const [joinVideoRoom, { data }] = useMutation(JOIN_VIDEO_ROOM_TOKEN);
  const [isConnected, setIsConnected] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (chatId) {
      joinVideoRoom({ variables: { chatId } });
    }
  }, [chatId, joinVideoRoom]);

  const handleDisconnect = () => setIsConnected(false);

  const handleClose = () => {
    const backgroundLocation = location.state?.backgroundLocation;
    navigate(backgroundLocation?.pathname || '/', { replace: true });
  };

  if (!data?.joinVideoRoom) return <LoadingSpinner />;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <CloseButton onClick={handleClose} />
      <div className="bg-white w-full max-w-6xl h-full md:max-h-[95vh]">
        <LiveKitRoom
          video={true}
          audio={true}
          token={data.joinVideoRoom}
          serverUrl={apiUrl}
          className="h-full bg-black text-white overflow-y-auto"
          connect={true}
          onConnected={() => setIsConnected(true)}
          onDisconnected={handleDisconnect}
        >
          {isConnected && <Stage />}
          <RoomAudioRenderer />
          <ControlBar />
        </LiveKitRoom>
      </div>
    </div>
  );
};

export default VideoCallPage;
