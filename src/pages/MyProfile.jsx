import React, { useState, useEffect } from "react";
import { assets } from "../assets/assets";
import authService from "../services/authService";
import { useAuth } from "../context/AuthContext";
import ChangeEmailModal from "../components/ChangeEmailModal";
import ChangePasswordModal from "../components/ChangePasswordModal";

const MyProfile = () => {
  const { currentUser, updateUser } = useAuth();
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState("");
  const [imageSuccess, setImageSuccess] = useState("");
  const [isChangeEmailModalOpen, setChangeEmailModalOpen] = useState(false);
  const [isChangePasswordModalOpen, setChangePasswordModalOpen] = useState(false);
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    fullName: '',
    image: assets.profile_pic,
    email: "",
    phoneNumber: "",
    address: "",
    gender: "",
    dateOfBirth: "",
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const fetchedData = await authService.getCurrentUser();

        setUserData((prev) => ({
          ...prev,
          firstName: fetchedData.firstName || "",
          lastName: fetchedData.lastName || "",
          fullName: fetchedData.fullName || "",
          email: fetchedData.email || "",
          gender: fetchedData.gender || "",
          phoneNumber: fetchedData.phoneNumber || "",
          address: fetchedData.address || "",
          dateOfBirth: fetchedData.dateOfBirth ? new Date(fetchedData.dateOfBirth).toISOString().split('T')[0] : "",
        }));

        // Load current profile picture
        await loadProfilePicture();
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Failed to load user data");
      }
    };

    loadData();
  }, []);

  const loadProfilePicture = async () => {
    try {
      const pictureData = await authService.getCurrentProfilePicture();
      if (pictureData.success && pictureData.fileUrl) {
        setUserData((prev) => ({
          ...prev,
          image: pictureData.fileUrl
        }));
      }
    } catch (error) {
      console.error("Error loading profile picture:", error);
      // Keep default image if loading fails
    }
  };

  // Save profile using API
  const saveProfile = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Prepare data for API
      const updateData = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        address: userData.address,
        dateOfBirth: userData.dateOfBirth ? new Date(userData.dateOfBirth) : null,
        phoneNumber: userData.phoneNumber
      };

      // Remove empty fields to avoid validation errors
      Object.keys(updateData).forEach(key => {
        if (updateData[key] === "" || updateData[key] === null) {
          delete updateData[key];
        }
      });

      const response = await authService.updateProfile(updateData);
      
      if (response.success) {
        setSuccess(response.message || "Profile updated successfully!");
        setIsEdit(false);
        
        // Refresh user data
        const updatedUserData = await authService.getCurrentUser();
        setUserData((prev) => ({
          ...prev,
          firstName: updatedUserData.firstName || "",
          lastName: updatedUserData.lastName || "",
          fullName: updatedUserData.fullName || "",
          phoneNumber: updatedUserData.phoneNumber || "",
          address: updatedUserData.address || "",
          dateOfBirth: updatedUserData.dateOfBirth ? new Date(updatedUserData.dateOfBirth).toISOString().split('T')[0] : "",
        }));
      } else {
        setError(response.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setError(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Frontend validation
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 2 * 1024 * 1024; // 2MB

    if (!allowedTypes.includes(file.type)) {
      setImageError("Invalid file type. Only jpg, jpeg, png, gif, and webp images are allowed.");
      return;
    }

    if (file.size > maxSize) {
      setImageError("File size exceeds the 2MB limit.");
      return;
    }

    setImageLoading(true);
    setImageError("");
    setImageSuccess("");

    try {
      const response = await authService.uploadProfilePicture(file);
      
      if (response.success) {
        setImageSuccess("Profile picture updated successfully!");
        const newImageUrl = response.fileUrl;
        setUserData((prev) => ({
          ...prev,
          image: newImageUrl
        }));
        // Update the global context
        updateUser({ image: newImageUrl });
        
        // Clear the file input
        e.target.value = '';
      } else {
        setImageError(response.message || "Failed to upload profile picture");
      }
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      setImageError(error.response?.data?.message || "Failed to upload profile picture");
    } finally {
      setImageLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-xl mt-8">
      {/* Profile Picture Section */}
      <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
        <div className="relative">
          <img
            src={userData.image}
            alt="Profile"
            className="w-32 h-32 object-cover rounded-full border-4 border-indigo-500"
            onError={(e) => {
              e.target.src = assets.profile_pic;
            }}
          />
          {imageLoading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
              <div className="text-white text-sm">Uploading...</div>
            </div>
          )}
        </div>
        
        <div className="flex flex-col gap-2">
          <label className="cursor-pointer bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700 transition text-center">
            {imageLoading ? "Uploading..." : "Change Picture"}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              disabled={imageLoading}
            />
          </label>
          <p className="text-xs text-gray-500 text-center">
            JPG, PNG, GIF, WebP up to 2MB
          </p>
        </div>
      </div>

      {imageError && (
        <div className="mb-4 p-3 text-red-700 bg-red-100 rounded">
          {imageError}
        </div>
      )}

      {imageSuccess && (
        <div className="mb-4 p-3 text-green-700 bg-green-100 rounded">
          {imageSuccess}
        </div>
      )}

      {/* Profile Data Section */}
      <div className="flex flex-col sm:flex-row items-center gap-3 mb-6">
        {isEdit ? (
          <div className="flex gap-2">
            <input
              type="text"
              value={userData.firstName}
              onChange={(e) =>
                setUserData((prev) => ({ ...prev, firstName: e.target.value }))
              }
              className="text-2xl font-semibold outline-none border-b border-gray-300"
              placeholder="First Name"
            />
            <input
              type="text"
              value={userData.lastName}
              onChange={(e) =>
                setUserData((prev) => ({ ...prev, lastName: e.target.value }))
              }
              className="text-2xl font-semibold outline-none border-b border-gray-300"
              placeholder="Last Name"
            />
          </div>
        ) : (
          <h1 className="text-3xl font-bold text-gray-800">{userData.fullName}</h1>
        )}
      </div>

      {error && (
        <div className="mt-4 p-3 text-red-700 bg-red-100 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="mt-4 p-3 text-green-700 bg-green-100 rounded">
          {success}
        </div>
      )}

      <hr className="my-6 border-gray-300" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
        <div>
          <p className="font-medium">Email</p>
          <p className="text-blue-600">{currentUser?.email}</p>
        </div>

        <div>
          <p className="font-medium">Phone Number</p>
          {isEdit ? (
            <input
              type="text"
              value={userData.phoneNumber}
              onChange={(e) =>
                setUserData((prev) => ({ ...prev, phoneNumber: e.target.value }))
              }
              className="border p-2 rounded w-full"
              placeholder="e.g., +201234567890 or 01234567890"
            />
          ) : (
            <p>{userData.phoneNumber || "Not set"}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <p className="font-medium">Address</p>
          {isEdit ? (
            <input
              type="text"
              value={userData.address}
              onChange={(e) =>
                setUserData((prev) => ({ ...prev, address: e.target.value }))
              }
              className="border p-2 rounded w-full"
              placeholder="Enter your address"
            />
          ) : (
            <p>{userData.address || "Not set"}</p>
          )}
        </div>

        <div>
          <p className="font-medium">Gender</p>
          <p>{userData.gender}</p>
        </div>

        <div>
          <p className="font-medium">Date of Birth</p>
          {isEdit ? (
            <input
              type="date"
              value={userData.dateOfBirth}
              onChange={(e) =>
                setUserData((prev) => ({ ...prev, dateOfBirth: e.target.value }))
              }
              className="border p-2 rounded w-full"
            />
          ) : (
            <p>{userData.dateOfBirth || "Not set"}</p>
          )}
        </div>
      </div>

      <div className="mt-8 text-right">
        {isEdit ? (
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => {
                setIsEdit(false);
                setError("");
                setSuccess("");
              }}
              className="border border-gray-400 text-gray-600 px-6 py-2 rounded-full hover:bg-gray-50 transition"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={saveProfile}
              disabled={loading}
              className="bg-indigo-600 text-white px-6 py-2 rounded-full hover:bg-indigo-700 transition disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Profile"}
            </button>
          </div>
        ) : (
          <div className="flex flex-wrap gap-4 justify-end">
            <button
              onClick={() => setChangeEmailModalOpen(true)}
              className="border border-gray-600 text-gray-800 px-6 py-2 rounded-full hover:bg-gray-100 transition"
            >
              Change Email
            </button>
            <button
              onClick={() => setChangePasswordModalOpen(true)}
              className="border border-gray-600 text-gray-800 px-6 py-2 rounded-full hover:bg-gray-100 transition"
            >
              Change Password
            </button>
            <button
              onClick={() => setIsEdit(true)}
              className="border border-indigo-600 text-indigo-600 px-6 py-2 rounded-full hover:bg-indigo-50 transition"
            >
              Edit Profile
            </button>
          </div>
        )}
      </div>
      <ChangeEmailModal
        isOpen={isChangeEmailModalOpen}
        onClose={() => setChangeEmailModalOpen(false)}
        onEmailChanged={(newEmail) => {
          updateUser({ email: newEmail });
        }}
      />
      <ChangePasswordModal
        isOpen={isChangePasswordModalOpen}
        onClose={() => setChangePasswordModalOpen(false)}
      />
    </div>
  );
};

export default MyProfile;

