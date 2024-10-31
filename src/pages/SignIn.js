import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebase';
import {Link} from 'react-router-dom';
import Footer from './Footer';


const SignIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/dashboard'); // Redirect after successful login
        } catch (err) {
            setError('Invalid email or password.');
        }
        setLoading(false);
    };

    return (
        <><div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-md shadow-md w-80">
                <h2 className="text-2xl font-semibold text-center mb-4">Sign In</h2>
                {error && <p className="text-red-500 text-center">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-2 border rounded mb-2"
                        required />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full p-2 border rounded mb-2"
                        required />
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2 bg-blue-500 text-white rounded mt-4"
                    >
                        {loading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>
                <p className="text-blue-500 mt-4 text-center">
                    <Link to="/forgot-password">Forgot Password?</Link>
                </p>
            </div>

        </div><Footer /></>

    );
};

export default SignIn;
