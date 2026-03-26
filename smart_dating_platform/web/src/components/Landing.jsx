import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans overflow-hidden">
      {/* Hero Section */}
      <div className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden">
        {/* Background blobs */}
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-pink-100 rounded-full opacity-50 blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-40 -left-40 w-[600px] h-[600px] bg-rose-100 rounded-full opacity-50 blur-3xl pointer-events-none"></div>

        {/* Logo */}
        <div className="mb-10 text-center relative z-10">
          <div className="w-20 h-20 bg-gradient-to-tr from-pink-500 to-rose-400 rounded-full mx-auto mb-5 flex items-center justify-center shadow-2xl shadow-pink-200">
            <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
          </div>
          <h1 className="text-6xl font-black tracking-tighter mb-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-600 via-rose-500 to-orange-400">SmartDating</h1>
          <p className="text-slate-500 text-xl font-medium max-w-sm mx-auto leading-relaxed">
            Find genuine connections, powered by AI matching and real human curation.
          </p>
        </div>

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-3 mb-10 relative z-10">
          {['🤖 AI Smart Match', '✅ Verified Profiles', '💎 VIP Agent Pairs', '🔒 Private & Secure'].map(f => (
            <span key={f} className="px-4 py-2 bg-white border border-slate-200 text-slate-600 text-sm font-bold rounded-full shadow-sm">{f}</span>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm relative z-10">
          <Link to="/register" className="flex-1 py-4 text-center bg-gradient-to-r from-pink-500 to-rose-500 text-white font-black rounded-full shadow-xl shadow-pink-200 hover:shadow-pink-300 hover:-translate-y-0.5 transition-all text-lg">
            Create Account
          </Link>
          <Link to="/login" className="flex-1 py-4 text-center bg-white text-slate-700 font-bold rounded-full border-2 border-slate-200 hover:border-slate-300 hover:-translate-y-0.5 transition-all text-lg">
            Sign In
          </Link>
        </div>

        <p className="text-slate-400 text-xs mt-8 font-medium relative z-10">By continuing you agree to our Terms of Service & Privacy Policy.</p>
      </div>
    </div>
  );
};

export default Landing;
