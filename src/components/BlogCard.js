import React from 'react';
import { Link } from 'react-router-dom';

const BlogCard = ({ blog }) => {
    return (
        <div className="border p-4 rounded-md shadow-md">
            <h3 className="text-lg font-bold">{blog.title}</h3>
            <p className="text-sm text-gray-600">by {blog.authorName}</p>
            <p className="text-gray-700 mt-2">{blog.content.slice(0, 100)}...</p>
            <p className="text-gray-600 mt-2">Likes: {blog.likes}</p>
            <Link to={`/blogs/${blog.id}`} className="text-blue-500 hover:underline mt-4 inline-block">
                Read More
            </Link>
        </div>
    );
};

export default BlogCard;
