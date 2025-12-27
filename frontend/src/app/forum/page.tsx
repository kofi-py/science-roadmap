'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { forumAPI } from '../../lib/api';

// Types
interface Category {
    id: number;
    name: string;
    icon: string;
    description?: string;
}

interface Post {
    id: number;
    title: string;
    content: string;
    author: string;
    category_name: string;
    views: number;
    reply_count: number;
    created_at: string;
}

export default function ForumPage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // New Post Form State
    const [newTitle, setNewTitle] = useState('');
    const [newContent, setNewContent] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<number>(1);
    const [anonUsername, setAnonUsername] = useState('');
    const [anonEmail, setAnonEmail] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [postsData, categoriesData] = await Promise.all([
                forumAPI.getPosts(),
                forumAPI.getCategories()
            ]);

            // Handle pagination wrapper if it exists (the API returns { posts: [], pagination: {} })
            setPosts(postsData.posts || postsData);
            setCategories(categoriesData);
        } catch (error) {
            console.error('Failed to fetch forum data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreatePost = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Note: The API might expect username/email for anonymous posts if not logged in.
            // For now, we'll try to create it. If it fails with 401, we might need to handle auth better.
            // But per previous context, existing auth works via cookies.

            await forumAPI.createPost(newTitle, newContent, selectedCategory);

            setIsModalOpen(false);
            setNewTitle('');
            setNewContent('');
            // Refresh posts
            fetchData();
        } catch (error) {
            console.error('Failed to create post:', error);
            alert('Failed to post. Please ensure you are logged in or provide valid details.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-4xl font-bold text-space-blue-900">community forum</h1>
                        <p className="text-gray-600 mt-2">connect with fellow science enthusiasts</p>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="btn-primary"
                    >
                        + new discussion
                    </button>
                </div>

                <div className="grid lg:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                            <h2 className="font-bold text-lg mb-4">categories</h2>
                            <div className="space-y-2">
                                {categories.map((cat) => (
                                    <div key={cat.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors group">
                                        <div className="flex items-center gap-3">
                                            <span className="text-xl">{cat.icon}</span>
                                            <span className="font-medium text-gray-700 group-hover:text-electric-cyan-600">{cat.name}</span>
                                        </div>
                                    </div>
                                ))}
                                {categories.length === 0 && !loading && (
                                    <div className="text-gray-400 text-sm">No categories found</div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                                <h2 className="font-bold text-lg">recent discussions</h2>
                            </div>

                            <div className="divide-y divide-gray-100">
                                {loading ? (
                                    <div className="p-8 text-center text-gray-500">loading discussions...</div>
                                ) : posts.length === 0 ? (
                                    <div className="p-8 text-center text-gray-500">no discussions yet. be the first to post!</div>
                                ) : (
                                    posts.map((post) => (
                                        <Link key={post.id} href={`/forum/post/${post.id}`}>
                                            <div className="p-6 hover:bg-gray-50 transition-colors cursor-pointer block">
                                                <div className="flex items-start gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-electric-cyan-400 to-fusion-purple-500 text-white flex items-center justify-center font-bold">
                                                        {(post.author || 'A')[0].toUpperCase()}
                                                    </div>
                                                    <div className="flex-1">
                                                        <h3 className="text-lg font-semibold text-space-blue-900 mb-1 hover:text-electric-cyan-600">
                                                            {post.title}
                                                        </h3>
                                                        <div className="flex items-center gap-4 text-sm text-gray-500">
                                                            <span className="text-electric-cyan-600 font-medium">{post.category_name}</span>
                                                            <span>• posted by {post.author}</span>
                                                            <span>• {new Date(post.created_at).toLocaleDateString()}</span>
                                                        </div>
                                                    </div>
                                                    <div className="text-center min-w-[60px]">
                                                        <div className="text-xl font-bold text-gray-700">{post.reply_count || 0}</div>
                                                        <div className="text-xs text-gray-500">replies</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Create Post Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-space-blue-900">start new discussion</h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleCreatePost} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">title</label>
                                <input
                                    type="text"
                                    required
                                    value={newTitle}
                                    onChange={(e) => setNewTitle(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-electric-cyan-500 outline-none transition-all"
                                    placeholder="what's on your mind?"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">category</label>
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(Number(e.target.value))}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-electric-cyan-500 outline-none transition-all"
                                >
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">content</label>
                                <textarea
                                    required
                                    value={newContent}
                                    onChange={(e) => setNewContent(e.target.value)}
                                    rows={4}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-electric-cyan-500 outline-none transition-all"
                                    placeholder="describe your question or topic..."
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-50 rounded-lg transition-colors"
                                >
                                    cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn-primary px-6 py-2"
                                >
                                    post discussion
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
