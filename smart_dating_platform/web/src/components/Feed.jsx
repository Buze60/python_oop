import React, { useState, useEffect } from 'react';
import Navigation from './Navigation';
import api from '../api';

const MEDIA_URL = 'http://localhost:8000/media/';

const getAvatar = (user) => {
    if (user?.profile?.id_photo) return `${MEDIA_URL}${user.profile.id_photo}`;
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username}&backgroundColor=fbbf24,f472b6,818cf8`;
};

const timeAgo = (dateStr) => {
    const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff/60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff/3600)}h ago`;
    return `${Math.floor(diff/86400)}d ago`;
};

const Feed = () => {
    const [posts, setPosts] = useState([]);
    const [content, setContent] = useState('');
    const [image, setImage] = useState(null);
    const [me, setMe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [posting, setPosting] = useState(false);
    const [expandedComments, setExpandedComments] = useState({});
    const [commentInputs, setCommentInputs] = useState({});

    useEffect(() => {
        Promise.all([api.get('posts/'), api.get('users/profile/')])
            .then(([postsRes, meRes]) => {
                setPosts(postsRes.data);
                setMe(meRes.data);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const refreshPosts = async () => {
        const res = await api.get('posts/');
        setPosts(res.data);
    };

    const handlePost = async (e) => {
        e.preventDefault();
        if (!content.trim() && !image) return;
        setPosting(true);
        try {
            const form = new FormData();
            form.append('content', content);
            if (image) form.append('image', image);
            await api.post('posts/', form, { headers: { 'Content-Type': 'multipart/form-data' } });
            setContent('');
            setImage(null);
            await refreshPosts();
        } catch (err) {
            console.error(err);
        } finally {
            setPosting(false);
        }
    };

    const handleLike = async (postId) => {
        try {
            await api.post(`posts/${postId}/like/`);
            await refreshPosts();
        } catch (err) { console.error(err); }
    };

    const handleDelete = async (postId) => {
        try {
            await api.delete(`posts/${postId}/`);
            setPosts(p => p.filter(post => post.id !== postId));
        } catch (err) { console.error(err); }
    };

    const handleComment = async (postId) => {
        const text = commentInputs[postId];
        if (!text?.trim()) return;
        try {
            await api.post(`posts/${postId}/comments/`, { content: text });
            setCommentInputs(prev => ({ ...prev, [postId]: '' }));
            await refreshPosts();
        } catch (err) { console.error(err); }
    };

    return (
        <div className="h-screen bg-slate-100 flex font-sans overflow-hidden">
            <Navigation />
            <div className="flex-1 overflow-y-auto">
                <div className="max-w-2xl mx-auto py-6 px-4 space-y-5">

                    {/* Compose Box */}
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-5">
                        <div className="flex gap-3 items-start">
                            <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-200 shrink-0">
                                <img src={getAvatar({ username: me?.username, profile: me })} alt="me" className="w-full h-full object-cover" />
                            </div>
                            <form onSubmit={handlePost} className="flex-1">
                                <textarea
                                    value={content}
                                    onChange={e => setContent(e.target.value)}
                                    placeholder="Share something with the community..."
                                    className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl px-4 py-3 text-sm font-medium resize-none focus:outline-none focus:border-pink-400 transition-colors"
                                    rows="3"
                                />
                                <div className="flex items-center justify-between mt-3">
                                    <label className="flex items-center gap-2 text-slate-500 text-sm font-semibold cursor-pointer hover:text-pink-500 transition-colors">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                        {image ? image.name : 'Photo'}
                                        <input type="file" className="hidden" accept="image/*" onChange={e => setImage(e.target.files[0])} />
                                    </label>
                                    <button type="submit" disabled={(!content.trim() && !image) || posting} className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${(!content.trim() && !image) ? 'bg-slate-100 text-slate-300' : 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md shadow-pink-200 hover:shadow-pink-300'}`}>
                                        {posting ? 'Posting...' : 'Post'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Feed */}
                    {loading ? (
                        <div className="flex justify-center py-10">
                            <div className="w-10 h-10 border-4 border-pink-100 border-t-pink-500 rounded-full animate-spin"></div>
                        </div>
                    ) : posts.length === 0 ? (
                        <div className="text-center py-20 text-slate-400">
                            <div className="text-4xl mb-3">✨</div>
                            <p className="font-bold text-lg">No posts yet. Be the first!</p>
                        </div>
                    ) : posts.map(post => (
                        <div key={post.id} className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                            {/* Post Header */}
                            <div className="flex items-center justify-between px-5 pt-5 pb-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-200">
                                        <img src={getAvatar(post.author)} alt={post.author.username} className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-1.5">
                                            <span className="font-bold text-slate-800 text-sm">{post.author.username}</span>
                                            {post.author.profile?.verification_status === 'verified' && (
                                                <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                                            )}
                                        </div>
                                        <p className="text-xs text-slate-400 font-medium">{timeAgo(post.created_at)}</p>
                                    </div>
                                </div>
                                {post.author.username === me?.username && (
                                    <button onClick={() => handleDelete(post.id)} className="p-2 text-slate-300 hover:text-red-400 transition-colors rounded-full hover:bg-red-50">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                    </button>
                                )}
                            </div>

                            {/* Post Content */}
                            <div className="px-5 pb-4">
                                <p className="text-slate-700 text-[15px] leading-relaxed font-medium">{post.content}</p>
                            </div>

                            {/* Post Image */}
                            {post.image && (
                                <div className="w-full">
                                    <img src={`${MEDIA_URL}${post.image}`} alt="post" className="w-full max-h-96 object-cover" />
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex items-center gap-1 px-4 py-3 border-t border-slate-50">
                                <button onClick={() => handleLike(post.id)} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all ${post.is_liked ? 'text-pink-500 bg-pink-50' : 'text-slate-500 hover:bg-slate-50'}`}>
                                    <svg className="w-5 h-5" fill={post.is_liked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                                    {post.likes_count > 0 && post.likes_count}
                                </button>
                                <button onClick={() => setExpandedComments(prev => ({ ...prev, [post.id]: !prev[post.id] }))} className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold text-slate-500 hover:bg-slate-50 transition-all">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                                    {post.comments_count > 0 && post.comments_count}
                                </button>
                            </div>

                            {/* Comments */}
                            {expandedComments[post.id] && (
                                <div className="px-5 pb-4 space-y-3 border-t border-slate-50 pt-3">
                                    {post.comments.map(c => (
                                        <div key={c.id} className="flex gap-2">
                                            <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-200 shrink-0">
                                                <img src={getAvatar(c.author)} alt={c.author.username} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="bg-slate-50 rounded-2xl px-3 py-2 flex-1">
                                                <span className="font-bold text-xs text-slate-700">{c.author.username} </span>
                                                <span className="text-sm text-slate-600 font-medium">{c.content}</span>
                                            </div>
                                        </div>
                                    ))}
                                    <div className="flex gap-2 mt-2">
                                        <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-200 shrink-0">
                                            <img src={getAvatar({ username: me?.username, profile: me })} alt="me" className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 flex gap-2">
                                            <input type="text" value={commentInputs[post.id] || ''} onChange={e => setCommentInputs(prev => ({ ...prev, [post.id]: e.target.value }))} onKeyDown={e => e.key === 'Enter' && handleComment(post.id)} placeholder="Write a comment..." className="flex-1 bg-slate-50 border border-slate-200 rounded-full px-4 py-1.5 text-sm focus:outline-none focus:border-pink-400 font-medium" />
                                            <button onClick={() => handleComment(post.id)} className="px-4 py-1.5 bg-pink-500 text-white text-xs font-bold rounded-full hover:bg-pink-600 transition-colors">Post</button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Feed;
