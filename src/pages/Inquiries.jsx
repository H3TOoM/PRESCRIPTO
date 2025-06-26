import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import inquiryService from "../services/inquiryService";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";

const MedicalConsultation = () => {
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token } = useContext(AppContext);
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Check authentication
  if (!token) {
    return (
      <div className="max-w-2xl p-6 mt-12 ml-auto mr-auto rounded-2xl shadow-md border border-gray-300">
        <h1 className="text-3xl font-semibold mb-6 text-gray-500">
          {t("inquiries_title")}
        </h1>
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">{t("inquiries_login_prompt")}</p>
          <button
            onClick={() => navigate('/login')}
            className="bg-[#5F6FFF] text-gray-50 py-2 px-6 rounded-md font-semibold shadow-md hover:bg-blue-600 transition ease-in-out duration-500">
            {t("inquiries_login_button")}
          </button>
        </div>
      </div>
    );
  }

  // File validation
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const validFiles = selectedFiles.filter((file) => {
      if (!file.type.startsWith("image/")) {
        Swal.fire({ title: t("inquiries_invalid_file_title"), text: t("inquiries_invalid_file_text"), icon: "warning" });
        return false;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB
        Swal.fire({ title: t("inquiries_file_too_large_title"), text: t("inquiries_file_too_large_text"), icon: "warning" });
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
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!message.trim()) {
      Swal.fire({ title: t("inquiries_message_required_title"), text: t("inquiries_message_required_text"), icon: "warning" });
      return;
    }

    setLoading(true);

    try {
      const consultationData = {
        message: message,
        files: files
      };

      await inquiryService.submitConsultation(consultationData);

      Swal.fire({ title: t("inquiries_success_title"), text: t("inquiries_success_text"), icon: "success" });
      
      setMessage('');
      setFiles([]);
    } catch (error) {
      console.error('Error submitting consultation:', error);
      const errorMessage = error.response?.data?.message || t("inquiries_failed_submit_text");
      Swal.fire({ title: t("inquiries_failed_submit_title"), text: errorMessage, icon: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl p-6 mt-12 ml-auto mr-auto rounded-2xl shadow-md border border-gray-300">
      <h1 className="text-3xl font-semibold mb-6 text-gray-500">
        {t("inquiries_title")}
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Consultation message */}
        <textarea
          className="border border-gray-300 rounded-lg p-4 resize-none h-40 focus:outline-none focus:ring-2 focus:ring-[#5F6FFF] shadow-inner text-gray-900"
          placeholder={t("inquiries_message_placeholder")}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          disabled={loading}
        />

        {/* File upload */}
        <label className={`flex items-center px-4 py-2 border-2 border-[#5F6FFF] rounded-md font-semibold text-blue-500 hover:bg-[#5F6FFF] hover:text-gray-50 transition ease-in-out duration-500 shadow-md cursor-pointer ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => handleFileChange(e)}
            className="hidden"
            disabled={loading}
          />
          {t("inquiries_attach_images")}
        </label>

        {/* Display attached files */}
        {files.length > 0 && (
          <div className="p-4 rounded-md shadow-inner">
            <h2 className="text-gray-900 font-semibold mb-4">
              {t("inquiries_attached_images")}
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
                    disabled={loading}
                    className="absolute top-1 right-1 bg-red-500 text-gray-50 p-1 rounded-full shadow-md hover:bg-red-600 transition ease-in-out duration-500 disabled:opacity-50">
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
          disabled={loading}
          className={`bg-[#5F6FFF] text-gray-50 py-2 px-6 rounded-md font-semibold shadow-md hover:bg-blue-600 transform hover:translate-y-[-2px] transition ease-in-out duration-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0`}>
          {loading ? t("inquiries_submitting") : t("inquiries_submit_button")}
        </button>
      </form>
    </div>
  );
};

export default MedicalConsultation;

