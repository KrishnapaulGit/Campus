import React, { useState } from 'react';
import { auth } from '../services/firebase';
import { sendPasswordResetEmail } from 'firebase/auth';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handlePasswordReset = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        try {
            await sendPasswordResetEmail(auth, email);
            setMessage('Password reset email sent. Check your inbox.');
        } catch (error) {
            console.error("Error sending password reset email:", error);
            setError("Failed to send password reset email. Please check the email address.");
        }
    };

    return (
        <div className="container mx-auto p-6 md:p-8">
            <h2 className="text-2xl font-semibold mb-4">Forgot Password</h2>
            <form onSubmit={handlePasswordReset} className="bg-white p-6 rounded-lg shadow-lg">
                <label htmlFor="email" className="block mb-2 font-medium">
                    Enter your email address:
                </label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded mb-4"
                    placeholder="Email"
                    required
                />
                <button
                    type="submit"
                    className="bg-blue-500 text-white rounded py-2 px-4 hover:bg-blue-600 transition"
                >
                    Send Password Reset Email
                </button>
                {message && <p className="text-green-500 mt-4">{message}</p>}
                {error && <p className="text-red-500 mt-4">{error}</p>}
            </form>
        </div>
    );
};

export default ForgotPassword;
