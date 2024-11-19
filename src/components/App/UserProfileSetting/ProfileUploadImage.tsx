import { useMutation } from '@apollo/client';
import axios from 'axios';
import { useState } from 'react';
import { BiCamera } from 'react-icons/bi';
import { toast } from 'react-toastify';
import { GENERATE_SIGNED_URL } from '../../../graphql/mutations';
import { SignedUrlData, SignUrlInput } from '../Chat/MessageInput';
import { UPLOAD_PROFILE_PHOTO } from '../../../graphql/mutations/User/UploadProfilePhoto';

export const ProfileUploadImage: React.FC<{ profilePhoto: string | null }> = ({
  profilePhoto,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false); // Modal control
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false); // Loading state
  const [getSignedUrl] = useMutation<SignedUrlData, { input: SignUrlInput }>(
    GENERATE_SIGNED_URL
  );
  const [uploadProfilePhoto] = useMutation(UPLOAD_PROFILE_PHOTO);

  const uploadToCloudinary = async (file: File) => {
    const publicId = `user_${Date.now()}`;
    const { data } = await getSignedUrl({
      variables: { input: { publicId, folder: 'profilePhotos' } },
    });

    if (!data) {
      throw new Error('Failed to get signed URL');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_key', data.generateSignedUploadUrl.apiKey);
    formData.append(
      'timestamp',
      data.generateSignedUploadUrl.timestamp.toString()
    );
    formData.append('signature', data.generateSignedUploadUrl.signature);
    formData.append('public_id', publicId);
    formData.append('folder', 'profilePhotos');

    try {
      const response = await axios.post<{ secure_url: string }>(
        `https://api.cloudinary.com/v1_1/${data.generateSignedUploadUrl.cloudName}/auto/upload`,
        formData
      );
      return { url: response.data.secure_url, publicId };
    } catch (error) {
      throw new Error('Upload failed');
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      setFileToUpload(file); // Store the file
      setShowConfirmation(true); // Show confirmation modal
    }
  };

  const confirmUpload = async () => {
    setShowConfirmation(false); // Close modal
    if (fileToUpload) {
      setIsUploading(true); // Start loading
      try {
        const uploadedImage = await uploadToCloudinary(fileToUpload);
        await uploadProfilePhoto({
          variables: {
            profilePhoto: uploadedImage.url,
          },
        });
        toast.success('Profile photo updated successfully!');
      } catch (err) {
        console.error(err);
        toast.error('Failed to upload the profile photo.');
      } finally {
        setIsUploading(false); // Stop loading
      }
    }
  };

  return (
    <>
      <img
        src={selectedImage || profilePhoto || 'https://via.placeholder.com/120'}
        alt="Profile"
        className="w-full h-full rounded-full object-cover"
      />
      <input
        type="file"
        id="imageInput"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleImageChange}
        disabled={isUploading} // Disable input when loading
      />
      <button
        className={`absolute ${
          isUploading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        onClick={() =>
          !isUploading && document.getElementById('imageInput')?.click()
        }
        disabled={isUploading} // Disable button when loading
      >
        <BiCamera className="text-white" size={40} />
      </button>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-md">
            <p>Bu resmi yüklemek istediğinizden emin misiniz?</p>
            <div className="flex justify-end mt-4 space-x-2">
              <button
                onClick={() => setShowConfirmation(false)}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                disabled={isUploading} // Disable during upload
              >
                İptal
              </button>
              <button
                onClick={confirmUpload}
                className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 ${
                  isUploading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={isUploading} // Disable during upload
              >
                {isUploading ? 'Yükleniyor...' : 'Onayla'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
