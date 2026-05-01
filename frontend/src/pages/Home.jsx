import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Home = () => {
  const [showTopArrow, setShowTopArrow] = useState(false);

  // Show "back to top" arrow after scrolling down
  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 400) {
        setShowTopArrow(true);
      } else {
        setShowTopArrow(false);
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="bg-black text-white overflow-x-hidden scroll-smooth">
      {/* HERO SECTION */}
      <section
        id="top"
        className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-900 via-slate-950 to-black px-4"
      >
        {/* flowing gradient background */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-96 w-96 bg-gradient-to-br from-emerald-500 via-sky-500 to-blue-700 opacity-40 blur-[130px] animate-pulse" />
          <div className="absolute bottom-[-8rem] right-10 h-80 w-80 bg-gradient-to-tr from-sky-500 via-indigo-500 to-purple-600 opacity-40 blur-[130px] animate-pulse" />
        </div>

        <div className="max-w-5xl text-center space-y-6 relative">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
            Learn, teach, and grow
            <br />
            with{" "}
            <span className="text-emerald-400">
              real people, real skills.
            </span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl mx-auto">
            SkillSwap connects learners and mentors for short, focused
            sessions. Offer what you know, request what you want to learn, and
            grow together — one session at a time.
          </p>

          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Link
              to="/register"
              className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 rounded-full text-black font-semibold text-sm shadow-xl shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:-translate-y-1 transition-all duration-200"
            >
              Get started for free
            </Link>
            <Link
              to="/sessions"
              className="px-6 py-3 rounded-full border border-slate-600 hover:border-emerald-400 text-sm text-slate-200 hover:text-white bg-slate-950/60 backdrop-blur-sm hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-500/20 transition-all duration-200"
            >
              Browse sessions
            </Link>
          </div>

          <div className="flex flex-wrap justify-center gap-4 text-[11px] text-slate-400 pt-4">
            <span>⚡ 30–45 min micro-sessions</span>
            <span>💬 Real-time chat</span>
            <span>⭐ Ratings & feedback</span>
          </div>
        </div>

        {/* down arrow to scroll */}
        <button
          type="button"
          onClick={() => scrollToSection("profile-section")}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-xs text-slate-300 hover:text-white transition-colors"
        >
          <span>Scroll down</span>
          <span className="h-8 w-8 flex items-center justify-center rounded-full border border-slate-500 hover:border-emerald-400 bg-slate-900/60 backdrop-blur animate-bounce">
            {/* chevron down */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                clipRule="evenodd"
              />
            </svg>
          </span>
        </button>
      </section>

      {/* PROFILE & MATCH SECTION */}
      <section
        id="profile-section"
        className="py-20 relative"
      >
        {/* soft background glow */}
        <div className="pointer-events-none absolute inset-0 flex justify-center">
          <div className="h-96 w-96 bg-sky-500/20 blur-[150px] rounded-full" />
        </div>

        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 px-4 relative">
          {/* LEFT – PROFILE SETUP CARD */}
          <div className="bg-white/5 backdrop-blur-2xl p-6 sm:p-7 rounded-3xl border border-white/10 shadow-2xl hover:-translate-y-1 hover:shadow-[0_0_60px_rgba(59,130,246,0.4)] transition-all duration-200">
            <p className="text-xs text-emerald-300/90 font-medium uppercase tracking-[0.25em] mb-2">
              Step 1
            </p>
            <h2 className="text-xl sm:text-2xl font-semibold mb-1">
              Set up your learning & teaching profile
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm mb-5">
              Tell SkillSwap what you can teach and what you want to learn. We’ll
              use this to match you with the right people.
            </p>

            <div className="space-y-3 text-sm">
              <input
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/70"
                placeholder="Full name*"
              />
              <input
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/70"
                placeholder="Short bio"
              />
              <input
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/70"
                placeholder="Skills you want to teach"
              />
              <input
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/70"
                placeholder="Skills you want to learn"
              />
              <input
                className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/70"
                placeholder="Upload profile image (link or file)"
              />

              <button className="w-full mt-1 bg-sky-500 hover:bg-sky-400 text-black font-semibold py-2.5 rounded-xl text-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-sky-500/40">
                Continue
              </button>
            </div>

            <p className="mt-4 text-slate-400 text-xs sm:text-sm">
              You can always complete this later from your{" "}
              <span className="text-emerald-300 font-medium">Dashboard</span>.
            </p>

            <Link
              to="/register"
              className="text-emerald-300 text-xs sm:text-sm underline mt-3 inline-block hover:text-emerald-200 transition-colors"
            >
              Create your SkillSwap profile →
            </Link>
          </div>

          {/* RIGHT – MATCH CARDS (NEHAL & MADHU) + MINI SCHEDULE */}
          <div className="space-y-4">
            {/* CARD 1 – NEHAL */}
            <div className="rounded-3xl bg-slate-950/80 border border-slate-700/70 shadow-xl p-5 sm:p-6 backdrop-blur-xl hover:-translate-y-1 hover:shadow-[0_0_50px_rgba(16,185,129,0.5)] transition-all duration-200">
              <div className="flex items-start gap-3 mb-3">
                {/* Avatar */}
                <div className="h-11 w-11 rounded-full bg-gradient-to-tr from-emerald-400 to-sky-400 flex items-center justify-center text-sm font-semibold">
                  NH
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold">
                        Nehal – Full Stack Developer
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Xebia Academy • MERN Stack • APIs
                      </p>
                    </div>
                    <span className="text-[10px] px-2 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/40">
                      99% match
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-300 mt-2">
                    You can learn from Nehal:{" "}
                    <span className="font-medium text-emerald-300">
                      React, Node.js, MongoDB, REST APIs
                    </span>
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    You can teach Nehal:{" "}
                    <span className="font-medium text-sky-300">
                      Public speaking, Interview prep, Communication skills
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-3 text-[11px]">
                <span className="px-2.5 py-1 rounded-full bg-slate-800/90 border border-slate-700">
                  45 min · Online
                </span>
                <span className="px-2.5 py-1 rounded-full bg-slate-800/90 border border-slate-700">
                  Full stack roadmap
                </span>
                <span className="px-2.5 py-1 rounded-full bg-slate-800/90 border border-slate-700">
                  Beginner & Intermediate
                </span>
              </div>
            </div>

            {/* CARD 2 – MADHU */}
            <div className="rounded-3xl bg-slate-950/75 border border-slate-700/60 shadow-lg p-5 sm:p-6 backdrop-blur-xl translate-x-3 sm:translate-x-6 hover:-translate-y-1 hover:shadow-[0_0_40px_rgba(129,140,248,0.5)] transition-all duration-200">
              <div className="flex items-start gap-3 mb-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-pink-400 to-indigo-400 flex items-center justify-center text-sm font-semibold">
                  MD
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold">Madhu – Data & Automation</p>
                  <p className="text-[11px] text-slate-400">
                    You can learn: Python basics, Excel tricks, Automation ideas
                  </p>
                </div>
              </div>
              <p className="text-[11px] text-slate-300">
                You can teach Madhu:{" "}
                <span className="font-medium text-indigo-300">
                  Presentation skills, Canva, Content strategy
                </span>
              </p>
              <div className="flex justify-between items-center mt-3 text-[11px]">
                <span className="px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700">
                  30 min · Flexible
                </span>
                <button className="px-3 py-1 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-600 hover:-translate-y-0.5 transition-all duration-200">
                  See how matching works
                </button>
              </div>
            </div>

            {/* MINI SCHEDULE STRIP */}
            <div className="rounded-3xl bg-slate-950/85 border border-slate-700/80 p-4 sm:p-5 text-xs text-slate-200 flex flex-col gap-3 backdrop-blur-xl hover:-translate-y-1 hover:shadow-[0_0_45px_rgba(148,163,184,0.5)] transition-all duration-200">
              <div className="flex justify-between items-center">
                <p className="font-semibold text-sm">Today&apos;s schedule</p>
                <p className="text-slate-400 text-[11px]">
                  Learning & teaching overview
                </p>
              </div>

              <div className="flex justify-between items-center border border-slate-700 rounded-2xl px-3 py-2.5">
                <div>
                  <p className="text-[11px] uppercase tracking-wide text-slate-400">
                    Learning · 6:00 PM
                  </p>
                  <p className="text-xs font-medium">
                    Full Stack intro with Nehal
                  </p>
                </div>
                <button className="text-[11px] px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 transition-colors">
                  Join
                </button>
              </div>

              <div className="flex justify-between items-center border border-slate-700 rounded-2xl px-3 py-2.5">
                <div>
                  <p className="text-[11px] uppercase tracking-wide text-slate-400">
                    Teaching · Saturday
                  </p>
                  <p className="text-xs font-medium">
                    Public speaking for beginners
                  </p>
                </div>
                <button className="text-[11px] px-2.5 py-1 rounded-full bg-slate-800 text-slate-200 border border-slate-600 hover:bg-slate-700 transition-colors">
                  View details
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-24 bg-gradient-to-b from-black via-slate-950 to-slate-900 px-4">
        <div className="max-w-6xl mx-auto text-center space-y-10">
          <h2 className="text-3xl sm:text-4xl font-semibold">
            Why people love using{" "}
            <span className="text-emerald-400">SkillSwap</span>
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/5 backdrop-blur-lg p-6 rounded-3xl border border-white/10 shadow-xl text-left hover:-translate-y-1 hover:shadow-[0_0_45px_rgba(148,163,184,0.6)] transition-all duration-200">
              <h3 className="text-lg font-semibold mb-2">Peer learning</h3>
              <p className="text-slate-300 text-sm">
                Learn directly from people who&apos;ve done it before. No boring
                theory — just practical sessions.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-lg p-6 rounded-3xl border border-white/10 shadow-xl text-left hover:-translate-y-1 hover:shadow-[0_0_45px_rgba(56,189,248,0.6)] transition-all duration-200">
              <h3 className="text-lg font-semibold mb-2">Real-time chat</h3>
              <p className="text-slate-300 text-sm">
                Coordinate sessions, share links, and stay in sync through
                built-in chat between mentor and learner.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-lg p-6 rounded-3xl border border-white/10 shadow-xl text-left hover:-translate-y-1 hover:shadow-[0_0_45px_rgba(52,211,153,0.6)] transition-all duration-200">
              <h3 className="text-lg font-semibold mb-2">Trust & ratings</h3>
              <p className="text-slate-300 text-sm">
                Rate each session and build a trusted profile as a learner or
                mentor over time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOUNDING TEAM SECTION – PREMIUM GLASSMORPHIC CARDS */}
      <section className="py-28 bg-black px-4 relative overflow-hidden">
        {/* Big blurred glowing background */}
        <div className="pointer-events-none absolute inset-0 flex justify-center">
          <div className="h-[500px] w-[500px] bg-blue-500/25 blur-[180px] rounded-full -translate-y-10" />
        </div>

        <div className="max-w-6xl mx-auto space-y-14 relative">
          <h2 className="text-4xl font-semibold text-center">
            Meet the <span className="text-emerald-400">Founding Team</span>
          </h2>

          {/* CARDS GRID */}
          <div className="grid md:grid-cols-3 gap-10 px-4">
            {/* FOUNDER CARD */}
            <div className="relative bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-[0_0_40px_rgba(0,0,0,0.6)] p-1 hover:-translate-y-1 hover:shadow-[0_0_70px_rgba(59,130,246,0.8)] transition-all duration-200">
              <div className="bg-gradient-to-b from-white/20 via-white/5 to-black/20 rounded-3xl p-6 sm:p-7 border border-white/10 backdrop-blur-2xl">
                <h3 className="text-center text-xl font-bold tracking-wide text-white">
                  HARSHA VARDHAN
                </h3>
                <p className="text-center text-emerald-300 text-sm mt-1 font-medium">
                  FOUNDER
                </p>
                <div className="h-px w-full bg-white/10 my-4" />
                <p className="text-slate-300 text-sm leading-relaxed text-center">
                  Visionary behind SkillSwap — bringing people together to learn,
                  teach, and grow through real human connection.
                </p>
              </div>
              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 h-32 w-32 bg-orange-500/30 blur-[90px]" />
            </div>

            {/* CO-FOUNDER 1 CARD */}
            <div className="relative bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-[0_0_40px_rgba(0,0,0,0.6)] p-1 hover:-translate-y-1 hover:shadow-[0_0_70px_rgba(59,130,246,0.8)] transition-all duration-200">
              <div className="bg-gradient-to-b from-white/20 via-white/5 to-black/20 rounded-3xl p-6 sm:p-7 border border-white/10 backdrop-blur-2xl">
                <h3 className="text-center text-xl font-bold tracking-wide text-white">
                  MANIKANTA
                </h3>
                <p className="text-center text-emerald-300 text-sm mt-1 font-medium">
                  CO-FOUNDER
                </p>
                <div className="h-px w-full bg-white/10 my-4" />
                <p className="text-slate-300 text-sm leading-relaxed text-center">
                  Co-creator of the SkillSwap ecosystem, enhancing user
                  experience and collaborative learning.
                </p>
              </div>
              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 h-32 w-32 bg-blue-400/30 blur-[90px]" />
            </div>

            {/* CO-FOUNDER 2 CARD */}
            <div className="relative bg-white/5 backdrop-blur-2xl rounded-3xl border border-white/20 shadow-[0_0_40px_rgba(0,0,0,0.6)] p-1 hover:-translate-y-1 hover:shadow-[0_0_70px_rgba(180,83,246,0.8)] transition-all duration-200">
              <div className="bg-gradient-to-b from-white/20 via-white/5 to-black/20 rounded-3xl p-6 sm:p-7 border border-white/10 backdrop-blur-2xl">
                <h3 className="text-center text-xl font-bold tracking-wide text-white">
                  SRINATH
                </h3>
                <p className="text-center text-emerald-300 text-sm mt-1 font-medium">
                  CO-FOUNDER
                </p>
                <div className="h-px w-full bg-white/10 my-4" />
                <p className="text-slate-300 text-sm leading-relaxed text-center">
                  Technical strategist ensuring platform stability, performance,
                  and seamless scaling.
                </p>
              </div>
              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 h-32 w-32 bg-purple-400/30 blur-[90px]" />
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 bg-black/90 border-t border-white/10 text-center text-slate-400 text-xs">
        SkillSwap © 2025 — Founded by{" "}
        <span className="text-emerald-300">Harsha Vardhan</span> • Co-founders:{" "}
        <span className="text-emerald-300">Manikanta</span> &{" "}
        <span className="text-emerald-300">Srinath</span>
      </footer>

      {/* BACK TO TOP ARROW */}
      {showTopArrow && (
        <button
          type="button"
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 h-10 w-10 rounded-full bg-slate-900/80 border border-slate-600 text-slate-200 hover:border-emerald-400 hover:text-white hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-500/30 flex items-center justify-center backdrop-blur z-40 transition-all duration-200"
        >
          {/* chevron up */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M14.77 12.79a.75.75 0 01-1.06-.02L10 9.06l-3.71 3.71a.75.75 0 11-1.06-1.06l4.24-4.24a.75.75 0 011.06 0l4.24 4.24a.75.75 0 01-.02 1.08z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default Home;
