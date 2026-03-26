import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const INITIALL_INTERESTS = [
    "Coffee", "Gym", "Anime", "Travel", "Running", "Photography", "Music",
    "Baking", "Dogs", "Cats", "Gaming", "Art", "Movies", "Wine"
];

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const totalSteps = 6;
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
      bio: '', birth_date: '', gender: '', location: '', intent: '', interests: []
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
     // Fetch existing if they partially filled it
     api.get('users/profile/').then(res => {
         if (res.data) {
             setFormData({
                 bio: res.data.bio || '',
                 birth_date: res.data.birth_date || '',
                 gender: res.data.gender || '',
                 location: res.data.location || '',
                 intent: res.data.intent || '',
                 interests: res.data.interests || []
             });
         }
     }).catch(() => {});
  }, []);

  const handleNext = () => {
      if (step < totalSteps) setStep(step + 1);
      else handleSubmit();
  };

  const handleBack = () => {
      if (step > 1) setStep(step - 1);
  };

  const toggleInterest = (interest) => {
      setFormData(prev => {
          const interests = prev.interests.includes(interest) 
            ? prev.interests.filter(i => i !== interest)
            : [...prev.interests, interest];
          return { ...prev, interests };
      });
  };

  const handleSubmit = async () => {
      setLoading(true);
      try {
          await api.put('users/profile/', formData);
          navigate('/dashboard');
      } catch (err) {
          console.error(err);
      } finally {
          setLoading(false);
      }
  };

  const canProceed = () => {
      if (step === 2) return formData.birth_date !== '';
      if (step === 3) return formData.gender !== '';
      if (step === 4) return formData.intent !== '';
      if (step === 5) return formData.location.trim().length > 1;
      return true;
  };

  const renderStepContent = () => {
      switch (step) {
          case 1:
              return (
                  <div className="animate-[fade-in_0.3s_ease-out]">
                      <div className="w-16 h-16 bg-pink-100 text-pink-500 rounded-full flex items-center justify-center mb-6">
                            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                      </div>
                      <h2 className="text-3xl font-black mb-4">Welcome to SmartDating.</h2>
                      <p className="text-slate-500 text-lg mb-8 font-medium">Please follow these House Rules.</p>
                      
                      <div className="space-y-6">
                          <div>
                              <h3 className="font-bold text-lg">Be yourself.</h3>
                              <p className="text-slate-500">Make sure your photos, age, and bio are true to who you are.</p>
                          </div>
                          <div>
                              <h3 className="font-bold text-lg">Stay safe.</h3>
                              <p className="text-slate-500">Don't be too quick to give out personal information.</p>
                          </div>
                          <div>
                              <h3 className="font-bold text-lg">Play it cool.</h3>
                              <p className="text-slate-500">Respect others and treat them as you would like to be treated.</p>
                          </div>
                          <div>
                              <h3 className="font-bold text-lg">Be proactive.</h3>
                              <p className="text-slate-500">Always report bad behavior.</p>
                          </div>
                      </div>
                  </div>
              );
          case 2:
              return (
                  <div className="animate-[fade-in_0.3s_ease-out]">
                      <h2 className="text-3xl font-black mb-8">My birthday is</h2>
                      <input type="date" value={formData.birth_date} onChange={e => setFormData({...formData, birth_date: e.target.value})} className="w-full text-2xl font-bold border-b-2 border-slate-300 focus:border-pink-500 pb-2 bg-transparent outline-none transition-colors" />
                      <p className="text-sm text-slate-500 mt-4 font-medium">Your age will be public.</p>
                  </div>
              );
          case 3:
              return (
                  <div className="animate-[fade-in_0.3s_ease-out]">
                      <h2 className="text-3xl font-black mb-8">I am a</h2>
                      <div className="space-y-4">
                          {['M', 'F', 'O'].map((g) => (
                              <button key={g} onClick={() => setFormData({...formData, gender: g})}
                                  className={`w-full py-4 px-6 rounded-full border-2 font-bold text-lg transition-all text-left ${formData.gender === g ? 'border-pink-500 text-pink-500 bg-pink-50' : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}>
                                  {g === 'M' ? 'Man' : g === 'F' ? 'Woman' : 'Non-binary / Other'}
                                  {formData.gender === g && (
                                      <svg className="w-6 h-6 float-right" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                                  )}
                              </button>
                          ))}
                      </div>
                  </div>
              );
          case 4:
              return (
                  <div className="animate-[fade-in_0.3s_ease-out]">
                      <h2 className="text-3xl font-black mb-8">Looking for</h2>
                      <div className="space-y-4">
                          {[
                              { id: 'casual', label: 'Casual', desc: 'Just want to meet new people' },
                              { id: 'serious', label: 'Serious', desc: 'Looking for a relationship' },
                              { id: 'marriage', label: 'Marriage', desc: 'Looking to settle down' }
                          ].map((i) => (
                              <button key={i.id} onClick={() => setFormData({...formData, intent: i.id})}
                                  className={`w-full py-4 px-6 rounded-3xl border-2 transition-all text-left ${formData.intent === i.id ? 'border-pink-500 bg-pink-50' : 'border-slate-200 hover:border-slate-300'}`}>
                                  <div className={`font-bold text-lg ${formData.intent === i.id ? 'text-pink-600' : 'text-slate-800'}`}>{i.label}</div>
                                  <div className={`text-sm mt-1 ${formData.intent === i.id ? 'text-pink-500' : 'text-slate-500'}`}>{i.desc}</div>
                              </button>
                          ))}
                      </div>
                  </div>
              );
          case 5:
              return (
                  <div className="animate-[fade-in_0.3s_ease-out]">
                      <h2 className="text-3xl font-black mb-8">My location is</h2>
                      <input type="text" placeholder="City or region" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full text-2xl font-bold border-b-2 border-slate-300 focus:border-pink-500 pb-2 bg-transparent outline-none transition-colors" />
                      <p className="text-sm text-slate-500 mt-4 font-medium">This helps us find matches nearby.</p>
                  </div>
              );
          case 6:
              return (
                  <div className="animate-[fade-in_0.3s_ease-out] flex flex-col h-[50vh]">
                      <h2 className="text-3xl font-black mb-2">Interests</h2>
                      <p className="text-slate-500 text-sm mb-6 font-medium">Select a few of your interests to let everyone know what you're passionate about.</p>
                      <div className="flex-1 overflow-y-auto">
                          <div className="flex flex-wrap gap-3">
                              {INITIALL_INTERESTS.map(interest => {
                                  const isSelected = formData.interests.includes(interest);
                                  return (
                                      <button key={interest} onClick={() => toggleInterest(interest)}
                                          className={`px-5 py-2 rounded-full border-2 font-bold text-sm transition-all ${isSelected ? 'border-pink-500 bg-pink-500 text-white shadow-md shadow-pink-200' : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}>
                                          {interest}
                                      </button>
                                  );
                              })}
                          </div>
                      </div>
                  </div>
              );
          default:
              return null;
      }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col text-slate-800 font-sans">
      {/* Progress Header */}
      <div className="w-full px-6 pt-8 pb-4">
          <div className="flex items-center gap-4">
              {step > 1 ? (
                  <button onClick={handleBack} className="p-2 -ml-2 text-slate-400 hover:text-slate-700 transition-colors">
                      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"></path></svg>
                  </button>
              ) : <div className="w-11"></div>}
              <div className="flex-1 flex gap-1.5 h-1.5">
                  {Array.from({ length: totalSteps }).map((_, i) => (
                      <div key={i} className={`flex-1 rounded-full transition-all duration-300 ${i < step ? 'bg-pink-500' : 'bg-slate-100'}`}></div>
                  ))}
              </div>
              <div className="w-11 text-right text-xs font-bold text-slate-400">
                  {step}/{totalSteps}
              </div>
          </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-md mx-auto px-6 py-6 flex flex-col">
          <div className="flex-1 relative">
             {renderStepContent()}
          </div>
          
          {/* Bottom Action Area */}
          <div className="pb-8 pt-4">
              <button 
                  onClick={handleNext} 
                  disabled={!canProceed() || loading}
                  className={`w-full py-4 rounded-full font-black text-lg transition-all shadow-lg active:scale-95 ${!canProceed() ? 'bg-slate-100 text-slate-300 shadow-none pointer-events-none' : 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-pink-200 hover:shadow-pink-300'}`}>
                  {step === 1 ? 'I Agree' : step === totalSteps ? (loading ? 'Saving...' : 'Finish Setup') : 'Continue'}
              </button>
          </div>
      </main>
    </div>
  );
};

export default Onboarding;
