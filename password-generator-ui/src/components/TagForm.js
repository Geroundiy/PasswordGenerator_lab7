import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const TagForm = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) {
            setError('Название тега обязательно');
            return;
        }
        try {
            await axios.post('/tags', { name, description });
            setError(null);
            navigate('/tags');
        } catch (err) {
            console.error('Ошибка при добавлении тега:', err);
            setError('Не удалось добавить тег');
        }
    };

    const handleCancel = () => {
        navigate('/tags');
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Times New Roman' }}>
            <h2 style={{ fontSize: '21px', textAlign: 'center' }}>Добавить тег</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ fontSize: '14px' }}>Название тега</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '8px',
                            fontSize: '14px',
                            fontFamily: 'Times New Roman',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                        }}
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ fontSize: '14px' }}>Описание</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '8px',
                            fontSize: '14px',
                            fontFamily: 'Times New Roman',
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                        }}
                    />
                </div>
                {error && (
                    <p style={{ fontSize: '14px', color: 'red', textAlign: 'center' }}>
                        {error}
                    </p>
                )}
                <div style={{ textAlign: 'center' }}>
                    <button
                        type="submit"
                        style={{
                            padding: '10px 20px',
                            fontSize: '14px',
                            fontFamily: 'Times New Roman',
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            marginRight: '10px',
                        }}
                    >
                        Добавить
                    </button>
                    <button
                        type="button"
                        onClick={handleCancel}
                        style={{
                            padding: '10px 20px',
                            fontSize: '14px',
                            fontFamily: 'Times New Roman',
                            backgroundColor: '#6c757d',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                        }}
                    >
                        Отмена
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TagForm;