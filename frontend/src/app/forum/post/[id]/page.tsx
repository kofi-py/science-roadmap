'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { forumAPI } from '../../../../lib/api';

// Types (should ideally be shared, but defining here for speed)
interface Post {
    id: number;
    title: string;
    content: string;
    author: string;
    category_name: string;
    category_icon?: string;
    views: number;
    created_at: string;
}

interface Reply {
    id: number;
    content: string;
    author: string;
    helpful_count: number;
    created_at: string;
    marked_helpful_by_user: boolean;
}

export default function SinglePostPage() {
    const params = useParams();
    const postId = Number(params.id);

    const [post, setPost] = useState<Post | null>(null);
    const [replies, setReplies] = useState<Reply[]>([]);
    const [loading, setLoading] = useState(true);
    const [replyContent, setReplyContent] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (postId) {
            fetchPostDetails();
        }
    }, [postId]);

    const fetchPostDetails = async () => {
        try {
            setLoading(true);
            const data = await forumAPI.getPost(postId);
            setPost(data.post);
            setReplies(data.replies);
        } catch (error) {
            console.error('Failed to fetch post:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitReply = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!replyContent.trim()) return;

        try {
            setSubmitting(true);
            await forumAPI.createReply(postId, replyContent);
            setReplyContent('');
            // Refresh replies
            fetchPostDetails();
        } catch (error) {
            console.error('Failed to submit reply:', error);
            alert('Failed to reply. Please ensure you are logged in.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleLike = async (replyId: number) => {
        try {
            const result = await forumAPI.markHelpful(replyId);
            // Optimistically update UI or refresh
            setReplies(currentReplies => currentReplies.map(reply => {
                if (reply.id === replyId) {
                    const isNowLiked = result.action === 'added';
                    return {
                        ...reply,
                        marked_helpful_by_user: isNowLiked,
                        helpful_count: isNowLiked ? reply.helpful_count + 1 : reply.helpful_count - 1
                    };
                }
                return reply;
            }));
        } catch (error) {
            console.error('Failed to like reply:', error);
            alert('Please log in to vote!');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-gray-500">loading discussion...</div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
                <div className="text-gray-500">post not found</div>
                <Link href="/forum" className="text-electric-cyan-600 hover:underline">
                    ← back to forum
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Back Link */}
                <Link href="/forum" className="text-gray-500 hover:text-electric-cyan-600 transition-colors inline-flex items-center gap-2">
                    ← back to discussions
                </Link>

                {/* Main Post */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-8">
                        <div className="flex items-center gap-3 text-sm text-gray-500 mb-4">
                            <span className="bg-electric-cyan-50 text-electric-cyan-700 px-3 py-1 rounded-full font-medium flex items-center gap-2">
                                {post?.category_icon} {post?.category_name}
                            </span>
                            <span>• posted by {post?.author}</span>
                            <span>• {post?.created_at ? new Date(post.created_at).toLocaleDateString() : ''}</span>
                        </div>

                        <h1 className="text-3xl font-bold text-space-blue-900 mb-6 lowercase">{post?.title}</h1>

                        <div className="prose max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
                            {post?.content}
                        </div>
                    </div>
                </div>

                {/* Replies Section */}
                <div className="space-y-6">
                    <h2 className="text-xl font-bold text-space-blue-900 px-2 lowercase">
                        {replies.length} replies
                    </h2>

                    {replies.map((reply) => (
                        <div key={reply.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center font-bold text-sm shrink-0">
                                {(reply.author || 'A')[0].toUpperCase()}
                            </div>
                            <div className="flex-1 space-y-2">
                                <div className="flex justify-between items-start">
                                    <div className="font-semibold text-space-blue-900">{reply.author}</div>
                                    <div className="text-xs text-gray-400">
                                        {new Date(reply.created_at).toLocaleDateString()}
                                    </div>
                                </div>
                                <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                                    {reply.content}
                                </div>
                                <div className="pt-2">
                                    <button
                                        onClick={() => handleLike(reply.id)}
                                        className={`flex items-center gap-2 text-sm font-medium transition-colors ${reply.marked_helpful_by_user
                                                ? 'text-red-500 hover:text-red-600'
                                                : 'text-gray-400 hover:text-red-400'
                                            }`}
                                    >
                                        <span className="text-lg">
                                            {reply.marked_helpful_by_user ? '❤️' : '🤍'}
                                        </span>
                                        <span>{reply.helpful_count || 0}</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {replies.length === 0 && (
                        <div className="text-center py-8 text-gray-400 italic">
                            no replies yet. be the first to help!
                        </div>
                    )}
                </div>

                {/* Split line */}
                <hr className="border-gray-200" />

                {/* Reply Form */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-space-blue-900 mb-4 lowercase">leave a reply</h3>
                    <form onSubmit={handleSubmitReply} className="space-y-4">
                        <textarea
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            required
                            rows={4}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-electric-cyan-500 outline-none transition-all placeholder:text-gray-400"
                            placeholder="type your helpful reply here..."
                        />
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="btn-primary px-8 py-2 disabled:opacity-50 disabled:cursor-not-allowed lowercase"
                            >
                                {submitting ? 'posting...' : 'post reply'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
