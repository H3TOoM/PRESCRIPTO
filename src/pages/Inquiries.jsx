import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import inquiryService from "../services/inquiryService";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import { FaEdit, FaTrash, FaSave, FaTimes, FaPlus, FaThumbsUp, FaThumbsDown, FaReply, FaUserMd, FaCalendarAlt, FaStar } from "react-icons/fa";

const MedicalConsultation = () => {
  const [message, setMessage] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inquiries, setInquiries] = useState([]);
  const [loadingInquiries, setLoadingInquiries] = useState(true);
  const { token, user } = useContext(AppContext);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [refresh, setRefresh] = useState(0);
  const [editId, setEditId] = useState(null);
  const [editMessage, setEditMessage] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [ratingId, setRatingId] = useState(null);

  // Available specialties - Only those supported by the API
  const specialties = [
    "GeneralPhysician",
    "Gynecologist",
    "Dermatologist", 
    "Pediatrician",
    "Neurologist",
    "Gastroenterologist"
  ];

  // Specialty mapping for display names
  const getSpecialtyDisplayName = (specialty) => {
    const specialtyMap = {
      "GeneralPhysician": "General Physician",
      "Gynecologist": "Gynecologist",
      "Dermatologist": "Dermatologist",
      "Pediatrician": "Pediatrician",
      "Neurologist": "Neurologist",
      "Gastroenterologist": "Gastroenterologist"
    };
    return specialtyMap[specialty] || specialty;
  };

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

    if (!specialty) {
      Swal.fire({ title: "Specialty Required", text: "Please select a specialty for your inquiry", icon: "warning" });
      return;
    }

    setLoading(true);

    try {
      const consultationData = {
        message: message,
        specialty: specialty,
        files: files
      };

      await inquiryService.submitConsultation(consultationData);

      Swal.fire({ title: t("inquiries_success_title"), text: t("inquiries_success_text"), icon: "success" });
      
      setMessage('');
      setSpecialty('');
      setFiles([]);
      setShowAddForm(false);
      setRefresh(r => r + 1);
    } catch (error) {
      console.error('Error submitting consultation:', error);
      const errorMessage = error.response?.data?.message || t("inquiries_failed_submit_text");
      Swal.fire({ title: t("inquiries_failed_submit_title"), text: errorMessage, icon: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm(t("inquiries_confirm_delete"));
    if (!confirm) return;
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

  // NEW: Handle rating
  const handleRating = async (inquiryId, isLike) => {
    if (ratingId === inquiryId) return; // Prevent double-clicking
    
    setRatingId(inquiryId);
    try {
      const result = await inquiryService.rateInquiry(inquiryId, isLike);
      
      // Update the inquiry with new rating counts
      setInquiries(prev => prev.map(inq => 
        inq.id === inquiryId 
          ? { ...inq, likes: result.likes, dislikes: result.dislikes, userRating: isLike }
          : inq
      ));
      
      Swal.fire({
        title: "Rating Submitted",
        text: isLike ? "Thank you for your positive feedback!" : "Thank you for your feedback!",
        icon: "success",
        timer: 2000
      });
    } catch (error) {
      Swal.fire({ title: "Rating Failed", text: "Failed to submit rating", icon: "error" });
    } finally {
      setRatingId(null);
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
              {/* Specialty Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Specialty *
                </label>
                <select
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#5F6FFF] shadow-inner text-gray-900"
                  required
                  disabled={loading}
                >
                  <option value="">Select a specialty</option>
                  {specialties.map((spec) => (
                    <option key={spec} value={spec}>{getSpecialtyDisplayName(spec)}</option>
                  ))}
                </select>
              </div>
              
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
              <div key={inq.id} className="border border-gray-300 rounded-2xl p-6 bg-white shadow-lg hover:shadow-2xl transition">
                {/* Inquiry Header */}
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                      {getSpecialtyDisplayName(inq.specialty)}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      inq.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {inq.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <FaCalendarAlt />
                    {new Date(inq.createdAt).toLocaleDateString()}
                  </div>
                </div>

                {/* Inquiry Content */}
                <div className="mb-4">
                  <div className="flex items-start gap-2 mb-3">
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
                  
                  {/* Patient Files */}
                  {inq.files && inq.files.length > 0 && (
                    <div className="mt-4">
                      <span className="font-semibold text-gray-800 block mb-2">{t("inquiries_attachments_label")}:</span>
                      <div className="flex gap-2 flex-wrap">
                        {inq.files.map((file, idx) => (
                          <a key={idx} href={`https://authappapi.runasp.net/${file.filePath}`} target="_blank" rel="noopener noreferrer">
                            <img src={`https://authappapi.runasp.net/${file.filePath}`} alt="attachment" className="w-16 h-16 object-cover rounded border hover:scale-110 transition" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Doctor Response */}
                {inq.doctorResponse && (
                  <div className="mb-4 p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-2 mb-2">
                      <FaUserMd className="text-green-600" />
                      <span className="font-semibold text-green-800">Doctor Response:</span>
                      {inq.respondingDoctorName && (
                        <span className="text-sm text-green-600">by {inq.respondingDoctorName}</span>
                      )}
                    </div>
                    <p className="text-gray-800 mb-2">{inq.doctorResponse}</p>
                    {inq.respondedAt && (
                      <span className="text-xs text-green-600">
                        Responded on {new Date(inq.respondedAt).toLocaleDateString()}
                      </span>
                    )}
                    
                    {/* Doctor Response Files */}
                    {inq.responseFiles && inq.responseFiles.length > 0 && (
                      <div className="mt-3">
                        <span className="font-semibold text-green-800 block mb-2">Doctor's Attachments:</span>
                        <div className="flex gap-2 flex-wrap">
                          {inq.responseFiles.map((file, idx) => (
                            <a key={idx} href={`https://authappapi.runasp.net/${file.filePath}`} target="_blank" rel="noopener noreferrer">
                              <img src={`https://authappapi.runasp.net/${file.filePath}`} alt="doctor attachment" className="w-16 h-16 object-cover rounded border hover:scale-110 transition" />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Rating Section */}
                {inq.status === 'Answered' && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-medium text-gray-700">Rate this response:</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleRating(inq.id, true)}
                            disabled={ratingId === inq.id}
                            className={`p-2 rounded-full transition ${
                              inq.userRating === true 
                                ? 'bg-green-500 text-white' 
                                : 'bg-gray-200 text-gray-600 hover:bg-green-100'
                            }`}
                            title="Like"
                          >
                            <FaThumbsUp />
                          </button>
                          <span className="text-sm text-gray-600">{inq.likes || 0}</span>
                          <button
                            onClick={() => handleRating(inq.id, false)}
                            disabled={ratingId === inq.id}
                            className={`p-2 rounded-full transition ${
                              inq.userRating === false 
                                ? 'bg-red-500 text-white' 
                                : 'bg-gray-200 text-gray-600 hover:bg-red-100'
                            }`}
                            title="Dislike"
                          >
                            <FaThumbsDown />
                          </button>
                          <span className="text-sm text-gray-600">{inq.dislikes || 0}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-row gap-3 items-center justify-end pt-4 border-t border-gray-200">
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

