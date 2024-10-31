import React, { useEffect, useState } from 'react';
import { db } from '../services/firebase';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import Footer from './Footer';
import { GrLike } from "react-icons/gr";
import { FaRegCommentDots } from "react-icons/fa";

const Home = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchLatestBlogs = async () => {
            try {
                const q = query(collection(db, 'blogs'), orderBy('createdAt', 'desc'), limit(4));
                const querySnapshot = await getDocs(q);
                const blogsData = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                    createdAt: doc.data().createdAt?.toDate() || new Date(), // Convert Firestore Timestamp to JS Date
                    likesCount: doc.data().likesCount || 0, // Ensure likes count is fetched
                }));
                setBlogs(blogsData);
            } catch (err) {
                console.error('Error fetching blogs:', err);
                setError('Failed to load blogs.');
            } finally {
                setLoading(false);
            }
        };

        fetchLatestBlogs();
    }, []);

    return (
        <>
        <div className="flex flex-col items-center p-8 bg-gray-100 min-h-screen">
            {/* Welcome Message */}
            <div className="bg-blue-600 text-white text-center py-10 px-5 rounded-lg shadow-md mb-10 w-full max-w-3xl">
                <h1 className="text-4xl font-bold mb-4">Welcome to Campus Blogs!</h1>
                <p className="text-lg">Discover stories, tips, and experiences from students just like you.</p>
            </div>

            {/* Latest Blogs */}
            <div className="w-full max-w-4xl">
                <h2 className="text-3xl font-semibold mb-6 text-center">Latest Blogs</h2>
                {loading ? (
                    <p className="text-center">Loading...</p>
                ) : error ? (
                    <p className="text-center text-red-500">{error}</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {blogs.map((blog) => (
                            <Link
                                to={`/blogs/${blog.id}`} // Navigate to the blog details page using blog ID
                                key={blog.id}
                                className="block bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden"
                            >
                                {blog.bannerUrl && (
                                    <img
                                        src={blog.bannerUrl}
                                        alt="Blog Banner"
                                        className="w-full h-48 object-cover"
                                    />
                                )}
                                <div className="p-5">
                                    <h3 className="text-2xl font-semibold mb-2">{blog.title}</h3>
                                    <p className="text-gray-600 mb-4">
                                        {blog.content.replace(/<[^>]+>/g, '').substring(0, 100)}...
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Published on: {blog.createdAt.toLocaleDateString()}
                                    </p>
                                    <p className="text-sm text-gray-500">Author: {blog.authorName}</p>
                                    <span className='flex space-x-10 mt-4'>
                                    <p className="text-sm text-gray-500 flex space-x-3"><GrLike className='mt-1'/>  <p>{blog.likesCount}</p></p> 
                                    <p className="text-sm text-gray-500 flex space-x-3"><FaRegCommentDots className='mt-1'/>  <p>{blog.commentsCount}</p></p> 
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
                {blogs.length === 0 && !loading && (
                    <p className="text-center text-gray-600 mt-4">No blogs available yet.</p>
                )}
            </div>
        </div>
        <Footer />
        </>
    );
};

export default Home;
