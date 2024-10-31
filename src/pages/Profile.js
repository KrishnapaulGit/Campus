// src/pages/Profile.js

import React, { useEffect, useState } from 'react';
import { auth, db, storage } from '../services/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const Profile = () => {
    const user = auth.currentUser;
    const [name, setName] = useState('');
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [signupTime, setSignupTime] = useState('');
    const [isEditing, setIsEditing] = useState(false); // State to toggle editing

    useEffect(() => {
        const fetchUserData = async () => {
            if (user) {
                const userDoc = await getDoc(doc(db, 'users', user.uid));
                if (userDoc.exists()) {
                    const data = userDoc.data();
                    setName(data.name);
                    setSignupTime(new Date(data.createdAt.seconds * 1000).toLocaleString()); // Convert timestamp to string
                }
            }
        };

        fetchUserData();
    }, [user]);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            let imageUrl = null;
            if (file) {
                const storageRef = ref(storage, `profileImages/${user.uid}`);
                await uploadBytes(storageRef, file);
                imageUrl = await getDownloadURL(storageRef); // Get the image URL
            }

            // Update Firestore document
            await setDoc(doc(db, 'users', user.uid), { 
                name, 
                ...(imageUrl && { photoURL: imageUrl }), // Only include photoURL if imageUrl is not null
            }, { merge: true });
            
            alert('Profile updated successfully!');
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Error updating profile: ' + error.message);
        } finally {
            setLoading(false);
            setIsEditing(false); // Hide input fields after update
        }
    };

    return (
        <div className="flex flex-col items-center mb-4 p-4 border rounded-lg bg-gray-100">
            <h2 className="text-xl font-semibold">User Profile</h2>
            <img
                src={user?.photoURL || 'https://static.vecteezy.com/system/resources/previews/019/879/186/non_2x/user-icon-on-transparent-background-free-png.png'}
                alt="User"
                className="h-32 w-32 rounded-full mb-4"
            />
            <p className="mt-2"><strong>Name:</strong> {name}</p>
            <p className="mt-2"><strong>Email:</strong> {user?.email}</p>
            <p className="mt-2"><strong>Signed Up On:</strong> {signupTime}</p>
            {!isEditing ? (
                <button
                    onClick={() => setIsEditing(true)}
                    className="bg-blue-500 text-white p-2 rounded mt-4"
                >
                    Update Profile
                </button>
            ) : (
                <form onSubmit={handleSubmit} className="flex flex-col items-center mt-4">
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Update Name"
                        className="mb-2 p-2 border rounded"
                        required
                    />
                    <input
                        type="file"
                        onChange={handleFileChange}
                        className="mb-2"
                        accept="image/*" // Allow only images
                    />
                    <button type="submit" disabled={loading} className="bg-green-500 text-white p-2 rounded">
                        {loading ? 'Updating...' : 'Update Now'}
                    </button>
                    <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="bg-gray-300 text-black p-2 rounded mt-2"
                    >
                        Cancel
                    </button>
                </form>
            )}
        </div>
    );
};

export default Profile;
