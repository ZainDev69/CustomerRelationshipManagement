import { useState } from "react";
import { getClientImage } from "../../../utils/avatarUtils";
import { FileUploadButton } from "../../../components/ui/FileUploadButton";
import { Camera } from "lucide-react";

export function PhotoUpload({ client, setPhotoFile, formData }) {
  const [photoPreview, setPhotoPreview] = useState(client?.photo || "");
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const imageUrl = photoPreview
    ? photoPreview
    : getClientImage(
        client?.photo,
        formData.personalDetails?.title,
        formData.personalDetails?.gender,
        backendUrl
      );

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
      {/* Modern Section Header */}
      <div className="bg-gradient-to-r from-slate-500 to-gray-600 px-8 py-6">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
            <Camera className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Client Photo</h2>
            <p className="text-slate-100 mt-1 text-sm">
              Upload or update client profile picture
            </p>
          </div>
        </div>
      </div>

      {/* Photo Content */}
      <div className="p-8">
        <div className="flex flex-col lg:flex-row items-center lg:items-start space-y-6 lg:space-y-0 lg:space-x-8">
          {/* Photo Display */}
          <div className="flex-shrink-0">
            <div className="relative group">
              <img
                src={imageUrl}
                alt="Client"
                className="w-32 h-32 lg:w-40 lg:h-40 rounded-2xl object-cover border-4 border-gray-100 shadow-lg transition-all duration-200 group-hover:shadow-xl"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-2xl transition-all duration-200 flex items-center justify-center">
                <Camera className="w-8 h-8 text-white opacity-0 group-hover:opacity-80 transition-opacity duration-200" />
              </div>
            </div>
          </div>

          {/* Upload Controls */}
          <div className="flex-1 text-center lg:text-left">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Profile Picture
            </h3>
            <p className="text-gray-600 text-sm mb-6 max-w-md">
              Add a professional photo to help staff identify the client.
              Recommended size: 400x400px or larger.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <FileUploadButton
                label="Upload Photo"
                onChange={handlePhotoChange}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
              />
              {photoPreview && (
                <button
                  onClick={() => {
                    setPhotoPreview("");
                    setPhotoFile(null);
                  }}
                  className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors duration-200"
                >
                  Remove Photo
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
