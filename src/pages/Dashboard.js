import React from 'react';
import Profile from './Profile';
import UserBlogs from './UserBlogs';
import CreateBlog from './CreateBlog';
import Footer from './Footer';

const Dashboard = () => {
    return (
        <div className="p-4">
            <h2 className="text-3xl font-extrabold mb-6 text-center text-blue-700 drop-shadow-md">
                Dashboard
            </h2> <Profile/>
            <CreateBlog />
            <UserBlogs />
            <Footer/>
        </div>
    );
};

export default Dashboard;
