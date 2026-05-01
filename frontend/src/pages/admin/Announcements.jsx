import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import { getImageUrl } from "../../utils/imageUtils";

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
    imageFile: null
  });
  const [imagePreview, setImagePreview] = useState("");
  const [uploadMethod, setUploadMethod] = useState("url"); // "url" or "file"
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const openImageModal = (announcement) => {
    setSelectedImage({
      url: getImageUrl(announcement.imageUrl),
      title: announcement.title,
      description: announcement.description
    });
    setShowImageModal(true);
  };

  const fetchAnnouncements = async () => {
    try {
      const res = await api.get("/admin/announcements");
      setAnnouncements(res.data);
    } catch (err) {
      console.error("Error fetching announcements:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setShowImageModal(false);
      }
    };

    if (showImageModal) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [showImageModal]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, imageFile: file, imageUrl: "" });
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = formData.imageUrl;
      
      // If file is selected, upload it first
      if (formData.imageFile) {
        const formDataUpload = new FormData();
        formDataUpload.append('image', formData.imageFile);
        
        const uploadRes = await api.post('/admin/upload-image', formDataUpload, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        imageUrl = uploadRes.data.imageUrl;
      }

      await api.post("/admin/announcements", {
        title: formData.title,
        description: formData.description,
        imageUrl: imageUrl
      });
      
      setFormData({ title: "", description: "", imageUrl: "", imageFile: null });
      setImagePreview("");
      setUploadMethod("url");
      setShowCreateForm(false);
      fetchAnnouncements();
    } catch (err) {
      console.error("Error creating announcement:", err);
      alert("Failed to create announcement");
    }
  };

  const toggleVisibility = async (id, visible) => {
    try {
      await api.patch(`/admin/announcements/${id}/visibility`, { visible });
      fetchAnnouncements();
    } catch (err) {
      console.error("Error updating visibility:", err);
      alert("Failed to update visibility");
    }
  };

  const deleteAnnouncement = async (id) => {
    if (window.confirm("Are you sure you want to delete this announcement?")) {
      try {
        await api.delete(`/admin/announcements/${id}`);
        fetchAnnouncements();
      } catch (err) {
        console.error("Error deleting announcement:", err);
        alert("Failed to delete announcement");
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p className="text-slate-400">Loading announcements...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <Link to="/admin" className="text-slate-400 hover:text-white text-sm mb-2 inline-block">
              ← Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-white">Announcements</h1>
            <p className="text-slate-400">Manage platform announcements and notices</p>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-400 text-white rounded-lg font-medium transition-colors"
          >
            + Create Announcement
          </button>
        </div>

        {/* Create Form Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-md w-full">
              <h3 className="text-xl font-semibold mb-4">Create Announcement</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm text-slate-300 mb-2 block">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/70"
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-300 mb-2 block">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    rows={4}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/70"
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-300 mb-2 block">Image</label>
                  
                  {/* Upload Method Toggle */}
                  <div className="flex gap-2 mb-3">
                    <button
                      type="button"
                      onClick={() => {
                        setUploadMethod("url");
                        setFormData({ ...formData, imageFile: null });
                        setImagePreview("");
                      }}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                        uploadMethod === "url"
                          ? "bg-blue-500 text-white"
                          : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                      }`}
                    >
                      🔗 URL
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setUploadMethod("file");
                        setFormData({ ...formData, imageUrl: "" });
                      }}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                        uploadMethod === "file"
                          ? "bg-blue-500 text-white"
                          : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                      }`}
                    >
                      📁 Upload File
                    </button>
                  </div>

                  {/* URL Input */}
                  {uploadMethod === "url" && (
                    <input
                      type="url"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      placeholder="https://example.com/image.jpg"
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/70"
                    />
                  )}

                  {/* File Upload */}
                  {uploadMethod === "file" && (
                    <div className="space-y-3">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-blue-500 file:text-white file:cursor-pointer hover:file:bg-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/70"
                      />
                      
                      {/* Image Preview */}
                      {imagePreview && (
                        <div className="mt-3">
                          <p className="text-xs text-slate-400 mb-2">Preview:</p>
                          <img 
                            src={imagePreview} 
                            alt="Preview" 
                            className="max-w-full h-32 object-cover rounded-lg border border-slate-700"
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* URL Preview */}
                  {uploadMethod === "url" && formData.imageUrl && (
                    <div className="mt-3">
                      <p className="text-xs text-slate-400 mb-2">Preview:</p>
                      <img 
                        src={formData.imageUrl} 
                        alt="Preview" 
                        className="max-w-full h-32 object-cover rounded-lg border border-slate-700"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-500 hover:bg-blue-400 text-white py-2 rounded-lg font-medium transition-colors"
                  >
                    Create
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="px-4 bg-slate-700 hover:bg-slate-600 text-slate-300 py-2 rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Announcements List */}
        <div className="space-y-4">
          {announcements.map((announcement) => (
            <div key={announcement._id} className="bg-slate-900 border border-slate-700 rounded-xl p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-white">{announcement.title}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      announcement.visible 
                        ? "bg-green-500/20 text-green-300" 
                        : "bg-red-500/20 text-red-300"
                    }`}>
                      {announcement.visible ? "Visible" : "Hidden"}
                    </span>
                  </div>
                  
                  <p className="text-slate-300 mb-3 leading-relaxed">
                    {announcement.description}
                  </p>
                  
                  {announcement.imageUrl && (
                    <div className="mb-3">
                      <img 
                        src={getImageUrl(announcement.imageUrl)} 
                        alt={announcement.title}
                        className="max-w-xs rounded-lg border border-slate-700 cursor-pointer hover:border-blue-400 transition-colors"
                        onClick={() => openImageModal(announcement)}
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  
                  <div className="flex items-center gap-4 text-sm text-slate-400">
                    <span>👤 By: {announcement.createdBy?.name}</span>
                    <span>📅 {new Date(announcement.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => toggleVisibility(announcement._id, !announcement.visible)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      announcement.visible
                        ? "bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500/30"
                        : "bg-green-500/20 text-green-300 hover:bg-green-500/30"
                    }`}
                  >
                    {announcement.visible ? "Hide" : "Show"}
                  </button>
                  <button
                    onClick={() => deleteAnnouncement(announcement._id)}
                    className="px-3 py-2 bg-red-500/20 text-red-300 hover:bg-red-500/30 rounded-lg text-sm font-medium transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {announcements.length === 0 && (
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-8 text-center">
            <p className="text-slate-400 mb-4">No announcements created yet</p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-400 text-white rounded-lg font-medium transition-colors"
            >
              Create Your First Announcement
            </button>
          </div>
        )}
      </div>

      {/* Image Modal */}
      {showImageModal && selectedImage && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowImageModal(false)}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full" onClick={(e) => e.stopPropagation()}>
            {/* Close Button */}
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 text-xl font-bold z-10"
            >
              ✕ Close
            </button>
            
            {/* Image Container */}
            <div className="bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden">
              <img 
                src={selectedImage.url}
                alt={selectedImage.title}
                className="w-full h-auto max-h-[70vh] object-contain"
                onError={(e) => {
                  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzMzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBmb3VuZDwvdGV4dD48L3N2Zz4=';
                }}
              />
              
              {/* Image Info */}
              <div className="p-4 border-t border-slate-700">
                <h3 className="text-lg font-semibold text-white mb-2">{selectedImage.title}</h3>
                <p className="text-slate-300 text-sm">{selectedImage.description}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Announcements;