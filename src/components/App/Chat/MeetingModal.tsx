import React, { FC, useEffect, useMemo, useState } from 'react';

import CloseButton from '../Common/CloseButton';
import { useMutation } from '@apollo/client';
import { CREATE_MEETING, GENERATE_TOKEN } from '../../../graphql/mutations';
import {
  MeetingProvider,
  useMeeting,
  useParticipant,
} from '@videosdk.live/react-sdk';
import ReactPlayer from 'react-player';
import { useAppSelector } from '../../../redux/hooks';

interface MeetingModalProps {
  chatId: string;
  onClose: () => void;
}
const MeetingModal: FC<MeetingModalProps> = ({ chatId, onClose }) => {
  const user = useAppSelector((s) => s.auth.user);
  const [meetingId, setMeetingId] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const [generateToken] = useMutation(GENERATE_TOKEN);
  const [createMeeting] = useMutation(CREATE_MEETING);

  const getMeetingAndToken = async (chatId: string) => {
    try {
      // Önce token al
      const { data: tokenData } = await generateToken({
        variables: { chatId },
      });
      const newToken = tokenData.generateToken;
      console.log(newToken);
      setToken(newToken);

      // Token ile meeting oluştur
      const { data: meetingData } = await createMeeting({
        variables: {
          token: newToken,
          chatId,
        },
      });
      console.log(meetingData.createMeeting);
      setMeetingId(meetingData.createMeeting.roomId);
      setApiKey(meetingData.createMeeting.apiKey);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const onMeetingLeave = () => {
    setMeetingId(null);
    setToken(null);
  };
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <CloseButton onClick={onClose} />
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-w-4xl items-center w-full mx-auto p-10 rounded-2xl bg-white overflow-hidden flex flex-col"
      >
        {meetingId && token && apiKey ? (
          <MeetingProvider
            config={{
              debugMode: false,
              meetingId,
              micEnabled: true,
              webcamEnabled: true,
              participantId: user?._id,
              name: 'User', // Kullanıcı adını buraya ekleyebilirsiniz
            }}
            token={token}
          >
            <MeetingView
              meetingId={meetingId}
              onMeetingLeave={onMeetingLeave}
            />
          </MeetingProvider>
        ) : (
          <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-3xl font-bold mb-4">Meeting katıl</h1>
            <button onClick={() => getMeetingAndToken(chatId)}>
              Meeting'e katıl
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

function ParticipantView({ participantId }: { participantId: string }) {
  const { webcamStream, micStream, webcamOn, micOn, isLocal } =
    useParticipant(participantId);

  const videoStream = useMemo(() => {
    if (webcamOn && webcamStream) {
      const mediaStream = new MediaStream();
      mediaStream.addTrack(webcamStream.track);
      return mediaStream;
    }
  }, [webcamStream, webcamOn]);

  return (
    <div>
      {videoStream && (
        <ReactPlayer
          playsinline
          pip={false}
          light={false}
          controls={false}
          muted={isLocal}
          playing
          url={videoStream}
          width="100%"
          height="100%"
        />
      )}
    </div>
  );
}

function Controls() {
  const { leave, toggleMic, toggleWebcam } = useMeeting();

  return (
    <div>
      <button onClick={() => toggleMic()}>Toggle Mic</button>
      <button onClick={() => toggleWebcam()}>Toggle Webcam</button>
      <button onClick={() => leave()}>Leave</button>
    </div>
  );
}

function MeetingView({
  onMeetingLeave,
  meetingId,
}: {
  onMeetingLeave: () => void;
  meetingId: string;
}) {
  const { participants, join } = useMeeting({
    onMeetingLeft: onMeetingLeave,
  });

  useEffect(() => {
    join();
  }, []);

  return (
    <div>
      <Controls />
      {[...participants.keys()].map((participantId) => (
        <ParticipantView participantId={participantId} key={participantId} />
      ))}
    </div>
  );
}

export default MeetingModal;
