import React, { useEffect, useState } from 'react';
import { db, auth, storage } from '../services/firebase';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const EditBlog = () => {
    const { id } = useParams(); // Get the blog ID from the URL
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [bannerImage, setBannerImage] = useState(null);
    const [bannerUrl, setBannerUrl] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate(); // Hook for navigation

    useEffect(() => {
        const fetchBlog = async () => {
            const blogRef = doc(db, 'blogs', id);
            const blogSnap = await getDoc(blogRef);

            if (blogSnap.exists()) {
                const blogData = blogSnap.data();
                setTitle(blogData.title);
                setContent(blogData.content);
                setBannerUrl(blogData.bannerUrl); // Set existing banner URL
            } else {
                setError('Blog not found');
            }
            setLoading(false);
        };

        fetchBlog();
    }, [id]);

    const handleUpdateBlog = async (e) => {
        e.preventDefault();
        if (!title || !content) {
            setError('Title and content are required.');
            return;
        }

        try {
            let imageUrl = bannerUrl; // Default to the existing banner URL

            // If a new banner image is selected, upload it
            if (bannerImage) {
                const bannerRef = ref(storage, `banners/${auth.currentUser.uid}_${Date.now()}`);
                await uploadBytes(bannerRef, bannerImage);
                imageUrl = await getDownloadURL(bannerRef);
            }

            const blogRef = doc(db, 'blogs', id);
            await updateDoc(blogRef, {
                title,
                content,
                bannerUrl: imageUrl, // Update the banner URL
            });
            navigate('/'); // Redirect to home after updating the blog
        } catch (err) {
            console.error('Error updating blog:', err);
            setError('Failed to update blog.');
        }
    };

    const handleBannerChange = (e) => {
        if (e.target.files[0]) {
            setBannerImage(e.target.files[0]);
            setBannerUrl(URL.createObjectURL(e.target.files[0])); // Preview the new image
        }
    };

    if (loading) {
        return <p>Loading...</p>; // Show loading state
    }

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-3xl font-extrabold mb-6 text-center text-blue-700 drop-shadow-md">
                Edit Blog
            </h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}

            <form onSubmit={handleUpdateBlog}>
                {/* Title Input */}
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-2 border rounded mb-2"
                    required
                />

                {/* Banner Image Upload */}
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleBannerChange}
                    className="w-full p-2 border rounded mb-4"
                />

                {/* Banner Image Preview */}
                {bannerUrl && (
                    <img
                        src={bannerUrl}
                        alt="Banner Preview"
                        className="w-full h-48 object-cover rounded mb-4"
                    />
                )}

                {/* React Quill Editor for Content */}
                <ReactQuill
                    theme="snow"
                    value={content}
                    onChange={setContent}
                    modules={{
                        toolbar: [
                            [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
                            [{ size: [] }],
                            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                            ['link', 'image'],
                            ['clean']
                        ],
                    }}
                    formats={[
                        'header', 'font', 'size',
                        'bold', 'italic', 'underline', 'strike', 'blockquote',
                        'list', 'bullet',
                        'link', 'image'
                    ]}
                    className=""
                    style={{ height: '300px' }} // Adjust height as needed
                />

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full py-2  bg-blue-500 text-white rounded mt-36 md:mt-20"
                >
                    Update Blog
                </button>
            </form>
        </div>
    );
};

export default EditBlog;
