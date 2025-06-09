import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const PasswordForm = () => {
    const [owner, setOwner] = useState('');
    const [password, setPassword] = useState('');
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            fetchPassword();
        }
    }, [id]);

    const fetchPassword = async () => {
        try {
            const response = await axios.get(`/api/passwords/${id}`);
            setOwner(response.data.owner);
            setPassword(response.data.password);
        } catch (error) {
            console.error('Ошибка при получении пароля:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (id) {
                await axios.put(`/api/passwords/${id}`, { owner, password });
            } else {
                await axios.post('/api/passwords', { owner, password });
            }
            navigate('/');
        } catch (error) {
            console.error('Ошибка при сохранении пароля:', error);
        }
    };

    return (
        <div>
            <h2>{id ? 'Редактировать пароль' : 'Добавить пароль'}</h2>
            <div className="form-group">
                <label>Владелец:</label>
                <input
                    type="text"
                    value={owner}
                    onChange={e => setOwner(e.target.value)}
                    className="form-control"
                />
            </div>
            <div className="form-group">
                <label>Пароль:</label>
                <input
                    type="text"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="form-control"
                />
            </div>
            <button onClick={handleSubmit} className="btn btn-primary">Сохранить</button>
            <button onClick={() => navigate('/')} className="btn btn-secondary ml-2">Отмена</button>
        </div>
    );
};

export default PasswordForm;