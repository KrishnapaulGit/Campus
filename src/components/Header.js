import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaBars, FaTimes } from 'react-icons/fa';
import { auth } from '../services/firebase';
import { signOut } from 'firebase/auth';

const Header = ({ user }) => {
    const [search, setSearch] = useState('');
    const [menuOpen, setMenuOpen] = useState(false); // State for mobile menu
    const [searchOpen, setSearchOpen] = useState(false); // State for search input
    const [userImage, setUserImage] = useState(''); // State for user image
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch the user image when the component mounts or when the user prop changes
        if (user) {
            setUserImage(user.photoURL || 'https://static.vecteezy.com/system/resources/previews/019/879/186/non_2x/user-icon-on-transparent-background-free-png.png');
        } else {
            setUserImage('https://static.vecteezy.com/system/resources/previews/019/879/186/non_2x/user-icon-on-transparent-background-free-png.png'); // Default image
        }
    }, [user]);

    const handleSearch = (e) => {
        e.preventDefault();
        navigate(`/search?query=${search}`);
        setSearchOpen(false);
        setMenuOpen(false); // Close the menu after search
    };

    const handleSignOut = () => {
        signOut(auth)
            .then(() => {
                localStorage.removeItem('token');
                navigate('/');
            })
            .catch((error) => console.error("Sign out error:", error));
    };

    const toggleMenu = () => {
        setMenuOpen((prev) => !prev);
        
    };

    const handleMenuLinkClick = () => {
        setMenuOpen(false); // Close the menu when a link is clicked
    };

    return (
        <div className="flex justify-between items-center p-4 bg-gray-800 text-white relative">
            <Link to="/" className="text-2xl font-bold left-4">Campus Blogs</Link>

            {/* Hamburger menu for small screens */}
            <button className="md:hidden" onClick={toggleMenu}>
                {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>

            {/* Mobile menu */}
            <div className={`fixed top-16 right-0 h-full bg-gray-800 w-full transition-transform transform ${menuOpen ? 'translate-x-0' : 'translate-x-full'} md:hidden z-50`}>
                <div className="flex flex-col items-center justify-center h-full">
                    <img
                        src={userImage}
                        alt="User"
                        className="h-10 w-10 rounded-full cursor-pointer mb-4"
                    />
                    <Link to="/blogs" className="block hover:text-gray-400 py-2 text-lg" onClick={handleMenuLinkClick}>Blogs</Link>
                    <Link to="/about" className="block hover:text-gray-400 py-2 text-lg" onClick={handleMenuLinkClick}>About</Link>
                    {user ? (
                        <>
                            <Link to="/dashboard" className="px-4 py-2 mb-5 bg-blue-500 text-white rounded-md" onClick={handleMenuLinkClick}>Dashboard</Link>
                            <Link to="/" className="px-4 py-2 bg-red-500 text-white rounded-md" onClick={handleSignOut}>Sign Out</Link>
                        </>
                    ) : (
                        <>
                            <Link to="/signin" className="block hover:text-gray-400 py-2 text-lg" onClick={handleMenuLinkClick}>Sign In</Link>
                            <Link to="/signup" className="block hover:text-gray-400 py-2 text-lg" onClick={handleMenuLinkClick}>Sign Up</Link>
                        </>
                    )}
                    <div className="flex justify-center mt-4">
                        {searchOpen ? (
                            <form onSubmit={handleSearch} className="relative w-full">
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="px-3 py-1 rounded-full bg-gray-700 text-white focus:outline-none w-full"
                                    placeholder="Search..."
                                />
                                <button type="submit" className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400">
                                    <FaSearch />
                                </button>
                            </form>
                        ) : (
                            <button onClick={() => setSearchOpen(true)} className="mt-2">
                                <FaSearch size={24} />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Navigation links, search input, and user icon for larger screens */}
            <div className="hidden md:flex flex-grow items-center justify-evenly space-x-4">
                <Link to="/blogs" className="block hover:text-gray-400">Blogs</Link>
                <Link to="/about" className="block hover:text-gray-400">About</Link>

                {/* Search input for larger screens */}
                <form onSubmit={handleSearch} className="relative w-full max-w-xs">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="px-3 py-1 rounded-full bg-gray-700 text-white focus:outline-none w-full"
                        placeholder="Search..."
                    />
                    <button type="submit" className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <FaSearch />
                    </button>
                </form>

                {/* User profile icon */}
                {user ? (
                    <><div className="relative">
                        <img
                            src={userImage}
                            alt="User"
                            className="h-10 w-10 rounded-full cursor-pointer" />

                    </div><div className="space-x-4">
                            <Link to="/dashboard" className="px-4 py-2 bg-blue-500 text-white rounded-md">Dashboard</Link>
                            <Link to="/" className="px-4 py-2 bg-red-500 text-white rounded-md" onClick={handleSignOut}>Sign Out</Link>
                        </div></>
                ) : (
                    <div className="space-x-4">
                        <Link to="/signin" className="px-4 py-2 bg-blue-500 text-white rounded-md">Sign In</Link>
                        <Link to="/signup" className="px-4 py-2 bg-green-500 text-white rounded-md">Sign Up</Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Header;
