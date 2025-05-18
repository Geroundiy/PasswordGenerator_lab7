import React, { useState, useEffect } from 'react';

const App = () => {
    const [passwords, setPasswords] = useState([]);
    const [tags, setTags] = useState([]);
    const [newPassword, setNewPassword] = useState({ password: '', owner: '', tags: [] });
    const [selectedTag, setSelectedTag] = useState('');

    // Получение всех паролей
    useEffect(() => {
        fetch('/api/passwords')
            .then(response => response.json())
            .then(data => setPasswords(data));
        fetch('/api/tags')
            .then(response => response.json())
            .then(data => setTags(data));
    }, []);

    // Фильтрация по тегу
    const filterByTag = (tagName) => {
        setSelectedTag(tagName);
        fetch(`/api/passwords/by-tag?tagName=${tagName}`)
            .then(response => response.json())
            .then(data => setPasswords(data));
    };

    // Добавление пароля
    const addPassword = () => {
        fetch('/api/passwords', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newPassword),
        })
            .then(response => response.json())
            .then(data => setPasswords([...passwords, data]));
        setNewPassword({ password: '', owner: '', tags: [] });
    };

    // Обновление пароля
    const updatePassword = (id) => {
        const updatedPassword = passwords.find(p => p.id === id);
        fetch(`/api/passwords/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedPassword),
        })
            .then(response => response.json())
            .then(data => {
                setPasswords(passwords.map(p => (p.id === id ? data : p)));
            });
    };

    // Удаление пароля
    const deletePassword = (id) => {
        fetch(`/api/passwords/${id}`, {
            method: 'DELETE',
        }).then(() => {
            setPasswords(passwords.filter(p => p.id !== id));
        });
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Password Manager</h1>

            {/* Фильтр по тегам */}
            <div className="mb-4">
                <label className="mr-2">Filter by Tag:</label>
                <select
                    value={selectedTag}
                    onChange={(e) => filterByTag(e.target.value)}
                    className="border p-2 rounded"
                >
                    <option value="">All</option>
                    {tags.map(tag => (
                        <option key={tag.id} value={tag.name}>{tag.name}</option>
                    ))}
                </select>
            </div>

            {/* Список паролей */}
            <ul className="space-y-2">
                {passwords.map(password => (
                    <li key={password.id} className="flex justify-between items-center p-2 border rounded">
                        <div>
                            <span>{password.password} ({password.owner})</span>
                            <span className="text-sm text-gray-500 ml-2">
                Tags: {password.tags.map(tag => tag.name).join(', ')}
              </span>
                        </div>
                        <div>
                            <button
                                onClick={() => updatePassword(password.id)}
                                className="bg-blue-500 text-white px-2 py-1 rounded mr-2"
                            >
                                Update
                            </button>
                            <button
                                onClick={() => deletePassword(password.id)}
                                className="bg-red-500 text-white px-2 py-1 rounded"
                            >
                                Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>

            {/* Форма добавления */}
            <div className="mt-4">
                <input
                    type="text"
                    placeholder="Password"
                    value={newPassword.password}
                    onChange={(e) => setNewPassword({ ...newPassword, password: e.target.value })}
                    className="border p-2 rounded mr-2"
                />
                <input
                    type="text"
                    placeholder="Owner"
                    value={newPassword.owner}
                    onChange={(e) => setNewPassword({ ...newPassword, owner: e.target.value })}
                    className="border p-2 rounded mr-2"
                />
                <input
                    type="text"
                    placeholder="Tags (comma separated)"
                    value={newPassword.tags.join(',')}
                    onChange={(e) => setNewPassword({
                        ...newPassword,
                        tags: e.target.value.split(',').map(t => ({ name: t.trim() })),
                    })}
                    className="border p-2 rounded mr-2"
                />
                <button
                    onClick={addPassword}
                    className="bg-green-500 text-white px-4 py-2 rounded"
                >
                    Add Password
                </button>
            </div>
        </div>
    );
};

export default App;