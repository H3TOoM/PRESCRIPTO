import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import inquiryService from "../services/inquiryService";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import { FaEdit, FaTrash, FaSave, FaTimes, FaPlus } from "react-icons/fa";

const MedicalConsultation = () => {
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inquiries, setInquiries] = useState([]);
  const [loadingInquiries, setLoadingInquiries] = useState(true);
  const { token } = useContext(AppContext);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [refresh, setRefresh] = useState(0);
  const [editId, setEditId] = useState(null);
  const [editMessage, setEditMessage] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    if (token) {
      setLoadingInquiries(true);
      inquiryService.getAllInquiries()
        .then((data) => setInquiries(data))
        .catch(() => setInquiries([]))
        .finally(() => setLoadingInquiries(false));
    }
  }, [token, refresh]);

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

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: t("inquiries_confirm_delete"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: t("myappointments_cancel_confirm_yes"),
      cancelButtonText: t("myappointments_cancel_confirm_no")
    });
    if (!result.isConfirmed) return;
    setDeletingId(id);
    try {
      await inquiryService.deleteInquiry(id);
      setInquiries((prev) => prev.filter((inq) => inq.id !== id));
    } catch (err) {
      Swal.fire({ title: t("inquiries_delete_failed_title"), text: t("inquiries_delete_failed_text"), icon: "error" });
    } finally {
      setDeletingId(null);
    }
  };

  const startEdit = (inq) => {
    setEditId(inq.id);
    setEditMessage(inq.message);
  };

  const saveEdit = async (id) => {
    if (!editMessage.trim()) return;
    try {
      await inquiryService.updateInquiry(id, { message: editMessage });
      setInquiries((prev) => prev.map((inq) => inq.id === id ? { ...inq, message: editMessage } : inq));
      setEditId(null);
      setEditMessage("");
    } catch (err) {
      Swal.fire({ title: t("inquiries_edit_failed_title"), text: t("inquiries_edit_failed_text"), icon: "error" });
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 p-0 m-0 flex flex-col items-center">
      <div className="w-full max-w-4xl mx-auto mt-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-primary drop-shadow">{t("inquiries_previous")}</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setRefresh(r => r + 1)}
              className="px-4 py-1 bg-primary text-white rounded-full shadow hover:bg-blue-700 transition"
              disabled={loadingInquiries}
            >
              {t("inquiries_refresh")}
            </button>
            <button
              onClick={() => setShowAddForm((v) => !v)}
              className="p-3 bg-primary text-white rounded-full shadow hover:bg-green-600 transition text-xl"
              title={t("inquiries_add_btn")}
            >
              <FaPlus />
            </button>
          </div>
        </div>
        {showAddForm && (
          <div className="mb-10 bg-white rounded-2xl shadow-lg p-6 border border-gray-300">
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <textarea
                className="border border-gray-300 rounded-lg p-4 resize-none h-32 focus:outline-none focus:ring-2 focus:ring-[#5F6FFF] shadow-inner text-gray-900"
                placeholder={t("inquiries_message_placeholder")}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                disabled={loading}
              />
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
              {files.length > 0 && (
                <div className="p-4 rounded-md shadow-inner">
                  <h2 className="text-gray-900 font-semibold mb-4">
                    {t("inquiries_attached_images")}
                  </h2>
                  <div className="flex gap-4 flex-wrap">
                    {files.map((file, index) => (
                      <div
                        key={index}
                        className="relative w-24 h-24 rounded-md overflow-hidden shadow-md border border-gray-300 group transform hover:scale-105 transition ease-in-out duration-500">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`image-${index}`}
                          className="object-cover w-full h-full"
                        />
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
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className={`bg-[#5F6FFF] text-gray-50 py-2 px-6 rounded-md font-semibold shadow-md hover:bg-blue-600 transform hover:translate-y-[-2px] transition ease-in-out duration-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0`}>
                  {loading ? t("inquiries_submitting") : t("inquiries_submit_button")}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="bg-gray-300 text-gray-800 py-2 px-6 rounded-md font-semibold shadow-md hover:bg-gray-400 transition">
                  {t("inquiries_cancel_btn")}
                </button>
              </div>
            </form>
          </div>
        )}
        {/* قائمة الاستشارات السابقة */}
        {loadingInquiries ? (
          <div className="text-lg text-gray-500 text-center py-8">{t("inquiries_loading")}</div>
        ) : inquiries.length === 0 ? (
          <div className="text-gray-400 text-center py-8">{t("inquiries_no_previous")}</div>
        ) : (
          <div className="grid gap-8">
            {inquiries.map((inq) => (
              <div key={inq.id} className="border border-gray-300 rounded-2xl p-6 bg-white shadow-lg flex flex-col md:flex-row md:items-center gap-6 relative group hover:shadow-2xl transition">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="font-semibold text-gray-800 text-lg">{t("inquiries_message_label")}:</span>
                    {editId === inq.id ? (
                      <input
                        className="border-2 border-primary rounded px-3 py-2 text-gray-800 w-full max-w-md focus:outline-none focus:ring-2 focus:ring-primary"
                        value={editMessage}
                        onChange={e => setEditMessage(e.target.value)}
                        disabled={deletingId === inq.id}
                        autoFocus
                      />
                    ) : (
                      <span className="text-gray-700 text-base break-words">{inq.message}</span>
                    )}
                  </div>
                  {inq.createdAt && (
                    <span className="text-xs text-gray-400 block mb-2">{t("inquiries_date_label")}: {new Date(inq.createdAt).toLocaleString()}</span>
                  )}
                  {inq.files && inq.files.length > 0 && (
                    <div className="mt-2">
                      <span className="font-semibold text-gray-800">{t("inquiries_attachments_label")}:</span>
                      <div className="flex gap-2 mt-1 flex-wrap">
                        {inq.files.map((fileUrl, idx) => (
                          <a key={idx} href={fileUrl} target="_blank" rel="noopener noreferrer">
                            <img src={fileUrl} alt="attachment" className="w-16 h-16 object-cover rounded border hover:scale-110 transition" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                  {inq.response ? (
                    <div className="mt-3">
                      <span className="font-semibold text-green-700">{t("inquiries_response_label")}:</span>
                      <span className="ml-2 text-gray-800">{inq.response}</span>
                    </div>
                  ) : (
                    <div className="mt-3 text-yellow-600">{t("inquiries_no_response")}</div>
                  )}
                </div>
                <div className="flex flex-row gap-3 md:flex-col md:ml-4 md:items-end items-center mt-4 md:mt-0">
                  {editId === inq.id ? (
                    <>
                      <button
                        onClick={() => saveEdit(inq.id)}
                        className="p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition shadow"
                        disabled={deletingId === inq.id}
                        title={t("inquiries_save_btn")}
                      >
                        <FaSave />
                      </button>
                      <button
                        onClick={() => { setEditId(null); setEditMessage(""); }}
                        className="p-2 bg-gray-300 text-gray-800 rounded-full hover:bg-gray-400 transition shadow"
                        disabled={deletingId === inq.id}
                        title={t("inquiries_cancel_btn")}
                      >
                        <FaTimes />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => startEdit(inq)}
                        className="p-2 bg-yellow-400 text-gray-900 rounded-full hover:bg-yellow-500 transition shadow"
                        disabled={deletingId === inq.id}
                        title={t("inquiries_edit_btn")}
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(inq.id)}
                        className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition shadow"
                        disabled={deletingId === inq.id}
                        title={t("inquiries_delete_btn")}
                      >
                        {deletingId === inq.id ? <span className="animate-pulse"><FaTrash /></span> : <FaTrash />}
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicalConsultation;

