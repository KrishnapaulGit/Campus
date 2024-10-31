import React, { useEffect, useState } from 'react';
import { db, auth } from '../services/firebase';
import {
    doc,
    getDoc,
    collection,
    query,
    where,
    getDocs,
    Timestamp,
    addDoc,
    updateDoc,
    deleteDoc,
} from 'firebase/firestore';
import { useParams } from 'react-router-dom';
import { FaHeart } from 'react-icons/fa';
import DOMPurify from 'dompurify';

import Footer from './Footer';


const BlogDetail = () => {
    const { id } = useParams();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [userName, setUserName] = useState(''); // Name input
    const [userEmail, setUserEmail] = useState(''); // Email input
    const [editCommentId, setEditCommentId] = useState(null);
    const [user, setUser] = useState(null); 

    useEffect(() => {
        const fetchBlogDetails = async () => {
            try {
                const docRef = doc(db, 'blogs', id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setBlog({
                        id: docSnap.id,
                        ...docSnap.data(),
                        createdAt: docSnap.data().createdAt?.toDate() || new Date(),
                    });
                } else {
                    setError('Blog not found.');
                }
            } catch (err) {
                console.error('Error fetching blog details:', err);
                setError('Failed to load blog details.');
            } finally {
                setLoading(false);
            }
        };

        const fetchComments = async () => {
            try {
                const commentsQuery = query(
                    collection(db, 'comments'),
                    where('blogId', '==', id)
                );
                const commentsSnapshot = await getDocs(commentsQuery);

                const commentsData = commentsSnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                    createdAt: doc.data().createdAt?.toDate() || new Date(),
                }));
                setComments(commentsData);
            } catch (error) {
                console.error('Error fetching comments:', error);
            }
        };

        fetchBlogDetails();
        fetchComments();

        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                setUserName(currentUser.displayName || 'Anonymous');
                setUserEmail(currentUser.email);
            }
        });
        return () => unsubscribe();
    }, [id]);

    const sanitizedContent = blog ? DOMPurify.sanitize(blog.content) : '';

    const handleAddComment = async (e) => {
        e.preventDefault();

        if (!newComment.trim()) {
            alert("Comment cannot be empty.");
            return;
        }

        const commentData = {
            name: userName || 'Anonymous',
            email: userEmail,
            comment: newComment,
            blogId: blog.id,
            userId: user ? user.uid : null, // Only set userId if logged in
            createdAt: Timestamp.now(),
        };

        try {
            const commentRef = await addDoc(collection(db, 'comments'), commentData);
            setComments([...comments, { ...commentData, id: commentRef.id }]);
            await updateDoc(doc(db, 'blogs', blog.id), {
                commentsCount: (blog.commentsCount || 0) + 1,
            });
            setBlog((prevBlog) => ({
                ...prevBlog,
                commentsCount: (prevBlog.commentsCount || 0) + 1,
            }));
            setNewComment('');
            setUserName(''); // Clear name input
            setUserEmail(''); // Clear email input
        } catch (error) {
            console.error("Error adding comment:", error);
        }
    };

    const handleEditComment = (comment) => {
        setEditCommentId(comment.id);
        setNewComment(comment.comment);
    };

    const handleUpdateComment = async (e) => {
        e.preventDefault();
        const commentRef = doc(db, 'comments', editCommentId);
        try {
            await updateDoc(commentRef, { comment: newComment });
            setComments((prevComments) =>
                prevComments.map((c) =>
                    c.id === editCommentId ? { ...c, comment: newComment } : c
                )
            );
            setEditCommentId(null);
            setNewComment('');
        } catch (error) {
            console.error("Error updating comment:", error);
        }
    };

    const handleDeleteComment = async (commentId) => {
        const commentRef = doc(db, 'comments', commentId);
        try {
            await deleteDoc(commentRef);
            setComments((prevComments) => prevComments.filter((c) => c.id !== commentId));
            await updateDoc(doc(db, 'blogs', blog.id), {
                commentsCount: blog.commentsCount - 1,
            });
            setBlog((prevBlog) => ({
                ...prevBlog,
                commentsCount: prevBlog.commentsCount - 1,
            }));
        } catch (error) {
            console.error("Error deleting comment:", error);
        }
    };

    const handleLike = async () => {
        if (blog && user) {
            const newLikesCount = (blog.likesCount || 0) + 1;
            const blogRef = doc(db, 'blogs', blog.id);
            await updateDoc(blogRef, { likesCount: newLikesCount });
            setBlog((prevBlog) => ({ ...prevBlog, likesCount: newLikesCount }));
        }
    };

    return (
        <><div className="container mx-auto p-6 md:p-8">
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : (
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    {blog.bannerUrl && (
                        <img src={blog.bannerUrl} alt="Blog Banner" className="w-full h-auto object-cover mb-4 rounded" />
                    )}
                    <h1 className="text-2xl font-bold mb-4">{blog.title}</h1>
                    <p className="text-gray-600 mb-2">
                        Published on: {blog.createdAt.toLocaleDateString()}
                    </p>
                    <p className="text-gray-600 mb-2">Author: {blog.authorName}</p>
                    <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} />

                    {user && (
                        <button onClick={handleLike} className="flex items-center mt-4">
                            <FaHeart className={`text-red-500 ${blog.likesCount > 0 ? 'animate-pulse' : ''}`} />
                            <span className="ml-2">{blog.likesCount || 0}</span>
                        </button>
                    )}

                    <div className="mt-8">
                        <h2 className="text-2xl font-semibold mb-4">Comments ({blog.commentsCount || 0})</h2>
                        <form onSubmit={editCommentId ? handleUpdateComment : handleAddComment} className="mb-4">
                            <input
                                type="text"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                placeholder="Your Name"
                                className="w-full p-2 border border-gray-300 rounded mb-2"
                                required />
                            <input
                                type="email"
                                value={userEmail}
                                onChange={(e) => setUserEmail(e.target.value)}
                                placeholder="Your Email"
                                className="w-full p-2 border border-gray-300 rounded mb-2"
                                required />
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Add a comment..."
                                className="w-full p-2 border border-gray-300 rounded mb-2"
                                rows="3"
                                required />
                            <button
                                type="submit"
                                className="bg-blue-500 text-white rounded py-2 px-4 hover:bg-blue-600 transition"
                            >
                                {editCommentId ? 'Update Comment' : 'Post Comment'}
                            </button>
                        </form>
                        <div>
                            {comments.length === 0 ? (
                                <p>No comments yet.</p>
                            ) : (
                                comments.map((comment) => (
                                    <div key={comment.id} className="p-2 border-b border-gray-200 mb-2">
                                        <p className="font-semibold">{comment.name || 'Anonymous'}</p>
                                        <p>{comment.comment}</p>
                                        <p>{comment.createdAt.toLocaleString()}</p>
                                        {user && user.uid === comment.userId && (
                                            <>
                                                <button
                                                    onClick={() => handleEditComment(comment)}
                                                    className="text-blue-500 mr-2"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteComment(comment.id)}
                                                    className="text-red-500"
                                                >
                                                    Delete
                                                </button>
                                            </>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div><Footer /></>

    );
};

export default BlogDetail;
