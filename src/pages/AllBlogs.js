// src/pages/AllBlogs.js

import React, { useEffect, useState } from 'react';
import { db } from '../services/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import Footer from './Footer';
import { GrLike } from "react-icons/gr";
import { FaRegCommentDots } from "react-icons/fa";


const AllBlogs = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'blogs'));
                const blogsData = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setBlogs(blogsData);
            } catch (err) {
                console.error('Error fetching blogs:', err);
                setError('Failed to load blogs.');
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, []);

    return (
        <><div className="flex flex-col items-center p-8 bg-gray-100 min-h-screen">
            {/* Stylish Header */}
            <h2 className="text-3xl font-extrabold mb-6 text-center text-blue-700 drop-shadow-md">
                All Blogs
            </h2>

            {loading ? (
                <p className="text-center text-xl">Loading...</p>
            ) : error ? (
                <p className="text-center text-red-500">{error}</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
                    {blogs.map((blog) => (
                        <Link
                            to={`/blogs/${blog.id}`}
                            key={blog.id}
                            className="block bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow overflow-hidden"
                        >
                            {/* Blog Banner */}
                            {blog.bannerUrl && (
                                <div className="overflow-hidden h-48">
                                    <img
                                        src={blog.bannerUrl}
                                        alt="Blog Banner"
                                        className="w-full h-full object-cover transition-transform duration-300 transform hover:scale-105" />
                                </div>
                            )}
                            <div className="p-5">
                                <h3 className="text-xl font-semibold mb-2">{blog.title}</h3>
                                <p className="text-gray-600 mb-4">
                                    {blog.content.replace(/<[^>]+>/g, '').substring(0, 100)}...
                                </p>
                                <p className="text-sm text-gray-500">Author: {blog.authorName}</p>
                                <p className="text-sm text-gray-500 mt-3">
                                    Published: {blog.createdAt ? blog.createdAt.toDate().toLocaleDateString() : 'Unknown date'}
                                </p>
                                <span className='flex space-x-10 mt-4'>
                                    <p className="text-sm text-gray-500 flex space-x-3"><GrLike className='mt-1'/>  <p>{blog.likesCount || 0}</p></p> 
                                    <p className="text-sm text-gray-500 flex space-x-3"><FaRegCommentDots className='mt-1'/>  <p>{blog.commentsCount || 0}</p></p> 
                                    </span>

                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div><Footer /></>

    );
};

export default AllBlogs;
