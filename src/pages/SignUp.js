// src/pages/SignUp.js

import React, { useState } from 'react';
import { auth, db } from '../services/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import Footer from './Footer';


const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [message, setMessage] = useState(''); // Added state for email message
    const navigate = useNavigate();

    // Set up Brevo client
    const sendEmail = async (data) => {
        try {
            const response = await fetch('https://api.brevo.com/v3/smtp/email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'api-key': process.env.REACT_APP_BREVO_API_KEY, // Use environment variable for security
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                setMessage('Thank you for signing up to Campus Blogs!');
            } else {
                setMessage('Sign-up successful, but there was an issue sending the email.');
            }
        } catch (error) {
            setMessage('Sign-up successful, but email could not be sent.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        setSuccess(false);
        setMessage('');

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            const createdAt = new Date();

            await setDoc(doc(db, 'users', user.uid), {
                email,
                name,
                createdAt,
                photoURL: '',
            });

            // Prepare email data for Brevo
            const emailData = {
                sender: { name: 'Campus Blogs', email: 'krishhmail01@gmail.com' },
                to: [{ email, name }], // Use state variables directly
                subject: 'Welcome to Campus Blogs!',
                htmlContent: `
                    <html>
                        <body>
                            <p style="font-size:40px; text-align:center;">CAMPUS BLOGS</p> <br>
                            <h1>Welcome, ${name}!</h1>
                            <p>Thank you for joining Campus Blogs. I am excited to have you here!</p>

                            <br>
                            <p>Regards</p>
                            <br>
                            <p>Krishna Paul</p>
                            <br>
                            <p>Campus Blogs</p>
                        </body>
                    </html>`,
            };

            // Send the email using Brevo API
            sendEmail(emailData);

            setSuccess(true);
            setTimeout(() => {
                navigate('/dashboard');
            }, 1000);
        } catch (err) {
            console.error('Sign-up error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <><div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-center">Sign Up</h2>
                {error && <p className="text-red-500 text-center">{error}</p>}
                {success && (
                    <div className="p-4 mb-4 text-green-700 bg-green-100 border border-green-500 rounded">
                        Sign-up successful! Redirecting to dashboard...
                    </div>
                )}
                {message && <p className="text-blue-500 text-center">{message}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300" />
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300" />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300" />
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2 font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none"
                    >
                        {loading ? 'Signing Up...' : 'Sign Up'}
                    </button>
                </form>
                <p className="text-sm text-center text-gray-600">
                    Already have an account?{' '}
                    <a href="/signin" className="text-blue-500 hover:underline">Sign In</a>
                </p>
            </div>
        </div><Footer /></>

    );
};

export default SignUp;
