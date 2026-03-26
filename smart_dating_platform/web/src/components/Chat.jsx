import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';
import Navigation from './Navigation';

const MEDIA_URL = 'http://localhost:8000/media/';

const Chat = () => {
  const { matchId } = useParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [me, setMe] = useState(null);
  const [match, setMatch] = useState(null);
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    const init = async () => {
      try {
        // Get current user's profile
        const meRes = await api.get('users/profile/');
        setMe(meRes.data);
        // Get match details to show the other user's info in header
        const matchRes = await api.get('matches/');
        const found = matchRes.data.find(m => m.id === parseInt(matchId));
        setMatch(found || null);
      } catch (err) {
        console.error(err);
      }
    };
    init();
  }, [matchId]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await api.get(`chat/${matchId}/`);
        setMessages(response.data);
        setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMessages();
    const interval = setInterval(fetchMessages, 4000);
    return () => clearInterval(interval);
  }, [matchId]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || sending) return;
    setSending(true);
    try {
        await api.post(`chat/${matchId}/`, { content: input });
        setInput('');
        const response = await api.get(`chat/${matchId}/`);
        setMessages(response.data);
        setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
    } catch (err) {
        console.error("Failed to send");
    } finally {
        setSending(false);
    }
  };

  const isMine = (msg) => msg.sender?.username === me?.username;

  const getOther = () => {
    if (!match || !me) return null;
    return match.user1.username === me.username ? match.user2 : match.user1;
  };

  const getAvatar = (user) => {
    if (user?.profile?.id_photo) return `${MEDIA_URL}${user.profile.id_photo}`;
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username}&backgroundColor=fbbf24,f472b6,818cf8`;
  };

  const other = getOther();

  return (
    <div className="h-screen bg-slate-100 flex font-sans overflow-hidden">
      <Navigation />
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Chat Header */}
        <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center gap-4 shrink-0">
          <Link to="/chat" className="p-2 text-slate-400 hover:text-slate-700 transition-colors rounded-full hover:bg-slate-100">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"></path></svg>
          </Link>
          {other ? (
            <>
              <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-200 shrink-0">
                <img src={getAvatar(other)} alt={other.username} className="w-full h-full object-cover" />
              </div>
              <div>
                <h2 className="font-bold text-slate-800">{other.username}</h2>
                <p className="text-xs text-emerald-500 font-semibold">Online</p>
              </div>
            </>
          ) : (
            <h2 className="font-bold text-slate-800">Match #{matchId}</h2>
          )}
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-20 h-20 bg-pink-50 rounded-full flex items-center justify-center mb-4">
                <svg className="w-10 h-10 text-pink-200" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
              </div>
              <p className="text-slate-600 font-bold">Say hello to {other?.username || 'your match'}! 👋</p>
              <p className="text-slate-400 text-sm mt-1 font-medium">You matched! Break the ice.</p>
            </div>
          )}
          {messages.map((msg) => (
            <div key={msg.id} className={`flex items-end gap-2 ${isMine(msg) ? 'justify-end' : 'justify-start'}`}>
              {!isMine(msg) && (
                <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-200 shrink-0 mb-1">
                  <img src={getAvatar(msg.sender)} alt={msg.sender?.username} className="w-full h-full object-cover" />
                </div>
              )}
              <div className={`max-w-[65%] rounded-3xl px-5 py-3 ${isMine(msg) ? 'bg-gradient-to-br from-pink-500 to-rose-500 text-white rounded-br-lg' : 'bg-white text-slate-800 shadow-sm border border-slate-100 rounded-bl-lg'}`}>
                <p className="text-[15px] leading-relaxed">{msg.content}</p>
                <p className={`text-[10px] mt-1 font-semibold ${isMine(msg) ? 'text-white/60 text-right' : 'text-slate-400'}`}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input Area */}
        <div className="bg-white border-t border-slate-100 p-4 shrink-0">
          <form className="flex items-center gap-3 max-w-3xl mx-auto" onSubmit={sendMessage}>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              className="flex-1 bg-slate-50 border-2 border-slate-200 rounded-full px-6 py-3 focus:outline-none focus:border-pink-400 font-medium transition-colors"
              placeholder={`Message ${other?.username || ''}...`}
              disabled={sending}
            />
            <button
              type="submit"
              disabled={!input.trim() || sending}
              className={`w-12 h-12 rounded-full flex items-center justify-center shadow-md transition-all shrink-0 ${input.trim() ? 'bg-gradient-to-r from-pink-500 to-rose-500 hover:scale-105 active:scale-95' : 'bg-slate-200'}`}
            >
              <svg className={`w-5 h-5 ${input.trim() ? 'text-white' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;
