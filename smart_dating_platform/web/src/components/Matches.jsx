import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import Navigation from './Navigation';

const MEDIA_URL = 'http://localhost:8000/media/';

const Matches = () => {
  const [matches, setMatches] = useState([]);
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [matchRes, meRes] = await Promise.all([
          api.get('matches/'),
          api.get('users/profile/'),
        ]);
        setMatches(matchRes.data);
        setMe(meRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const getOther = (match) => {
    if (!me) return null;
    // Me is identified by username in the nested user obj
    return match.user1.username === me.username ? match.user2 : match.user1;
  };

  const getAvatar = (user) => {
    if (user?.profile?.id_photo) return `${MEDIA_URL}${user.profile.id_photo}`;
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username}&backgroundColor=fbbf24,f472b6,818cf8`;
  };

  return (
    <div className="h-screen bg-slate-100 flex font-sans overflow-hidden">
      <Navigation />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-slate-200 px-8 py-5">
          <h1 className="text-2xl font-black text-slate-800">Messages</h1>
          <p className="text-slate-500 text-sm font-medium mt-0.5">Your matched connections</p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="w-10 h-10 border-4 border-pink-100 border-t-pink-500 rounded-full animate-spin"></div>
            </div>
          ) : matches.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-24 h-24 bg-pink-50 rounded-full flex items-center justify-center mb-6">
                <svg className="w-12 h-12 text-pink-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-black text-slate-700 mb-2">No matches yet</h3>
              <p className="text-slate-500 font-medium mb-6">Start swiping to find your connections!</p>
              <Link to="/dashboard" className="px-8 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold rounded-full shadow-lg shadow-pink-200 hover:-translate-y-0.5 transition-all">
                Go Discover
              </Link>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto space-y-2">
              {matches.map(match => {
                const other = getOther(match);
                if (!other) return null;
                return (
                  <Link key={match.id} to={`/chat/${match.id}`}
                    className="flex items-center gap-4 bg-white p-4 rounded-2xl hover:bg-pink-50/50 hover:border-pink-100 border-2 border-transparent transition-all cursor-pointer group">
                    {/* Avatar */}
                    <div className="relative shrink-0">
                      <div className="w-14 h-14 rounded-full overflow-hidden bg-slate-200 border-2 border-white shadow-md">
                        <img src={getAvatar(other)} alt={other.username} className="w-full h-full object-cover" />
                      </div>
                      <div className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-white"></div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 overflow-hidden">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-slate-800 text-base truncate">{other.username}</h3>
                        {other.profile?.verification_status === 'verified' && (
                          <svg className="w-4 h-4 text-blue-500 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                        )}
                      </div>
                      <p className="text-slate-500 text-sm font-medium truncate">{other.profile?.location || 'Tap to start chatting'}</p>
                    </div>

                    {/* Arrow */}
                    <svg className="w-5 h-5 text-slate-300 group-hover:text-pink-400 transition-colors shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7"></path></svg>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Matches;
