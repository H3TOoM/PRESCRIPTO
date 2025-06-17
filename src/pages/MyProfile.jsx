import React, { useState, useEffect } from "react";
import { assets } from "../assets/assets";
import authService from "../services/authService";

const MyProfile = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [userData, setUserData] = useState({
    name: '',
    image: assets.profile_pic,
    email: "",
    phone: "",
    address: { line1: "", line2: "" },
    gender: "",
    dob: "",
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const fetchedData = await authService.getCurrentUser();

        setUserData((prev) => ({
          ...prev,
          name: fetchedData.name || "",
          email: fetchedData.email || "",
          gender: fetchedData.gender || "",
          image: fetchedData.image || assets.profile_pic,
        }));
      } catch (error) {
        console.error("Error fetching user data:", error);
      }

      const data = localStorage.getItem("UserData");
      if (data) {
        const parsed = JSON.parse(data);
        setUserData((prev) => ({
          ...prev,
          ...parsed,
          address: parsed.address || { line1: "", line2: "" },
        }));
      }
    };

    loadData();
  }, []);


  // Save to localStorage on update
  const saveProfile = () => {
    localStorage.setItem("UserData", JSON.stringify(userData));
    setIsEdit(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserData((prev) => ({
          ...prev,
          image: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-xl mt-8">
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <img
          src={userData.image ? userData.image : assets.upload_icon}
          alt="Profile"
          className="w-32 h-32 object-cover rounded-full border-4 border-indigo-500"
        />
        {isEdit && (
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="text-sm"
          />
        )}
        <br />
        {isEdit ? (
          <input
            type="text"
            value={userData.name}
            onChange={(e) =>
              setUserData((prev) => ({ ...prev, name: e.target.value }))
            }
            className="text-3xl font-semibold outline-none border-b border-gray-300"
          />
        ) : (
          <h1 className="text-3xl font-bold text-gray-800">{userData.name}</h1>
        )}
      </div>

      <hr className="my-6 border-gray-300" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
        <div>
          <p className="font-medium">Email</p>
          <p className="text-blue-600">{userData.email}</p>
        </div>

        <div>
          <p className="font-medium">Phone</p>
          {isEdit ? (
            <input
              type="text"
              value={userData.phone}
              onChange={(e) =>
                setUserData((prev) => ({ ...prev, phone: e.target.value }))
              }
              className="border p-2 rounded w-full"
            />
          ) : (
            <p>{userData.phone}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <p className="font-medium">Address</p>
          {isEdit ? (
            <div className="space-y-2">
              <input
                type="text"
                value={userData.address.line1}
                onChange={(e) =>
                  setUserData((prev) => ({
                    ...prev,
                    address: { ...prev.address, line1: e.target.value },
                  }))
                }
                className="border p-2 rounded w-full"
                placeholder="Address Line 1"
              />
              <input
                type="text"
                value={userData.address.line2}
                onChange={(e) =>
                  setUserData((prev) => ({
                    ...prev,
                    address: { ...prev.address, line2: e.target.value },
                  }))
                }
                className="border p-2 rounded w-full"
                placeholder="Address Line 2"
              />
            </div>
          ) : (
            <p>
              {userData.address.line1}
              <br />
              {userData.address.line2}
            </p>
          )}
        </div>

        <div>
          <p className="font-medium">Gender</p>
          {isEdit ? (
            <select
              value={userData.gender}
              onChange={(e) =>
                setUserData((prev) => ({ ...prev, gender: e.target.value }))
              }
              className="border p-2 rounded w-full"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          ) : (
            <p>{userData.gender}</p>
          )}
        </div>

        <div>
          <p className="font-medium">Date of Birth</p>
          {isEdit ? (
            <input
              type="date"
              value={userData.dob}
              onChange={(e) =>
                setUserData((prev) => ({ ...prev, dob: e.target.value }))
              }
              className="border p-2 rounded w-full"
            />
          ) : (
            <p>{userData.dob}</p>
          )}
        </div>
      </div>

      <div className="mt-8 text-right">
        {isEdit ? (
          <button
            onClick={saveProfile}
            className="bg-indigo-600 text-white px-6 py-2 rounded-full hover:bg-indigo-700 transition"
          >
            Save Profile
          </button>
        ) : (
          <button
            onClick={() => setIsEdit(true)}
            className="border border-indigo-600 text-indigo-600 px-6 py-2 rounded-full hover:bg-indigo-50 transition"
          >
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );
};

export default MyProfile;
