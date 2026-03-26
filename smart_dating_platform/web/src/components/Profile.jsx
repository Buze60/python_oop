import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import Navigation from './Navigation';

const MEDIA_URL = 'http://localhost:8000/media/';

const INTERESTS_LIST = [
    "Coffee", "Gym", "Anime", "Travel", "Running", "Photography", "Music",
    "Baking", "Dogs", "Cats", "Gaming", "Art", "Movies", "Wine", "Hiking",
    "Reading", "Dancing", "Cooking", "Yoga", "Cycling"
];

const Profile = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    bio: '', birth_date: '', gender: '', location: '', intent: 'casual', interests: [], trust_score: 50, verification_status: 'unverified'
  });
  const [message, setMessage] = useState({ text: '', type: '' });
  const [idPhoto, setIdPhoto] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('users/profile/').then(res => {
        setFormData({
            bio: res.data.bio || '',
            birth_date: res.data.birth_date || '',
            gender: res.data.gender || '',
            location: res.data.location || '',
            intent: res.data.intent || 'casual',
            interests: Array.isArray(res.data.interests) ? res.data.interests : [],
            trust_score: res.data.trust_score || 50,
            verification_status: res.data.verification_status || 'unverified',
            id_photo: res.data.id_photo || null,
        });
    }).catch(console.error);
  }, []);

  const toggleInterest = (interest) => {
      setFormData(prev => {
          const interests = prev.interests.includes(interest)
              ? prev.interests.filter(i => i !== interest)
              : [...prev.interests, interest];
          return { ...prev, interests };
      });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ text: '', type: '' });
    try {
        // If there's a profile photo (id_photo via main update), use multipart
        const form = new FormData();
        form.append('bio', formData.bio);
        form.append('birth_date', formData.birth_date);
        form.append('gender', formData.gender);
        form.append('location', formData.location);
        form.append('intent', formData.intent);
        // Send interests as JSON string since multipart doesn't support arrays natively
        formData.interests.forEach(i => form.append('interests', i));
        
        await api.patch('users/profile/', {
            bio: formData.bio,
            birth_date: formData.birth_date,
            gender: formData.gender,
            location: formData.location,
            intent: formData.intent,
            interests: formData.interests,
        });
        setMessage({ text: '✅ Profile updated successfully!', type: 'success' });
    } catch (err) {
        console.error(err.response?.data || err);
        setMessage({ text: '❌ Failed to update profile. Check all fields and try again.', type: 'error' });
    } finally {
        setSaving(false);
    }
  };

  const handleVerify = async (e) => {
      e.preventDefault();
      if (!idPhoto) return setMessage({ text: 'Please select an ID photo first.', type: 'error' });
      const form = new FormData();
      form.append('id_photo', idPhoto);
      try {
          await api.post('users/profile/verify/', form, { headers: { 'Content-Type': 'multipart/form-data' } });
          setMessage({ text: '✅ Verification submitted! Our team will review it shortly.', type: 'success' });
          setFormData(prev => ({...prev, verification_status: 'pending'}));
      } catch (err) {
          setMessage({ text: '❌ Failed to submit verification.', type: 'error' });
      }
  };

  const avatarSrc = formData.id_photo
      ? (formData.id_photo.startsWith('http') ? formData.id_photo : `${MEDIA_URL}${formData.id_photo}`)
      : `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.bio || 'user'}&backgroundColor=fbbf24`;

  return (
    <div className="h-screen bg-slate-100 text-slate-900 flex font-sans overflow-hidden">
      <Navigation />
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto py-8 px-6 space-y-6">

          {/* Profile Header Card */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="h-32 bg-gradient-to-r from-pink-500 to-rose-400"></div>
              <div className="px-6 pb-6 -mt-10 flex items-end gap-4">
                  <div className="w-20 h-20 rounded-full bg-slate-200 border-4 border-white shadow-lg overflow-hidden shrink-0">
                      <img src={avatarSrc} alt="profile" className="w-full h-full object-cover" />
                  </div>
                  <div className="pb-2 flex-1 flex items-center justify-between flex-wrap gap-2">
                      <div>
                          <p className="font-black text-xl text-slate-800">{formData.bio ? formData.location || 'Your Location' : 'Complete your profile'}</p>
                          <div className="flex items-center gap-2 mt-1">
                              <span className={`text-xs font-black px-3 py-1 rounded-full border ${formData.trust_score >= 80 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : formData.trust_score >= 50 ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                                  Trust Score {formData.trust_score}
                              </span>
                              {formData.verification_status === 'verified' && (
                                  <span className="flex items-center gap-1 text-xs font-bold text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full">
                                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                                      Verified
                                  </span>
                              )}
                              {formData.verification_status === 'pending' && (
                                  <span className="text-xs font-bold text-amber-600 bg-amber-50 border border-amber-100 px-3 py-1 rounded-full">⏳ Pending Review</span>
                              )}
                          </div>
                      </div>
                  </div>
              </div>
          </div>

          {/* Message Banner */}
          {message.text && (
              <div className={`p-4 rounded-2xl font-semibold text-sm ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                  {message.text}
              </div>
          )}

          {/* Profile Edit Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-5">
              <h2 className="text-lg font-black text-slate-800">Edit Your Profile</h2>

              <div>
                  <label className="block text-sm font-bold text-slate-600 mb-2">Bio</label>
                  <textarea value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl px-4 py-3 focus:outline-none focus:border-pink-400 transition-colors font-medium resize-none" rows="3" placeholder="Tell people about yourself..."></textarea>
              </div>

              <div className="grid grid-cols-2 gap-4">
                  <div>
                      <label className="block text-sm font-bold text-slate-600 mb-2">Birth Date</label>
                      <input type="date" value={formData.birth_date} onChange={e => setFormData({...formData, birth_date: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl px-4 py-3 focus:outline-none focus:border-pink-400 transition-colors font-medium" />
                  </div>
                  <div>
                      <label className="block text-sm font-bold text-slate-600 mb-2">Gender</label>
                      <select value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl px-4 py-3 focus:outline-none focus:border-pink-400 transition-colors font-medium">
                          <option value="">Select...</option>
                          <option value="M">Man</option>
                          <option value="F">Woman</option>
                          <option value="O">Non-binary / Other</option>
                      </select>
                  </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                  <div>
                      <label className="block text-sm font-bold text-slate-600 mb-2">Location</label>
                      <input type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl px-4 py-3 focus:outline-none focus:border-pink-400 transition-colors font-medium" placeholder="City or region" />
                  </div>
                  <div>
                      <label className="block text-sm font-bold text-slate-600 mb-2">Dating Intent</label>
                      <select value={formData.intent} onChange={e => setFormData({...formData, intent: e.target.value})} className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl px-4 py-3 focus:outline-none focus:border-pink-400 transition-colors font-medium">
                          <option value="casual">Casual</option>
                          <option value="serious">Serious Relationship</option>
                          <option value="marriage">Marriage</option>
                      </select>
                  </div>
              </div>

              <div>
                  <label className="block text-sm font-bold text-slate-600 mb-3">Interests</label>
                  <div className="flex flex-wrap gap-2">
                      {INTERESTS_LIST.map(interest => {
                          const selected = formData.interests.includes(interest);
                          return (
                              <button type="button" key={interest} onClick={() => toggleInterest(interest)} className={`px-4 py-1.5 rounded-full text-sm font-bold border-2 transition-all ${selected ? 'border-pink-500 bg-pink-500 text-white' : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}>
                                  {interest}
                              </button>
                          );
                      })}
                  </div>
              </div>

              <button type="submit" disabled={saving} className={`w-full py-4 rounded-2xl font-black text-lg transition-all ${saving ? 'bg-slate-200 text-slate-400' : 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-200 hover:shadow-pink-300 hover:-translate-y-0.5'}`}>
                  {saving ? 'Saving...' : 'Save Profile'}
              </button>
          </form>

          {/* Verification Card */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
              <h2 className="text-lg font-black text-slate-800 mb-1">Account Verification</h2>
              <p className="text-slate-500 text-sm font-medium mb-5">Get a blue badge and +30 Trust Score boost. Submit a clear selfie or ID photo.</p>

              {formData.verification_status === 'verified' && (
                  <div className="p-4 bg-blue-50 text-blue-700 rounded-2xl font-bold border border-blue-100 flex items-center gap-2">
                      <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                      Your account is fully verified!
                  </div>
              )}
              {formData.verification_status === 'pending' && (
                  <div className="p-4 bg-amber-50 text-amber-700 rounded-2xl font-bold border border-amber-100">⏳ Verification is under review. Check back soon!</div>
              )}
              {formData.verification_status === 'rejected' && (
                  <div className="p-4 bg-red-50 text-red-700 rounded-2xl font-bold border border-red-100 mb-4">❌ Your submission was rejected. Please re-submit a clearer photo.</div>
              )}

              {(formData.verification_status === 'unverified' || formData.verification_status === 'rejected') && (
                  <form onSubmit={handleVerify} className="flex gap-3 items-center">
                      <label className="flex-1 cursor-pointer">
                          <div className={`flex items-center gap-3 border-2 ${idPhoto ? 'border-pink-400 bg-pink-50' : 'border-dashed border-slate-300 bg-slate-50'} rounded-2xl px-4 py-3 transition-all`}>
                              <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                              <span className="text-sm font-semibold text-slate-500 truncate">{idPhoto ? idPhoto.name : 'Choose photo...'}</span>
                          </div>
                          <input type="file" accept="image/*" className="hidden" onChange={e => setIdPhoto(e.target.files[0])} />
                      </label>
                      <button type="submit" className="px-6 py-3 bg-slate-800 text-white font-bold rounded-2xl hover:bg-slate-700 transition-colors shadow-sm whitespace-nowrap">Submit ID</button>
                  </form>
              )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;
