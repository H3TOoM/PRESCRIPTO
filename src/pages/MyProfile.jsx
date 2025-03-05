import React from "react";
import { useState } from "react";
import { assets } from "../assets/assets";

const MyProfile = () => {
  const [userdata, setUserDate] = useState({
    name: "Hatim Rajab",
    image: assets.profile_pic,
    email: "hatim@gmail.com",
    phone: "010 708 174 84",
    address: {
      line1: "75th cross ,london",
      line2: "50th cross ,london",
    },
    gender: "Male",
    dob: "20-11-2005",
  });

  const [isEdit, SetIsEdit] = useState(false);
  return (
    <div className="max-w-lg flex flex-col gap-2 text-sm">
      <img src={userdata.image} alt="" className="w-36 rounded" />

      {isEdit ? (
        <input
          type="text"
          className="bg-gray-100 text-2xl font-medium max-w-60 mt-4 p-2 outline-0 rounded-lg"
          onChange={(e) =>
            setUserDate((prev) => ({ ...prev, name: e.target.value }))
          }
          value={userdata.name}
        />
      ) : (
        <p className="font-medium text-3xl text-neutral-800 mt-4">
          {userdata.name}
        </p>
      )}
      <hr className="bg-zinc-400 h-[1px] border-none" />

      <div>
        <p className="text-neutral-500 underline mt-3">CONTACT INFORMATION</p>
        <div className="grid grid-cols-2 gap-4 mt-4 text-neutral-800">
          <p className="font-medium">Email id :</p>
          <p className="text-blue-400">{userdata.email}</p>
          <p className="font-medium">Phone :</p>
          {isEdit ? (
            <input
              type="text"
              onChange={(e) =>
                setUserDate((prev) => ({ ...prev, phone: e.target.value }))
              }
              value={userdata.phone}
            />
          ) : (
            <p className="text-gray-500">{userdata.phone}</p>
          )}

          <p className="font-medium">Address :</p>
          {isEdit ? (
            <p>
              <input
                type="text"
                onChange={(e) =>
                  setUserDate((prev) => ({
                    ...prev,
                    address: { ...prev.address, line1: e.target.value },
                  }))
                }
                value={userdata.address.line1}
              />
              <br />
              <input
                type="text"
                onChange={(e) =>
                  setUserDate((prev) => ({
                    ...prev,
                    address: { ...prev.address, line2: e.target.value },
                  }))
                }
                value={userdata.address.line2}
              />
            </p>
          ) : (
            <p className="text-gray-500">
              {userdata.address.line1}
              <br />
              {userdata.address.line2}
            </p>
          )}
        </div>
      </div>

      <div>
        <p className="text-neutral-500 underline mt-3">BASIC INFORMATION</p>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <p className="font-medium">Gender :</p>
          {isEdit ? (
            <select
              onChange={(e) =>
                setUserDate((prev) => ({ ...prev, gender: e.target.value }))
              }
              value={userdata.gender}
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          ) : (
            <p>{userdata.gender}</p>
          )}

          <p className="font-medium">Birthday : </p>
          {isEdit ? (
            <input
              type="date"
              onChange={(e) =>
                setUserDate((prev) => ({ ...prev, dob: e.target.value }))
              }
              value={userdata.dob}
            />
          ) : (
            <p>{userdata.dob}</p>
          )}
        </div>
      </div>

      <div className="mt-10">
        {isEdit ? (
          <button onClick={() => SetIsEdit(false)} className="font-medium border border-[#5F6FFF] py-2 px-8 rounded-full hover:bg-[#5F6FFF] hover:text-white transtion-all duration-300 cursor-pointer ">Save Information</button>
        ) : (
          <button onClick={() => SetIsEdit(true)} className="font-medium border border-[#5F6FFF] py-2 px-8 rounded-full hover:bg-[#5F6FFF] hover:text-white transtion-all duration-300 cursor-pointer">Edit</button>
        )}
      </div>
    </div>
  );
};

export default MyProfile;
