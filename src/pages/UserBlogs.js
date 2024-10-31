import React, { useEffect, useState } from 'react';
import { db } from '../services/firebase';
import { collection, query, where, onSnapshot, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { auth } from '../services/firebase';
import { useNavigate } from 'react-router-dom';
import DOMPurify from 'dompurify';

const UserBlogs = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const user = auth.currentUser;
        if (!user) {
            setLoading(false);
            return;
        }

        const userId = user.uid;
        const q = query(collection(db, 'blogs'), where('authorId', '==', userId));

        const unsubscribe = onSnapshot(q, async (querySnapshot) => {
            const blogsData = await Promise.all(
                querySnapshot.docs.map(async (doc) => {
                    const blogData = { id: doc.id, ...doc.data() };

                    // Fetch comments count for each blog
                    const commentsQuery = query(
                        collection(db, 'comments'),
                        where('blogId', '==', doc.id)
                    );
                    const commentsSnapshot = await getDocs(commentsQuery);
                    blogData.commentsCount = commentsSnapshot.size; // Set comments count

                    return blogData;
                })
            );

            setBlogs(blogsData);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching blogs: ", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this blog?");
        if (confirmDelete) {
            try {
                await deleteDoc(doc(db, 'blogs', id));
            } catch (error) {
                console.error("Error deleting blog: ", error);
            }
        }
    };

    const handleEdit = (id) => {
        navigate(`/edit-blog/${id}`);
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div className="mt-4">
            <h2 className="text-3xl font-extrabold mb-6 text-center text-blue-700 drop-shadow-md">
                Your Posts
            </h2>
            {blogs.length > 0 ? (
                blogs.map((blog) => (
                    <div key={blog.id} className="mb-2 p-2 border rounded bg-white">
                        <h3 className="font-bold">{blog.title}</h3>
                        {/* Sanitize content */}
                        <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(blog.content) }} />
                        <p><strong>Likes:</strong> {blog.likesCount || 0}</p>
                        <p><strong>Comments:</strong> {blog.commentsCount || 0}</p>
                        <button onClick={() => handleEdit(blog.id)} className="mr-2 text-blue-500">Edit</button>
                        <button onClick={() => handleDelete(blog.id)} className="text-red-500">Delete</button>
                    </div>
                ))
            ) : (
                <p>No blogs found.</p>
            )}
        </div>
    );
};

export default UserBlogs;
