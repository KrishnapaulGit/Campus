import React from 'react';
import { FaEnvelope, FaTwitter, FaFacebook, FaInstagram } from 'react-icons/fa';
import Footer from './Footer';


const AboutPage = () => {
    return (
        <>
        <div className="container mx-auto p-6 md:p-12">
            <h1 className="text-3xl font-bold text-center mb-6">Welcome to Campus Blogs</h1>
            <h2 className="text-xl text-center mb-4 text-gray-600">Sharing Resources, Inspiring Minds, Interview Experiences</h2>
            <div className="bg-white shadow-lg rounded-lg p-6 md:p-8">
                <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
                <p className="text-gray-700 mb-4">
                    At Campus Blog, we aim to create a vibrant community where students can share their experiences, knowledge, and insights.
                    We believe that every voice matters and that through sharing our stories, we can inspire and support each other on our academic journeys.
                </p>

                <h2 className="text-2xl font-semibold mb-4">Who We Are</h2>
                <p className="text-gray-700 mb-4">
                    We are a group of passionate students dedicated to providing a platform for open dialogue and learning. Our backgrounds range from various fields of study, but we all share a common goal: to foster a supportive community for all students.
                </p>

                <h2 className="text-2xl font-semibold mb-4">Join Us!</h2>
                <p className="text-gray-700 mb-4">
                    Whether you want to share your own stories, learn from others, or simply connect with fellow students, Campus Blog is the place for you.
                    We invite you to explore our blogs, engage with the content, and be a part of our community.
                </p>

                <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
                <p className="text-gray-700 mb-4">
                    We love to hear from you! If you have any questions, suggestions, or just want to chat, feel free to reach out to us via our contact page.
                </p>

                <div className="flex justify-center mt-6 space-x-4">
                    <a href="mailto:paulkrishna142@gmail.com" className="text-gray-600 hover:text-blue-600">
                        <FaEnvelope className="text-2xl" />
                    </a>
                    <a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-400">
                        <FaTwitter className="text-2xl" />
                    </a>
                    <a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-600">
                        <FaFacebook className="text-2xl" />
                    </a>
                    <a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-pink-500">
                        <FaInstagram className="text-2xl" />
                    </a>
                </div>
            </div>
        </div>
        <Footer/>

        </>
    );
};

export default AboutPage;
