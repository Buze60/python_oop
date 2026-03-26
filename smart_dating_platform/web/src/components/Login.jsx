import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('users/login/', { username, password });
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      
      try {
          const profileRes = await api.get('users/profile/');
          const p = profileRes.data;
          if (!p.birth_date || !p.gender || !p.intent || !p.location) {
              navigate('/onboarding');
          } else {
              navigate('/dashboard');
          }
      } catch {
          navigate('/onboarding');
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid username or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex font-sans">
      {/* Left art panel */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-pink-500 to-rose-400 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.15)_0%,transparent_60%)]"></div>
        <div className="text-white text-center px-12 relative z-10">
          <div className="w-24 h-24 bg-white/20 rounded-full mx-auto mb-6 flex items-center justify-center backdrop-blur-sm border border-white/30">
            <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
          </div>
          <h2 className="text-4xl font-black mb-4">Welcome back!</h2>
          <p className="text-white/80 text-lg font-medium">Your next great connection is waiting for you.</p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-10">
            <h1 className="text-3xl font-black text-slate-800 mb-2">Sign in</h1>
            <p className="text-slate-500 font-medium">Don't have an account? <Link to="/register" className="text-pink-500 font-bold hover:underline">Create one</Link></p>
          </div>

          {error && <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-2xl text-sm mb-6 font-medium">{error}</div>}
          
          <form className="space-y-5" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Username</label>
              <input type="text" value={username} onChange={e => setUsername(e.target.value)} required className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl px-5 py-4 focus:outline-none focus:border-pink-500 font-medium transition-colors" placeholder="Enter your username" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl px-5 py-4 focus:outline-none focus:border-pink-500 font-medium transition-colors" placeholder="••••••••" />
            </div>
            <button type="submit" disabled={loading} className={`w-full py-4 rounded-full font-black text-white text-lg shadow-lg transition-all active:scale-95 ${loading ? 'bg-slate-300' : 'bg-gradient-to-r from-pink-500 to-rose-500 shadow-pink-200 hover:shadow-pink-300 hover:-translate-y-0.5'}`}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
