import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, auth, storage } from '../services/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const CreateBlog = () => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [bannerImage, setBannerImage] = useState(null);
    const [bannerUrl, setBannerUrl] = useState('');
    const [author, setAuthor] = useState(''); // New state for author name
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleCreateBlog = async (e) => {
        e.preventDefault();
        if (!title || !content || !bannerImage || !author) { // Include author in validation
            setError('Title, content, banner image, and author are required.');
            return;
        }
        setLoading(true);

        try {
            // Upload banner image to Firebase Storage
            const bannerRef = ref(storage, `banners/${auth.currentUser.uid}_${Date.now()}`);
            await uploadBytes(bannerRef, bannerImage);
            const imageUrl = await getDownloadURL(bannerRef);

            // Save blog details in Firestore
            await addDoc(collection(db, 'blogs'), {
                title,
                content,
                bannerUrl: imageUrl,
                authorId: auth.currentUser.uid,
                authorName:author ,
                author, // Save author name in the document
                createdAt: Timestamp.now(),
                likes: 0,
            });

            navigate('/'); // Redirect to home after creating the blog
        } catch (err) {
            console.error('Error creating blog:', err);
            setError('Failed to create blog.');
        } finally {
            setLoading(false);
        }
    };

    const handleBannerChange = (e) => {
        if (e.target.files[0]) {
            setBannerImage(e.target.files[0]);
            setBannerUrl(URL.createObjectURL(e.target.files[0])); // Preview image
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-3xl font-extrabold mb-6 text-center text-blue-700 drop-shadow-md">
                Create Blog
            </h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}

            <form onSubmit={handleCreateBlog}>
                {/* Title Input */}
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-2 border rounded mb-2"
                    required
                />

                {/* Author Input */}
                <input
                    type="text"
                    placeholder="Author Name"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full p-2 border rounded mb-2"
                    required
                />

                {/* Banner Image Upload */}
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleBannerChange}
                    className="w-full p-2 border rounded mb-4"
                    required
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
                            [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
                            [{ size: [] }],
                            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                            [{'list': 'ordered'}, {'list': 'bullet'}],
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
                    className="mb-4"
                    style={{ height: '250px' }} // Set height for the editor
                />

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2 bg-blue-500 text-white rounded mt-10"
                >
                    {loading ? 'Publishing...' : 'Publish Blog'}
                </button>
            </form>
        </div>
    );
};

export default CreateBlog;