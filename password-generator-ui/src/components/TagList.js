import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const TagList = () => {
    const [tags, setTags] = useState([]);

    useEffect(() => {
        fetchTags();
    }, []);

    const fetchTags = async () => {
        try {
            const response = await axios.get('/api/tags');
            setTags(response.data);
        } catch (error) {
            console.error('Error fetching tags:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this tag?')) {
            try {
                await axios.delete(`/api/tags/${id}`);
                setTags(tags.filter(t => t.id !== id));
            } catch (error) {
                console.error('Error deleting tag:', error);
            }
        }
    };

    return (
        <div>
            <h2>Tags</h2>
            <Link to="/tags/new" className="btn btn-primary mb-3">Add Tag</Link>
            <ul className="list-group">
                {tags.map(tag => (
                    <li key={tag.id} className="list-group-item d-flex justify-content-between align-items-center">
                        {tag.name}
                        <div>
                            <Link to={`/tags/edit/${tag.id}`} className="btn btn-sm btn-warning mr-2">Edit</Link>
                            <button onClick={() => handleDelete(tag.id)} className="btn btn-sm btn-danger">Delete</button>
                        </div>
                    </li>
                ))}
            </ul>
            <Link to="/" className="btn btn-secondary mt-3">Back to Passwords</Link>
        </div>
    );
};

export default TagList;