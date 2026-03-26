import React, { useState, useEffect } from 'react';
import Navigation from './Navigation';
import api from '../api';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('swipe');
  const [profiles, setProfiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [filters, setFilters] = useState({ gender: '', intent: '', location: '', min_age: '', max_age: '' });
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [actionAnim, setActionAnim] = useState(null);

  const fetchMatches = async (tab) => {
      setLoading(true);
      try {
          if (tab === 'swipe') {
              const params = new URLSearchParams();
              for (const key in filters) { if (filters[key]) params.append(key, filters[key]); }
              const response = await api.get(`matches/discover/?${params.toString()}`);
              setProfiles(response.data);
          } else if (tab === 'ai') {
              const response = await api.get('matches/ai-smart/');
              setProfiles(response.data);
          } else if (tab === 'agent') {
              const response = await api.get('matches/agent/');
              setProfiles(response.data);
          }
          setCurrentIndex(0);
      } catch (err) {
          console.error("Failed to fetch feed", err);
      } finally {
          setLoading(false);
      }
  };

  useEffect(() => {
      fetchMatches(activeTab);
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const handleFilterSubmit = (e) => {
      e.preventDefault();
      fetchMatches(activeTab);
      setShowFilters(false);
  };

  const calculateAge = (birthDateString) => {
    if (!birthDateString) return '';
    const today = new Date();
    const birthDate = new Date(birthDateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    return age;
  };

  const handleSwipe = async (isLike) => {
      const p = profiles[currentIndex];
      if (!p) return;
      
      setActionAnim(isLike ? 'right' : 'left');
      
      try {
          const res = await api.post('matches/swipe/', { swiped: p.id, is_like: isLike });
          
          setTimeout(() => {
              setActionAnim(null);
              setCurrentIndex(prev => prev + 1);
              if (res.data.match) alert(`It's a match with ${p.username}! 🎉`);
          }, 300);
      } catch (err) {
          console.error("Failed to swipe", err);
          setActionAnim(null);
      }
  };

  const currentProfile = profiles[currentIndex];

  return (
    <div className="h-screen bg-slate-100 text-slate-900 flex font-sans overflow-hidden">
      <Navigation />
      
      {/* Main Canvas Context */}
      <div className="flex-1 flex flex-col relative overflow-hidden bg-slate-100">
      
      {/* Filtering Modal Overlay */}
      {showFilters && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex justify-end">
            <div className="w-full max-w-sm h-full bg-white shadow-2xl animate-[slide-in-right_0.3s_ease-out] p-6 overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-black text-slate-800">Filters</h2>
                    <button onClick={() => setShowFilters(false)} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200"><svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>
                </div>
                {activeTab !== 'swipe' && (
                    <div className="mb-6 p-4 bg-indigo-50 border-l-4 border-indigo-500 rounded-r-xl text-xs text-indigo-700 font-medium">
                        These filters currently only apply directly to the Discover tab. Smart AI relies on automated intent & interest matching.
                    </div>
                )}
                <form onSubmit={handleFilterSubmit} className={`space-y-5 text-sm ${activeTab !== 'swipe' ? 'opacity-50 pointer-events-none' : ''}`}>
                    <div>
                        <label className="block text-slate-700 mb-1.5 font-bold">Show me</label>
                        <select value={filters.gender} onChange={e => setFilters({...filters, gender: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl px-4 py-3 focus:border-pink-500 focus:ring-0 outline-none font-medium">
                            <option value="">Everyone</option>
                            <option value="M">Men</option>
                            <option value="F">Women</option>
                            <option value="O">Other</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-slate-700 mb-1.5 font-bold">Looking for</label>
                        <select value={filters.intent} onChange={e => setFilters({...filters, intent: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl px-4 py-3 focus:border-pink-500 focus:ring-0 outline-none font-medium">
                            <option value="">Anything</option>
                            <option value="casual">Casual</option>
                            <option value="serious">Serious</option>
                            <option value="marriage">Marriage</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-slate-700 mb-1.5 font-bold">Location</label>
                        <input type="text" placeholder="City or region" value={filters.location} onChange={e => setFilters({...filters, location: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl px-4 py-3 focus:border-pink-500 focus:ring-0 outline-none font-medium" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-slate-700 mb-1.5 font-bold">Min Age</label>
                            <input type="number" placeholder="18" value={filters.min_age} onChange={e => setFilters({...filters, min_age: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl px-4 py-3 focus:border-pink-500 focus:ring-0 outline-none font-medium" />
                        </div>
                        <div>
                            <label className="block text-slate-700 mb-1.5 font-bold">Max Age</label>
                            <input type="number" placeholder="99" value={filters.max_age} onChange={e => setFilters({...filters, max_age: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl px-4 py-3 focus:border-pink-500 focus:ring-0 outline-none font-medium" />
                        </div>
                    </div>
                    <button type="submit" className="w-full bg-slate-900 text-white font-black rounded-2xl py-4 mt-4 shadow-xl hover:bg-slate-800 transition-all text-base tracking-wide">Update Search</button>
                </form>
            </div>
        </div>
      )}

      {/* Main App Canvas */}
      <div className="flex-1 w-full max-w-lg mx-auto flex flex-col items-center justify-start pt-4 overflow-y-auto relative z-10">
        
        {/* Floating Controls */}
        <div className="w-full px-4 flex justify-between items-center mb-4 sticky top-0 z-20">
            <div className="flex bg-white shadow-md shadow-slate-200/50 rounded-full p-1 border border-slate-100">
                <button onClick={() => setActiveTab('swipe')} className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${activeTab === 'swipe' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>Discover</button>
                <button onClick={() => setActiveTab('ai')} className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all flex items-center ${activeTab === 'ai' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:text-indigo-600'}`}><svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg> AI Top</button>
                <button onClick={() => setActiveTab('agent')} className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all flex items-center ${activeTab === 'agent' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-500 hover:text-emerald-600'}`}><svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg> VIP</button>
            </div>
            <button onClick={() => setShowFilters(true)} className="w-10 h-10 bg-white rounded-full shadow-md shadow-slate-200/50 border border-slate-100 flex items-center justify-center hover:bg-slate-50 transition-colors text-slate-700">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
            </button>
        </div>

        {/* The Card Deck */}
        <div className="w-full px-4 flex-1 flex flex-col items-center justify-center min-h-[600px] sm:min-h-[700px]">
            {loading ? (
                <div className="flex flex-col items-center text-slate-400">
                    <div className="w-16 h-16 border-4 border-pink-100 border-t-pink-500 rounded-full animate-spin mb-4"></div>
                    <span className="font-bold tracking-wide">Locating matches...</span>
                </div>
            ) : !currentProfile ? (
                <div className="text-center bg-white p-10 rounded-[2rem] shadow-xl shadow-slate-200 border border-slate-100 w-full animate-[fade-in_0.5s_ease-out]">
                    <div className="w-24 h-24 bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-pink-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" strokeWidth="2"></circle><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 9h.01M9 15c2 1.5 4 1.5 6 0M9 9h.01M12 2v2m0 16v2m10-10h-2M4 12H2m15.364-7.364l-1.414 1.414M7.05 18.364l-1.414 1.414M18.364 18.364l-1.414-1.414M7.05 7.05L5.636 5.636"></path></svg>
                    </div>
                    <h3 className="text-2xl font-black text-slate-800 mb-2">You're all caught up!</h3>
                    <p className="text-slate-500 font-medium mb-8">We've run out of profiles nearby. Expand your filters or try a different tab.</p>
                    <button onClick={() => fetchMatches(activeTab)} className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all shadow-lg">Refresh Feed</button>
                </div>
            ) : (
                <div className={`w-full bg-white rounded-[2.5rem] shadow-2xl shadow-slate-300/60 border border-slate-100 overflow-hidden flex flex-col h-[70vh] min-h-[550px] relative transition-all duration-300 ease-in-out origin-bottom 
                    ${actionAnim === 'left' ? '-translate-x-[120%] -rotate-12 opacity-0' : actionAnim === 'right' ? 'translate-x-[120%] rotate-12 opacity-0' : 'translate-x-0 rotate-0 opacity-100'}`}>
                    
                    {/* Immersive Scrollable Card */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar relative">
                        {/* Hero Image */}
                        <div className="h-[65%] w-full relative shrink-0 bg-slate-800">
                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${currentProfile.username}&backgroundColor=fbbf24,f472b6,818cf8`} alt="avatar" className="w-full h-full object-cover opacity-90 mix-blend-screen" />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/10 to-transparent pointer-events-none"></div>
                            
                            {/* Badges Overlay */}
                            <div className="absolute top-5 left-5 right-5 flex justify-between items-start pointer-events-none">
                                <div className="flex flex-col gap-2">
                                    {activeTab === 'ai' && (
                                        <div className="bg-indigo-600/90 backdrop-blur-md text-white text-xs font-black px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 self-start uppercase tracking-wider border border-indigo-400/30">
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg> Smart Match
                                        </div>
                                    )}
                                    {activeTab === 'agent' && (
                                        <div className="bg-emerald-600/90 backdrop-blur-md text-white text-xs font-black px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 self-start uppercase tracking-wider border border-emerald-400/30">
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg> API Curated
                                        </div>
                                    )}
                                </div>
                                {currentProfile.profile?.verification_status === 'verified' && (
                                    <div className="bg-white/20 backdrop-blur-md p-1.5 rounded-full shadow-lg border border-white/30" title="Verified User">
                                        <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                                    </div>
                                )}
                            </div>
                            
                            {/* Name & Basic Info Overlay */}
                            <div className="absolute bottom-5 left-6 right-6 text-white pointer-events-none">
                                <h2 className="text-4xl font-black drop-shadow-md tracking-tight flex items-end gap-2">
                                    {currentProfile.username} 
                                    {calculateAge(currentProfile.profile?.birth_date) && <span className="text-2xl font-semibold opacity-90 inline-block translate-y-[-2px]">{calculateAge(currentProfile.profile?.birth_date)}</span>}
                                </h2>
                                <p className="flex items-center gap-1.5 opacity-90 mt-1.5 text-sm font-bold bg-black/20 self-start inline-flex px-3 py-1 rounded-full backdrop-blur-sm border border-white/10">
                                    <svg className="w-4 h-4 text-pink-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path></svg>
                                    {currentProfile.profile?.location || 'Anywhere'}
                                </p>
                            </div>
                        </div>
                        
                        {/* Profile Body Details */}
                        <div className="p-6 bg-white shrink-0 pb-32">
                            <div className="flex flex-wrap gap-2 mb-6">
                                {currentProfile.profile?.intent && (
                                    <span className="px-4 py-1.5 bg-gradient-to-r from-pink-50 to-rose-50 text-pink-700 rounded-xl text-xs font-black uppercase tracking-widest border border-pink-100 flex items-center shadow-sm">
                                        <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                        {currentProfile.profile.intent}
                                    </span>
                                )}
                                {currentProfile.profile?.trust_score && (
                                     <span className="px-4 py-1.5 bg-slate-50 text-slate-700 rounded-xl text-xs font-black uppercase tracking-widest border border-slate-100 flex items-center shadow-sm">
                                         Trust Score {currentProfile.profile.trust_score}
                                     </span>
                                )}
                            </div>
                            
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">About Me</h3>
                            <p className="text-slate-700 mb-8 font-medium text-[15px] leading-relaxed w-11/12">{currentProfile.profile?.bio || 'Just scanning the radar for genuine connections...'}</p>
                            
                            {Array.isArray(currentProfile.profile?.interests) && currentProfile.profile.interests.length > 0 && (
                                <div>
                                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Interests</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {currentProfile.profile.interests.map((i, idx) => (
                                            <span key={idx} className="px-4 py-2 bg-slate-50 text-slate-600 rounded-2xl text-sm font-bold border border-slate-200">{i}</span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Action Buttons Overlay */}
                    <div className="absolute bottom-6 inset-x-0 flex justify-center gap-6 pointer-events-none z-20">
                        <button onClick={() => handleSwipe(false)} className="pointer-events-auto w-[68px] h-[68px] bg-white border border-slate-100 text-slate-400 rounded-full flex items-center justify-center hover:border-red-200 hover:text-red-500 hover:bg-red-50 hover:scale-110 active:scale-95 transition-all shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] group">
                            <svg className="w-8 h-8 group-hover:-rotate-12 transition-transform" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                        <button onClick={() => handleSwipe(true)} className="pointer-events-auto w-[82px] h-[82px] bg-gradient-to-tr from-pink-500 to-rose-400 text-white rounded-full flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-[0_15px_40px_-10px_rgba(244,63,94,0.5)] group -translate-y-2">
                            <svg className="w-9 h-9 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24"><path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z"></path></svg>
                        </button>
                    </div>

                </div>
            )}
        </div>
      </div>
      </div>
    </div>
  );
};

export default Dashboard;
