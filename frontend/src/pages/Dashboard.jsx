import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getImageUrl } from "../utils/imageUtils";

const Dashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [mySessions, setMySessions] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [feedbackForm, setFeedbackForm] = useState({ rating: 5, comment: "" });
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

  const fetchData = async () => {
    const [bRes, sRes, aRes] = await Promise.all([
      api.get("/bookings/me"),
      api.get("/sessions/mine"),
      api.get("/announcements").catch(() => ({ data: [] })) // Use public announcements route
    ]);
    setBookings(bRes.data);
    setMySessions(sRes.data);
    setAnnouncements(aRes.data); // Already filtered to visible announcements
  };

  useEffect(() => {
    fetchData();
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

  const updateStatus = async (id, status) => {
    await api.patch(`/bookings/${id}/status`, { status });
    fetchData();
  };

  const deleteBooking = async (id, courseName) => {
    if (window.confirm(`Are you sure you want to cancel enrollment in "${courseName}"?`)) {
      try {
        await api.delete(`/bookings/${id}`);
        alert("Course enrollment cancelled successfully!");
        fetchData();
      } catch (err) {
        console.error("Delete booking error:", err);
        alert(err.response?.data?.message || "Failed to cancel enrollment");
      }
    }
  };

  const openFeedbackModal = (booking) => {
    setSelectedBooking(booking);
    setFeedbackForm({
      rating: booking.feedback?.rating || 5,
      comment: booking.feedback?.comment || ""
    });
    setShowFeedbackModal(true);
  };

  const submitFeedback = async () => {
    try {
      await api.patch(`/bookings/${selectedBooking._id}/feedback`, feedbackForm);
      alert("Feedback submitted successfully!");
      setShowFeedbackModal(false);
      fetchData();
    } catch (err) {
      console.error("Submit feedback error:", err);
      alert(err.response?.data?.message || "Failed to submit feedback");
    }
  };

  // Separate bookings by role
  const userId = user?.id || user?._id;
  const myBookingsAsTeacher = bookings.filter(b => b.mentor?._id === userId);
  const myBookingsAsStudent = bookings.filter(b => b.learner?._id === userId);

  // Render Teacher Dashboard
  if (user?.role === "teacher") {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-slate-950 text-white">
        <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
          
          {/* Announcements Section */}
          {announcements.length > 0 && (
            <section className="space-y-3">
              <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
                📢 Announcements
              </h3>
              <div className="space-y-3">
                {announcements.slice(0, 3).map((announcement) => (
                  <div key={announcement._id} className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-blue-300 mb-1">{announcement.title}</h4>
                        <p className="text-xs text-slate-300">{announcement.description}</p>
                        <p className="text-xs text-slate-500 mt-2">
                          {new Date(announcement.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      {announcement.imageUrl && (
                        <div className="flex-shrink-0">
                          <img 
                            src={getImageUrl(announcement.imageUrl)} 
                            alt={announcement.title}
                            className="w-16 h-16 object-cover rounded-lg border border-slate-600 cursor-pointer hover:border-blue-400 transition-colors"
                            onClick={() => openImageModal(announcement)}
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs text-emerald-300/80 uppercase tracking-[0.25em]">
                Teacher Dashboard
              </p>
              <h2 className="text-2xl sm:text-3xl font-semibold">
                Welcome back, {user.name}
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
                Manage your courses and track student enrollments.
              </p>
            </div>
            <Link
              to="/create-session"
              className="text-xs px-3 py-2 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-medium"
            >
              + Upload Course
            </Link>
          </div>

          {/* Teacher's Courses */}
          <section className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-100">
              My Courses
            </h3>
            {mySessions.length === 0 ? (
              <div className="bg-slate-900/80 border border-slate-700 rounded-xl p-6 text-center">
                <p className="text-xs text-slate-400">
                  You haven&apos;t uploaded any courses yet.
                </p>
                <Link
                  to="/create-session"
                  className="inline-block mt-3 text-xs px-4 py-2 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-medium"
                >
                  Upload Your First Course
                </Link>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-3">
                {mySessions.map((s) => {
                  const courseBookings = myBookingsAsTeacher.filter(
                    b => b.session?._id === s._id
                  );
                  const enrolledStudents = courseBookings.length;
                  
                  return (
                    <div
                      key={s._id}
                      className="bg-slate-900/80 border border-slate-700 rounded-xl p-4 shadow hover:border-emerald-500/50 transition"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-sm font-medium">{s.title}</p>
                          <p className="text-[11px] text-slate-400 mt-1">
                            {s.category} • {s.durationMinutes} mins
                          </p>
                        </div>
                        <span className="text-xs px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-300">
                          {enrolledStudents} {enrolledStudents === 1 ? 'student' : 'students'}
                        </span>
                      </div>
                      {s.preferredTime && (
                        <p className="text-[11px] text-slate-500 mt-2">
                          Preferred: {s.preferredTime}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Students Who Booked */}
          <section className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-100">
              Student Enrollments
            </h3>
            {myBookingsAsTeacher.length === 0 ? (
              <p className="text-xs text-slate-400">
                No students have enrolled yet.
              </p>
            ) : (
              <div className="space-y-3">
                {myBookingsAsTeacher.map((b) => (
                  <div
                    key={b._id}
                    className="bg-slate-900/80 border border-slate-700 rounded-xl p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3 shadow"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {b.session?.title || "Course"}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Student: {b.learner?.name}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className={`text-[11px] px-2 py-0.5 rounded-full uppercase font-medium ${
                          b.status === 'completed' ? 'bg-green-500/20 text-green-300' :
                          b.status === 'accepted' ? 'bg-blue-500/20 text-blue-300' :
                          b.status === 'pending' ? 'bg-yellow-500/20 text-yellow-300' :
                          'bg-red-500/20 text-red-300'
                        }`}>
                          {b.status}
                        </span>
                        {b.feedback?.rating && (
                          <span className="text-[11px] px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-300 border border-yellow-500/40">
                            ⭐ {b.feedback.rating}/5
                          </span>
                        )}
                      </div>
                      {b.feedback?.comment && (
                        <div className="mt-2 p-2 bg-slate-800/50 rounded-lg border border-slate-700">
                          <p className="text-[11px] text-slate-300 italic">
                            &quot;{b.feedback.comment}&quot;
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2 text-[11px]">
                      {b.status === "pending" && (
                        <>
                          <button
                            onClick={() => updateStatus(b._id, "accepted")}
                            className="px-3 py-1 rounded-full bg-emerald-500 text-slate-950 font-medium hover:bg-emerald-400"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => updateStatus(b._id, "rejected")}
                            className="px-3 py-1 rounded-full bg-red-500/90 text-white hover:bg-red-500"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {b.status === "accepted" && (
                        <button
                          onClick={() => updateStatus(b._id, "completed")}
                          className="px-3 py-1 rounded-full bg-indigo-500 text-white hover:bg-indigo-400"
                        >
                          Mark Completed
                        </button>
                      )}
                      <Link
                        to={`/chat/${b._id}`}
                        className="px-3 py-1 rounded-full border border-slate-600 text-slate-200 hover:border-emerald-400"
                      >
                        Chat
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    );
  }

  // Render Student Dashboard
  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-950 text-white">
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        
        {/* Announcements Section */}
        {announcements.length > 0 && (
          <section className="space-y-3">
            <h3 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              📢 Announcements
            </h3>
            <div className="space-y-3">
              {announcements.slice(0, 3).map((announcement) => (
                <div key={announcement._id} className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-blue-300 mb-1">{announcement.title}</h4>
                      <p className="text-xs text-slate-300">{announcement.description}</p>
                      <p className="text-xs text-slate-500 mt-2">
                        {new Date(announcement.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    {announcement.imageUrl && (
                      <div className="flex-shrink-0">
                        <img 
                          src={getImageUrl(announcement.imageUrl)} 
                          alt={announcement.title}
                          className="w-16 h-16 object-cover rounded-lg border border-slate-600 cursor-pointer hover:border-blue-400 transition-colors"
                          onClick={() => openImageModal(announcement)}
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs text-blue-300/80 uppercase tracking-[0.25em]">
              Student Dashboard
            </p>
            <h2 className="text-2xl sm:text-3xl font-semibold">
              Welcome back, {user?.name}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
              Track your enrolled courses and learning progress.
            </p>
          </div>
          <Link
            to="/sessions"
            className="text-xs px-3 py-2 rounded-full bg-blue-500 hover:bg-blue-400 text-white font-medium"
          >
            Browse Courses
          </Link>
        </div>

        {/* Enrolled Courses */}
        <section className="space-y-3">
          <h3 className="text-sm font-semibold text-slate-100">
            My Enrolled Courses
          </h3>
          {myBookingsAsStudent.length === 0 ? (
            <div className="bg-slate-900/80 border border-slate-700 rounded-xl p-6 text-center">
              <p className="text-xs text-slate-400">
                You haven&apos;t enrolled in any courses yet.
              </p>
              <Link
                to="/sessions"
                className="inline-block mt-3 text-xs px-4 py-2 rounded-full bg-blue-500 hover:bg-blue-400 text-white font-medium"
              >
                Explore Courses
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {myBookingsAsStudent.map((b) => (
                <div
                  key={b._id}
                  className="bg-slate-900/80 border border-slate-700 rounded-xl p-4 shadow hover:border-blue-500/50 transition"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {b.session?.title || "Course"}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Teacher: {b.mentor?.name}
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className={`text-[11px] px-2 py-0.5 rounded-full uppercase font-medium ${
                          b.status === 'completed' ? 'bg-green-500/20 text-green-300' :
                          b.status === 'accepted' ? 'bg-blue-500/20 text-blue-300' :
                          b.status === 'pending' ? 'bg-yellow-500/20 text-yellow-300' :
                          'bg-red-500/20 text-red-300'
                        }`}>
                          {b.status === 'completed' ? '✓ Completed' :
                           b.status === 'accepted' ? 'In Progress' :
                           b.status === 'pending' ? 'Pending Approval' :
                           'Rejected'}
                        </span>
                        {b.status === 'completed' && !b.feedback?.rating && (
                          <span className="text-[11px] px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-300 border border-yellow-500/40 animate-pulse">
                            ⚠️ Feedback Required
                          </span>
                        )}
                        {b.status === 'completed' && b.feedback?.rating && (
                          <span className="text-[11px] text-green-400">
                            🎉 Course Completed!
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 text-[11px]">
                      <Link
                        to={`/sessions/${b.session?._id}`}
                        className="px-3 py-1 rounded-full border border-slate-600 text-slate-200 hover:border-blue-400"
                      >
                        View Course
                      </Link>
                      {b.status !== 'completed' && (
                        <Link
                          to={`/chat/${b._id}`}
                          className="px-3 py-1 rounded-full bg-blue-500 text-white hover:bg-blue-400"
                        >
                          Chat with Teacher
                        </Link>
                      )}
                      {b.status === 'completed' && (
                        <button
                          onClick={() => openFeedbackModal(b)}
                          className={`px-3 py-1 rounded-full ${
                            b.feedback?.rating 
                              ? 'bg-green-500/20 text-green-300 border border-green-500/40' 
                              : 'bg-yellow-500 text-slate-950 hover:bg-yellow-400'
                          }`}
                        >
                          {b.feedback?.rating ? '✓ Feedback Given' : 'Give Feedback'}
                        </button>
                      )}
                      {b.status !== 'completed' && (
                        <button
                          onClick={() => deleteBooking(b._id, b.session?.title)}
                          className="px-3 py-1 rounded-full bg-red-500/90 text-white hover:bg-red-500"
                        >
                          Cancel Enrollment
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Learning Stats */}
        <section className="grid md:grid-cols-3 gap-3">
          <div className="bg-slate-900/80 border border-slate-700 rounded-xl p-4">
            <p className="text-xs text-slate-400">Total Enrolled</p>
            <p className="text-2xl font-semibold mt-1">{myBookingsAsStudent.length}</p>
          </div>
          <div className="bg-slate-900/80 border border-slate-700 rounded-xl p-4">
            <p className="text-xs text-slate-400">In Progress</p>
            <p className="text-2xl font-semibold mt-1 text-blue-400">
              {myBookingsAsStudent.filter(b => b.status === 'accepted').length}
            </p>
          </div>
          <div className="bg-slate-900/80 border border-slate-700 rounded-xl p-4">
            <p className="text-xs text-slate-400">Completed</p>
            <p className="text-2xl font-semibold mt-1 text-green-400">
              {myBookingsAsStudent.filter(b => b.status === 'completed').length}
            </p>
          </div>
        </section>

        {/* Feedback Modal */}
        {showFeedbackModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-md w-full shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Give Feedback</h3>
                <span className="text-xs px-2 py-1 rounded-full bg-red-500/20 text-red-300 border border-red-500/40">
                  Required
                </span>
              </div>
              <p className="text-sm text-slate-400 mb-2">
                Course: <span className="text-white font-medium">{selectedBooking?.session?.title}</span>
              </p>
              <p className="text-sm text-slate-400 mb-4">
                Teacher: <span className="text-white font-medium">{selectedBooking?.mentor?.name}</span>
              </p>

              <div className="space-y-4">
                <div>
                  <label className="text-sm text-slate-300 mb-2 block">
                    Rating <span className="text-red-400">*</span>
                  </label>
                  <div className="flex gap-2 justify-center p-3 bg-slate-800/50 rounded-lg">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setFeedbackForm({ ...feedbackForm, rating: star })}
                        className={`text-3xl transition-all ${
                          star <= feedbackForm.rating ? 'text-yellow-400 scale-110' : 'text-slate-600'
                        } hover:scale-125 active:scale-95`}
                      >
                        ⭐
                      </button>
                    ))}
                  </div>
                  <p className="text-sm text-center mt-2 font-medium text-yellow-400">
                    {feedbackForm.rating === 5 ? '⭐ Excellent!' :
                     feedbackForm.rating === 4 ? '⭐ Very Good' :
                     feedbackForm.rating === 3 ? '⭐ Good' :
                     feedbackForm.rating === 2 ? '⭐ Fair' : '⭐ Needs Improvement'}
                  </p>
                </div>

                <div>
                  <label className="text-sm text-slate-300 mb-2 block">Comment (Optional)</label>
                  <textarea
                    value={feedbackForm.comment}
                    onChange={(e) => setFeedbackForm({ ...feedbackForm, comment: e.target.value })}
                    placeholder="Share your experience with this course..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/70 min-h-[100px]"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={submitFeedback}
                    disabled={!feedbackForm.rating}
                    className={`flex-1 text-white text-sm font-medium py-2.5 rounded-lg transition ${
                      feedbackForm.rating 
                        ? 'bg-blue-500 hover:bg-blue-400 cursor-pointer' 
                        : 'bg-slate-700 cursor-not-allowed opacity-50'
                    }`}
                  >
                    Submit Feedback
                  </button>
                  <button
                    onClick={() => setShowFeedbackModal(false)}
                    className="px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium py-2.5 rounded-lg transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
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

export default Dashboard;
