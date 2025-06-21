import React, { useState } from "react";

const MedicalConsultation = () => {
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState([]);

  // File validation
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const validFiles = selectedFiles.filter((file) => {
      if (!file.type.startsWith("image/")) {
        alert("Only images are supported.");
        return false;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB
        // alert("Image size should be less than 5MB.");
        return false;
      }
      return true;
    });
    setFiles((prev) => [...prev, ...validFiles]);
  };

  // Remove image
  const handleRemove = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Submit consultation
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!message.trim()) {

      return;
    }

    if (files.length === 0) {
      // alert("Please attach at least 1 image.");
      return;
    }

    console.log("Consultation message :", message);
    console.log("Uploaded files :", files);


    setMessage('');
    setFiles([]);
  };

  return (
    <div className="max-w-2xl p-6 mt-12 ml-auto mr-auto rounded-2xl shadow-md border border-gray-300">
      <h1 className="text-3xl font-semibold mb-6 text-gray-500">
        Medical Consultation
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Consultation message */}
        <textarea
          className=" border border-gray-300 rounded-lg p-4 resize-none h-40 focus:outline-none focus:ring-2 focus:ring-[#5F6FFF] shadow-inner text-gray-900"
          placeholder="Write your consultation here..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />

        {/* File upload */}
        <label className="flex items-center px-4 py-2 border-2 border-[#5F6FFF] rounded-md font-semibold text-blue-500 hover:bg-[#5F6FFF] hover:text-gray-50 transition ease-in-out duration-500 shadow-md">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => handleFileChange(e)}
            className="hidden"
          />
          Attach Images
        </label>

        {/* Display attached files */}
        {files.length > 0 && (
          <div className=" p-4 rounded-md shadow-inner">
            <h2 className="text-gray-900 font-semibold mb-4">
              Attached Images:
            </h2>
            <div className="flex gap-4 flex-wrap">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="relative w-32 h-32 rounded-md overflow-hidden shadow-md border border-gray-300 group transform hover:scale-105 transition ease-in-out duration-500">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`image-${index}`}
                    className="object-cover w-full h-full"
                  />

                  {/* Remove button */}
                  <button
                    type="button"
                    onClick={() => handleRemove(index)}
                    className="absolute top-1 right-1 bg-red-500 text-gray-50 p-1 rounded-full shadow-md hover:bg-red-600 transition ease-in-out duration-500">
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          className="bg-[#5F6FFF] text-gray-50 py-2 px-6 rounded-md font-semibold shadow-md hover:bg-blue-600 transform hover:translate-y-[-2px] transition ease-in-out duration-500">
          Submit Consultation
        </button>
      </form>
    </div>
  );
};

export default MedicalConsultation;

