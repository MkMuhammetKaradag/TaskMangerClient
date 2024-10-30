import React, { useState, useCallback, useRef } from 'react';
import { useMutation } from '@apollo/client';
import {
  ADD_MESSAGE_TO_CHAT,
  GENERATE_SIGNED_URL,
} from '../../../graphql/mutations';
import axios from 'axios';
// import { ADD_MESSAGE_TO_CHAT } from '../../graphql/mutations/AddMessageToChat';

// Enum tanımlamaları
enum MediaContentType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  AUDIO = 'AUDIO',
  DOCUMENT = 'DOCUMENT',
}

enum MessageType {
  TEXT = 'TEXT',
  MEDIA = 'MEDIA',
}

// Interface tanımlamaları
interface MessageInputProps {
  chatId: string;
}

interface MediaContent {
  url: string;
  type: MediaContentType;
  mimeType: string;
}

interface SignUrlInput {
  publicId: string;
  folder: string;
}

interface SignedUrlData {
  generateSignedUploadUrl: {
    signature: string;
    timestamp: number;
    cloudName: string;
    apiKey: string;
  };
}

const uploadToCloudinary = async (file: File, getSignedUrl: any) => {
  const publicId = `message_${Date.now()}`;
  let folder = 'chat/documents'; // varsayılan klasör

  if (file.type.startsWith('image/')) {
    folder = 'chat/images';
  } else if (file.type.startsWith('video/')) {
    folder = 'chat/videos';
  } else if (file.type.startsWith('audio/')) {
    folder = 'chat/audios';
  } else if (file.type === 'application/pdf' || file.type === 'text/plain') {
    folder = 'chat/documents';
  }

  const { data } = await getSignedUrl({
    variables: { input: { publicId, folder } },
  });

  console.log(file);

  if (!data) throw new Error('Failed to get signed URL');

  const formData = new FormData();
  formData.append('file', file);
  formData.append('api_key', data.generateSignedUploadUrl.apiKey);
  formData.append(
    'timestamp',
    data.generateSignedUploadUrl.timestamp.toString()
  );
  formData.append('signature', data.generateSignedUploadUrl.signature);
  formData.append('public_id', publicId);
  formData.append('folder', folder);

  try {
    const response = await axios.post<{ secure_url: string }>(
      `https://api.cloudinary.com/v1_1/${data.generateSignedUploadUrl.cloudName}/auto/upload`,
      formData
    );
    let transformedUrl = response.data.secure_url;

    return { url: transformedUrl, publicId };
  } catch (error) {
    console.log('Upload failed', error);
    throw error;
  }
};

const MessageInput: React.FC<MessageInputProps> = ({ chatId }) => {
  const [message, setMessage] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [getSignedUrl] = useMutation<SignedUrlData, { input: SignUrlInput }>(
    GENERATE_SIGNED_URL
  );
  const [createMessage, { loading }] = useMutation(ADD_MESSAGE_TO_CHAT);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // İzin verilen MIME tipleri
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'video/mp4',
      'video/webm',
      'audio/mp3',
      'audio/wav',
      'audio/mpeg',
      'application/pdf',
      'text/plain',
    ];

    if (!allowedTypes.includes(file.type)) {
      alert(
        'Lütfen geçerli bir dosya formatı seçin: \n' +
          '- Resim (JPEG, PNG, GIF)\n' +
          '- Video (MP4, WEBM)\n' +
          '- Ses (MP3, WAV)\n' +
          '- Döküman (PDF, TXT)'
      );
      event.target.value = ''; // Input'u temizle
      return;
    }

    // Dosya boyutu kontrolü (örneğin 10MB)
    const maxSize = 3 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      alert("Dosya boyutu 3MB'dan küçük olmalıdır.");
      event.target.value = '';
      return;
    }

    setSelectedFile(file);
  };

  const getMediaType = (mimeType: string): MediaContentType => {
    if (mimeType.startsWith('image/')) return MediaContentType.IMAGE;
    if (mimeType.startsWith('video/')) return MediaContentType.VIDEO;
    if (mimeType.startsWith('audio/')) return MediaContentType.AUDIO;
    return MediaContentType.DOCUMENT;
  };

  const uploadFile = async (file: File): Promise<string> => {
    // Burada dosya yükleme işlemini gerçekleştirin ve URL'i döndürün
    // Bu örnek için mock bir URL döndürüyoruz

    const uploadedcloundinary = await uploadToCloudinary(file, getSignedUrl);

    return uploadedcloundinary.url;
  };

  const handleSend = useCallback(async () => {
    // if (loading) return;
    console.log(selectedFile?.type);
    try {
      if (selectedFile) {
        // Medya mesajı gönderme
        const uploadedUrl = await uploadFile(selectedFile);
        await createMessage({
          variables: {
            input: {
              chatId,
              type: MessageType.MEDIA,
              content: message.trim() || null,
              mediaContent: {
                url: uploadedUrl,
                type: getMediaType(selectedFile.type),
                mimeType: selectedFile.type,
              },
            },
          },
        });

        setSelectedFile(null);
        setMessage('');
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else if (message.trim()) {
        // Text mesajı gönderme
        await createMessage({
          variables: {
            input: {
              chatId,
              type: MessageType.TEXT,
              content: message.trim(),
            },
          },
        });

        setMessage('');
      }
    } catch (err) {
      console.error('Mesaj gönderme hatası:', err);
    }
  }, [message, selectedFile, chatId, createMessage, loading]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="bg-gray-100 p-4">
      <div className="flex flex-col space-y-2">
        {selectedFile && (
          <div className="flex items-center bg-blue-50 p-2 rounded">
            <span className="flex-grow truncate">{selectedFile.name}</span>
            <button
              onClick={() => setSelectedFile(null)}
              className="ml-2 text-red-500 hover:text-red-700"
            >
              ✕
            </button>
          </div>
        )}
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Mesaj yaz..."
            className="flex-grow p-2 rounded-l border focus:outline-none focus:ring-2 focus:ring-blue-300"
            // disabled={loading}
          />
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileSelect}
            className="hidden"
            accept=".jpg,.jpeg,.png,.gif,.mp4,.webm,.mp3,.wav,.pdf,.txt,image/*,video/*,audio/*,application/pdf,text/plain"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 bg-gray-200 hover:bg-gray-300 rounded transition-colors"
            // disabled={loading}
          >
            📎
          </button>
          <button
            onClick={handleSend}
            className={`p-2 bg-blue-500 text-white rounded transition-colors ${
              !message.trim() && !selectedFile
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:bg-blue-600'
            }`}
            // disabled={loading || (!message.trim() && !selectedFile)}
          >
            {loading ? 'Gönderiliyor...' : 'Gönder'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(MessageInput);
