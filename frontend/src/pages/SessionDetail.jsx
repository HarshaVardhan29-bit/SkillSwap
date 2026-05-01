import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const SessionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userBooking, setUserBooking] = useState(null);
  const [feedbackForm, setFeedbackForm] = useState({ rating: 5, comment: "" });
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await api.get(`/sessions/${id}`);
        setSession(res.data);
        
        // Check if user is enrolled in this course
        if (user) {
          const bookingsRes = await api.get("/bookings/me");
          const booking = bookingsRes.data.find(b => 
            b.session?._id === id && (b.learner?._id === user.id || b.learner?._id === user._id)
          );
          setUserBooking(booking);
          
          if (booking?.feedback) {
            setFeedbackForm({
              rating: booking.feedback.rating || 5,
              comment: booking.feedback.comment || ""
            });
          }
        }
      } catch (err) {
        console.error("Error fetching session:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSession();
  }, [id, user]);

  const handleBookSession = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    const userId = user.id || user._id;
    
    // Prevent teachers from booking their own courses
    if (session.mentor?._id === userId) {
      alert("You cannot book your own course!");
      return;
    }

    try {
      await api.post("/bookings", {
        sessionId: session._id,
        scheduledTime: new Date().toISOString()
      });
      alert("Course enrolled successfully! Check your dashboard.");
      window.location.reload(); // Refresh to show enrolled content
    } catch (err) {
      console.error("Booking error:", err);
      alert(err.response?.data?.message || "Failed to enroll in course. You may have already enrolled in this course.");
    }
  };

  const submitFeedback = async () => {
    try {
      await api.patch(`/bookings/${userBooking._id}/feedback`, feedbackForm);
      alert("Feedback submitted successfully!");
      setShowFeedbackForm(false);
      // Refresh booking data
      const bookingsRes = await api.get("/bookings/me");
      const booking = bookingsRes.data.find(b => 
        b.session?._id === id && (b.learner?._id === user.id || b.learner?._id === user._id)
      );
      setUserBooking(booking);
    } catch (err) {
      console.error("Submit feedback error:", err);
      alert(err.response?.data?.message || "Failed to submit feedback");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p className="text-slate-400">Loading session details...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p className="text-slate-400">Session not found</p>
      </div>
    );
  }

  const mentorName = session.mentor?.name || "Mentor";
  const mentorInitials = mentorName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen bg-slate-950 text-white px-4 py-10">
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <button
          onClick={() => navigate("/sessions")}
          className="mb-6 px-4 py-2 rounded-full border border-slate-600 text-sm text-slate-100 hover:border-emerald-400 hover:text-white bg-slate-900/80 backdrop-blur hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-500/20 transition-all duration-200"
        >
          ← Back to Sessions
        </button>

        {/* Session Card */}
        <div className="relative bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 border border-white/10 rounded-3xl p-8 shadow-2xl backdrop-blur-xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-50 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/10 via-transparent to-transparent pointer-events-none" />
          
          <div className="relative z-10">
            {/* Category badge */}
            <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-medium mb-4">
              {session.category}
            </span>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
              {session.title}
            </h1>

            {/* Duration & Time */}
            <div className="flex flex-wrap gap-3 mb-6 text-sm text-slate-300">
              <span className="px-3 py-1.5 rounded-full bg-emerald-500/20 backdrop-blur border border-emerald-400/30 text-emerald-300 font-medium">
                💰 FREE
              </span>
              <span className="px-3 py-1.5 rounded-full bg-slate-800/80 backdrop-blur border border-white/10">
                ⏱️ {session.durationMinutes} minutes
              </span>
              {session.preferredTime && (
                <span className="px-3 py-1.5 rounded-full bg-slate-800/80 backdrop-blur border border-white/10">
                  📅 {session.preferredTime}
                </span>
              )}
              <span className="px-3 py-1.5 rounded-full bg-slate-800/80 backdrop-blur border border-white/10">
                🌐 Online
              </span>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-3 text-white">About this session</h2>
              <p className="text-slate-300 leading-relaxed text-base">
                {session.description}
              </p>
            </div>

            {/* What you'll learn */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-3 text-white">What you'll learn</h2>
              <ul className="space-y-2 text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-1">✓</span>
                  <span>Hands-on practical experience with real-world examples</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-1">✓</span>
                  <span>Best practices and industry standards</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-1">✓</span>
                  <span>Personalized feedback and guidance</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-400 mt-1">✓</span>
                  <span>Q&A session to address your specific questions</span>
                </li>
              </ul>
            </div>

            {/* Mentor Info */}
            <div className="mb-8 p-5 rounded-2xl bg-slate-800/50 backdrop-blur border border-white/10">
              <h2 className="text-xl font-semibold mb-4 text-white">Your Mentor</h2>
              <div className="flex items-start gap-4">
                <div className="h-16 w-16 rounded-full bg-gradient-to-tr from-emerald-400 via-sky-400 to-blue-500 flex items-center justify-center text-lg font-semibold shadow-lg shadow-emerald-500/30 flex-shrink-0">
                  {mentorInitials}
                </div>
                <div>
                  <p className="text-lg font-semibold text-white">{mentorName}</p>
                  <p className="text-sm text-slate-400 mb-2">SkillSwap Mentor</p>
                  {session.mentor?.bio && (
                    <p className="text-sm text-slate-300">{session.mentor.bio}</p>
                  )}
                  {session.mentor?.skills && session.mentor.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {session.mentor.skills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 rounded-full bg-slate-700/50 text-xs text-slate-300 border border-white/10"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Book button */}
            {!user ? (
              <button
                onClick={handleBookSession}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-lg font-semibold text-slate-950 shadow-2xl shadow-emerald-500/40 hover:-translate-y-1 hover:shadow-emerald-500/60 transition-all duration-300"
              >
                Login to Book This Free Course
              </button>
            ) : (session.mentor?._id === user.id || session.mentor?._id === user._id) ? (
              <div className="w-full py-4 rounded-xl bg-slate-700/50 border border-slate-600 text-center text-slate-400">
                This is your course
              </div>
            ) : !userBooking ? (
              <button
                onClick={handleBookSession}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 hover:to-emerald-300 text-lg font-semibold text-slate-950 shadow-2xl shadow-emerald-500/40 hover:-translate-y-1 hover:shadow-emerald-500/60 transition-all duration-300"
              >
                Enroll in This Free Course
              </button>
            ) : (
              <div className="w-full py-4 rounded-xl bg-blue-500/20 border border-blue-400/30 text-center">
                <p className="text-blue-300 font-medium">✓ You are enrolled in this course</p>
                <p className="text-xs text-slate-400 mt-1">Status: {userBooking.status}</p>
              </div>
            )}
          </div>
        </div>

        {/* Course Content - Only visible to enrolled students */}
        {userBooking && userBooking.status !== 'rejected' && (
          <div className="mt-8 space-y-6">
            {/* Course Videos Section */}
            <div className="bg-slate-900/80 border border-slate-700 rounded-2xl p-6 shadow-xl">
              <h2 className="text-2xl font-semibold mb-4 text-white">📹 Course Content</h2>
              <p className="text-sm text-slate-400 mb-6">
                Access all course materials and video lectures below
              </p>

              {/* Video Lessons */}
              <div className="space-y-4">
                {/* Lesson 1 */}
                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-300 font-semibold">
                      1
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-2">Introduction to {session.title}</h3>
                      <p className="text-sm text-slate-400 mb-3">
                        Get started with the fundamentals and overview of what you'll learn
                      </p>
                      <div className="aspect-video bg-slate-950 rounded-lg overflow-hidden border border-slate-700">
                        <iframe
                          className="w-full h-full"
                          src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                          title="Course Introduction"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      </div>
                      <div className="flex items-center gap-4 mt-3 text-xs text-slate-400">
                        <span>⏱️ 15 minutes</span>
                        <span>📄 Includes notes</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Lesson 2 */}
                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-300 font-semibold">
                      2
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-2">Core Concepts & Practical Examples</h3>
                      <p className="text-sm text-slate-400 mb-3">
                        Deep dive into the main topics with hands-on demonstrations
                      </p>
                      <div className="aspect-video bg-slate-950 rounded-lg overflow-hidden border border-slate-700">
                        <iframe
                          className="w-full h-full"
                          src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                          title="Core Concepts"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      </div>
                      <div className="flex items-center gap-4 mt-3 text-xs text-slate-400">
                        <span>⏱️ 25 minutes</span>
                        <span>📄 Includes code examples</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Lesson 3 */}
                <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-300 font-semibold">
                      3
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-2">Advanced Techniques & Best Practices</h3>
                      <p className="text-sm text-slate-400 mb-3">
                        Learn professional tips and industry best practices
                      </p>
                      <div className="aspect-video bg-slate-950 rounded-lg overflow-hidden border border-slate-700">
                        <iframe
                          className="w-full h-full"
                          src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                          title="Advanced Techniques"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      </div>
                      <div className="flex items-center gap-4 mt-3 text-xs text-slate-400">
                        <span>⏱️ 20 minutes</span>
                        <span>📄 Includes resources</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Resources */}
              <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
                <h3 className="text-sm font-semibold text-blue-300 mb-2">📚 Additional Resources</h3>
                <ul className="space-y-2 text-sm text-slate-300">
                  <li className="flex items-center gap-2">
                    <span className="text-blue-400">→</span>
                    <a href="#" className="hover:text-blue-300 underline">Course slides and presentation</a>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-blue-400">→</span>
                    <a href="#" className="hover:text-blue-300 underline">Code examples and projects</a>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-blue-400">→</span>
                    <a href="#" className="hover:text-blue-300 underline">Recommended reading materials</a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Feedback Form - Only for completed courses */}
            {userBooking.status === 'completed' && (
              <div className="bg-slate-900/80 border border-slate-700 rounded-2xl p-6 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-semibold text-white">💬 Course Feedback</h2>
                  {userBooking.feedback?.rating ? (
                    <span className="text-xs px-3 py-1 rounded-full bg-green-500/20 text-green-300 border border-green-500/40">
                      ✓ Feedback Submitted
                    </span>
                  ) : (
                    <span className="text-xs px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-300 border border-yellow-500/40">
                      Required
                    </span>
                  )}
                </div>

                {userBooking.feedback?.rating && !showFeedbackForm ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                      <p className="text-sm text-slate-400 mb-2">Your Rating:</p>
                      <div className="flex gap-1 mb-3">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span key={star} className={`text-2xl ${star <= userBooking.feedback.rating ? 'text-yellow-400' : 'text-slate-600'}`}>
                            ⭐
                          </span>
                        ))}
                      </div>
                      {userBooking.feedback.comment && (
                        <>
                          <p className="text-sm text-slate-400 mb-2">Your Comment:</p>
                          <p className="text-sm text-slate-300 italic">&quot;{userBooking.feedback.comment}&quot;</p>
                        </>
                      )}
                    </div>
                    <button
                      onClick={() => setShowFeedbackForm(true)}
                      className="text-sm text-blue-400 hover:text-blue-300 underline"
                    >
                      Edit your feedback
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-sm text-slate-400">
                      Share your experience with this course and help others make informed decisions.
                    </p>

                    <div>
                      <label className="text-sm text-slate-300 mb-2 block">
                        Rating <span className="text-red-400">*</span>
                      </label>
                      <div className="flex gap-2 justify-center p-4 bg-slate-800/50 rounded-lg">
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
                        placeholder="Share your thoughts about the course, what you learned, and how it helped you..."
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/70 min-h-[120px]"
                      />
                    </div>

                    <button
                      onClick={submitFeedback}
                      disabled={!feedbackForm.rating}
                      className={`w-full text-white text-sm font-medium py-3 rounded-lg transition ${
                        feedbackForm.rating 
                          ? 'bg-blue-500 hover:bg-blue-400 cursor-pointer' 
                          : 'bg-slate-700 cursor-not-allowed opacity-50'
                      }`}
                    >
                      {userBooking.feedback?.rating ? 'Update Feedback' : 'Submit Feedback'}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SessionDetail;
