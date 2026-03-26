import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('users/register/', { username, email, password });
      // Auto-login after registration
      const loginRes = await api.post('users/login/', { username, password });
      localStorage.setItem('access_token', loginRes.data.access);
      localStorage.setItem('refresh_token', loginRes.data.refresh);
      navigate('/onboarding');
    } catch (err) {
      if (err.response && err.response.data) {
        const errors = err.response.data;
        const messages = Object.keys(errors).map(key => {
          const msg = Array.isArray(errors[key]) ? errors[key].join(' ') : errors[key];
          return `${key.charAt(0).toUpperCase() + key.slice(1)}: ${msg}`;
        });
        setError(messages.join(' | '));
      } else {
        setError('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex font-sans">
      {/* Left art panel */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-indigo-500 to-pink-500 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(255,255,255,0.15)_0%,transparent_60%)]"></div>
        <div className="text-white text-center px-12 relative z-10">
          <h2 className="text-5xl font-black mb-4 leading-tight">Start your<br/>love story.</h2>
          <p className="text-white/80 text-lg font-medium">Join thousands of people finding meaningful connections every day.</p>
          <div className="flex justify-center gap-3 mt-8 flex-wrap">
            {['🤖 AI Match', '✅ Verified', '💎 VIP Curated'].map(f => (
              <span key={f} className="px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 text-white text-sm font-bold rounded-full">{f}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-10">
            <h1 className="text-3xl font-black text-slate-800 mb-2">Create account</h1>
            <p className="text-slate-500 font-medium">Already have one? <Link to="/login" className="text-pink-500 font-bold hover:underline">Sign in</Link></p>
          </div>

          {error && <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-2xl text-sm mb-6 font-medium">{error}</div>}
          
          <form className="space-y-5" onSubmit={handleRegister}>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Username</label>
              <input type="text" value={username} onChange={e => setUsername(e.target.value)} required className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl px-5 py-4 focus:outline-none focus:border-pink-500 font-medium transition-colors" placeholder="Choose a username" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl px-5 py-4 focus:outline-none focus:border-pink-500 font-medium transition-colors" placeholder="you@example.com" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl px-5 py-4 focus:outline-none focus:border-pink-500 font-medium transition-colors" placeholder="••••••••" />
            </div>
            <button type="submit" disabled={loading} className={`w-full py-4 rounded-full font-black text-white text-lg shadow-lg transition-all active:scale-95 ${loading ? 'bg-slate-300' : 'bg-gradient-to-r from-pink-500 to-rose-500 shadow-pink-200 hover:shadow-pink-300 hover:-translate-y-0.5'}`}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
          <p className="text-center text-xs text-slate-400 mt-6">By creating an account you agree to our Terms & Privacy Policy.</p>
        </div>
      </div>
    </div>
  );
};

export default Register;
