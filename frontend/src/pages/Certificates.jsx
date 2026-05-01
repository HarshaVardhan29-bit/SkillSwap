import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";

const Certificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const res = await api.get("/certificates/my-certificates");
      setCertificates(res.data);
    } catch (err) {
      console.error("Error fetching certificates:", err);
    } finally {
      setLoading(false);
    }
  };

  const getCertificateIcon = (type) => {
    switch (type) {
      case "session_hosted": return "👨‍🏫";
      case "session_completed": return "🎓";
      case "milestone_achievement": return "🏆";
      default: return "📜";
    }
  };

  const getCertificateColor = (type) => {
    switch (type) {
      case "session_hosted": return "from-emerald-500 to-green-600";
      case "session_completed": return "from-blue-500 to-indigo-600";
      case "milestone_achievement": return "from-purple-500 to-pink-600";
      default: return "from-slate-500 to-slate-600";
    }
  };

  const downloadCertificate = async (certificateId) => {
    try {
      const res = await api.get(`/certificates/${certificateId}/download`);
      // For now, just show the certificate data
      alert(`Certificate download would start here!\n\nCertificate ID: ${res.data.certificate.id}\nRecipient: ${res.data.certificate.recipient}`);
    } catch (err) {
      console.error("Error downloading certificate:", err);
      alert("Failed to download certificate");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <p className="text-slate-400">Loading certificates...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">📜 My Certificates</h1>
          <p className="text-slate-400">Your verified achievements and accomplishments</p>
        </div>

        {/* Certificates Grid */}
        {certificates.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((cert) => (
              <div
                key={cert._id}
                className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden hover:border-blue-500/50 transition-all group"
              >
                {/* Certificate Header */}
                <div className={`bg-gradient-to-r ${getCertificateColor(cert.type)} p-6 text-white`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-4xl">{getCertificateIcon(cert.type)}</div>
                    <div className="text-right">
                      <div className="text-xs opacity-80">Certificate ID</div>
                      <div className="text-sm font-mono">{cert.certificateId}</div>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{cert.title}</h3>
                  <p className="text-sm opacity-90">{cert.skillName}</p>
                </div>

                {/* Certificate Body */}
                <div className="p-6">
                  <p className="text-slate-300 text-sm mb-4 leading-relaxed">
                    {cert.description}
                  </p>

                  <div className="flex items-center justify-between text-xs text-slate-400 mb-4">
                    <span>Issued: {new Date(cert.issuedDate).toLocaleDateString()}</span>
                    <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded">
                      ✓ Verified
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => downloadCertificate(cert.certificateId)}
                      className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-400 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      📥 Download
                    </button>
                    <button
                      onClick={() => navigator.clipboard.writeText(`${window.location.origin}/certificates/${cert.certificateId}`)}
                      className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg text-sm font-medium transition-colors"
                    >
                      🔗 Share
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-8xl mb-6">📜</div>
            <h2 className="text-2xl font-semibold text-white mb-4">No Certificates Yet</h2>
            <p className="text-slate-400 mb-8 max-w-md mx-auto">
              Start hosting sessions, completing courses, and achieving milestones to earn your first certificate!
            </p>
            <div className="flex justify-center gap-4">
              <Link
                to="/sessions"
                className="px-6 py-3 bg-blue-500 hover:bg-blue-400 text-white rounded-lg font-medium transition-colors"
              >
                Browse Sessions
              </Link>
              <Link
                to="/create-session"
                className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-lg font-medium transition-colors"
              >
                Host a Session
              </Link>
            </div>
          </div>
        )}

        {/* How to Earn Certificates */}
        <div className="mt-12 bg-slate-900 border border-slate-700 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-4">🎯 How to Earn Certificates</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl mb-2">👨‍🏫</div>
              <h3 className="font-semibold text-white mb-2">Session Mentor</h3>
              <p className="text-sm text-slate-400">Host a learning session and help students</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🎓</div>
              <h3 className="font-semibold text-white mb-2">Active Learner</h3>
              <p className="text-sm text-slate-400">Complete 3 sessions as a student</p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🏆</div>
              <h3 className="font-semibold text-white mb-2">Milestone Achievement</h3>
              <p className="text-sm text-slate-400">Reach major milestones like hosting 5 sessions</p>
            </div>
          </div>
        </div>

        {/* Certificate Verification */}
        <div className="mt-8 bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-blue-300 mb-2">🔒 Certificate Verification</h3>
          <p className="text-sm text-slate-300">
            All certificates are digitally signed and can be verified using their unique Certificate ID. 
            Share your certificate link with employers or institutions for instant verification.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Certificates;