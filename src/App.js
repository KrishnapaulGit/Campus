import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './services/firebase'; // Import Firebase auth
import Header from './components/Header';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './routes/PrivateRoute';
import BlogDetail from './pages/BlogDetail';
import AllBlogs from './pages/AllBlogs';
import EditBlog from './pages/EditBlog';
import ForgotPassword from './pages/ForgotPassword';
import AboutPage from './pages/AboutPage';

const App = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser); // Set user state
        });
        
        return () => unsubscribe(); // Cleanup subscription on unmount
    }, []);

    return (
        <Router>
            <Header user={user} />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/signup" element={<SignUp />} />
                <Route 
                    path="/dashboard" 
                    element={<PrivateRoute user={user}><Dashboard /></PrivateRoute>} 
                />
                 <Route path="/blogs/:id" element={<BlogDetail />} />
                 <Route path="/blogs" element={<AllBlogs/>} />
                 <Route path="/edit-blog/:id" element={<EditBlog />} />
                 <Route path="/forgot-password" element={<ForgotPassword />} />
                 <Route path="/about" element={<AboutPage />} />

            </Routes>
        </Router>
    );
};

export default App;
