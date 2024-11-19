import React, { useState, useCallback, useRef } from 'react';
import { useMutation } from '@apollo/client';
import {
  ADD_MESSAGE_TO_CHAT,
  GENERATE_SIGNED_URL,
} from '../../../graphql/mutations';
import axios from 'axios';

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

const FILE_CONFIGS = {
  maxSize: 3 * 1024 * 1024, // 3MB
  allowedTypes: [
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
  ],
  folders: {
    image: 'chat/images',
    video: 'chat/videos',
    audio: 'chat/audios',
    document: 'chat/documents',
  },
};
// Yardımcı fonksiyonlar
const getMediaType = (mimeType: string): MediaContentType => {
  const typeMap: Record<string, MediaContentType> = {
    image: MediaContentType.IMAGE,
    video: MediaContentType.VIDEO,
    audio: MediaContentType.AUDIO,
  };

  const prefix = mimeType.split('/')[0];
  return typeMap[prefix] || MediaContentType.DOCUMENT;
};

const getUploadFolder = (fileType: string): string => {
  if (fileType.startsWith('image/')) return FILE_CONFIGS.folders.image;
  if (fileType.startsWith('video/')) return FILE_CONFIGS.folders.video;
  if (fileType.startsWith('audio/')) return FILE_CONFIGS.folders.audio;
  return FILE_CONFIGS.folders.document;
};

// Interface tanımlamaları
interface MessageInputProps {
  chatId: string;
}

export interface SignUrlInput {
  publicId: string;
  folder: string;
}

export interface SignedUrlData {
  generateSignedUploadUrl: {
    signature: string;
    timestamp: number;
    cloudName: string;
    apiKey: string;
  };
}

const MessageInput: React.FC<MessageInputProps> = ({ chatId }) => {
  // State tanımlamaları
  const [message, setMessage] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false); // Yeni: Yükleme durumu için state
  const [isSending, setIsSending] = useState(false); // Yeni: Gönderme durumu için state
  const fileInputRef = useRef<HTMLInputElement>(null);

  // GraphQL mutations
  const [getSignedUrl] = useMutation<SignedUrlData, { input: SignUrlInput }>(
    GENERATE_SIGNED_URL
  );
  const [createMessage, { loading }] = useMutation(ADD_MESSAGE_TO_CHAT);

  const uploadToCloudinary = async (file: File) => {
    try {
      setIsUploading(true); // Yükleme başladığında state'i güncelle

      // Benzersiz bir public ID oluştur
      const publicId = `message_${Date.now()}`;
      const folder = getUploadFolder(file.type);

      // İmzalı URL al
      const { data } = await getSignedUrl({
        variables: { input: { publicId, folder } },
      });

      if (!data) throw new Error('İmzalı URL alınamadı');

      // Form verilerini hazırla
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

      // Cloudinary'ye yükle
      const response = await axios.post<{ secure_url: string }>(
        `https://api.cloudinary.com/v1_1/${data.generateSignedUploadUrl.cloudName}/auto/upload`,
        formData
      );

      return { url: response.data.secure_url, publicId };
    } catch (error) {
      console.error('Dosya yükleme hatası:', error);
      throw error;
    } finally {
      setIsUploading(false); // Yükleme bittiğinde state'i güncelle
    }
  };
  const handleFileSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      // Dosya tipi kontrolü
      if (!FILE_CONFIGS.allowedTypes.includes(file.type)) {
        alert('Geçersiz dosya formatı. Lütfen desteklenen bir format seçin.');
        event.target.value = '';
        return;
      }

      // Dosya boyutu kontrolü
      if (file.size > FILE_CONFIGS.maxSize) {
        alert("Dosya boyutu 3MB'dan küçük olmalıdır.");
        event.target.value = '';
        return;
      }

      setSelectedFile(file);
    },
    []
  );

  const handleSend = useCallback(async () => {
    if (loading) return;

    try {
      setIsSending(true); // Gönderme işlemi başladığında state'i güncelle
      if (selectedFile) {
        // Medya mesajı gönderme
        const { url } = await uploadToCloudinary(selectedFile);
        await createMessage({
          variables: {
            input: {
              chatId,
              type: 'MEDIA' as MessageType,
              content: message.trim() || null,
              mediaContent: {
                url,
                type: getMediaType(selectedFile.type),
                mimeType: selectedFile.type,
              },
            },
          },
        });

        // Form temizleme
        setSelectedFile(null);
        setMessage('');
        if (fileInputRef.current) fileInputRef.current.value = '';
      } else if (message.trim()) {
        // Metin mesajı gönderme
        await createMessage({
          variables: {
            input: {
              chatId,
              type: 'TEXT' as MessageType,
              content: message.trim(),
            },
          },
        });

        setMessage('');
      }
    } catch (error) {
      console.error('Mesaj gönderme hatası:', error);
      alert('Mesaj gönderilemedi. Lütfen tekrar deneyin.');
    } finally {
      setIsSending(false); // Gönderme işlemi bittiğinde state'i güncelle
    }
  }, [message, selectedFile, chatId, createMessage, isUploading, isSending]);

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && !e.shiftKey && !isSending && !isUploading) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend, isSending, isUploading]
  );
  const isDisabled = isSending || isUploading;
  const canSend = (message.trim() || selectedFile) && !isDisabled;
  return (
    <div className="bg-gray-100 p-4">
      <div className="flex flex-col space-y-2">
        {/* Yükleme durumu göstergesi */}
        {isUploading && (
          <div className="text-sm text-blue-600 animate-pulse">
            Dosya yükleniyor...
          </div>
        )}

        {/* Seçili dosya gösterimi */}
        {selectedFile && (
          <div className="flex items-center bg-blue-50 p-2 rounded">
            <span className="flex-grow truncate">{selectedFile.name}</span>
            <button
              onClick={() => setSelectedFile(null)}
              className="ml-2 text-red-500 hover:text-red-700"
              disabled={isDisabled}
            >
              ✕
            </button>
          </div>
        )}

        {/* Mesaj girişi ve kontroller */}
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Mesaj yaz..."
            className="flex-grow p-2 rounded-l border focus:outline-none focus:ring-2 focus:ring-blue-300"
            disabled={isDisabled}
          />

          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileSelect}
            className="hidden"
            accept={FILE_CONFIGS.allowedTypes.join(',')}
            disabled={isDisabled}
          />

          {/* Dosya ekleme butonu */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className={`p-2 bg-gray-200 rounded transition-colors ${
              isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-300'
            }`}
            disabled={isDisabled}
          >
            📎
          </button>

          {/* Gönder butonu */}
          <button
            onClick={handleSend}
            className={`p-2 bg-blue-500 text-white rounded transition-colors ${
              !canSend ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
            }`}
            disabled={!canSend}
          >
            {isUploading
              ? 'Yükleniyor...'
              : isSending
              ? 'Gönderiliyor...'
              : 'Gönder'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(MessageInput);
