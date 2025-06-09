import React, { useState, useRef } from 'react';
import axios from 'axios';
import './PasswordGenerator.css';

const PasswordGenerator = () => {
    const [length, setLength] = useState(15);
    const [complexity, setComplexity] = useState(2);
    const [owner, setOwner] = useState('');
    const [owners, setOwners] = useState(['']);
    const [generatedPassword, setGeneratedPassword] = useState('');
    const [bulkPasswords, setBulkPasswords] = useState([]);
    const [error, setError] = useState(null);
    const [bulkMode, setBulkMode] = useState('single');
    const [generatedCount, setGeneratedCount] = useState(0);
    const prevParams = useRef({ length: 15, complexity: 2, owner: '', owners: [''] });

    const isValidInput = () => {
        if (bulkMode === 'single') {
            return length >= 4 && complexity >= 1 && complexity <= 3 && owner.trim() !== '';
        } else {
            return length >= 4 && complexity >= 1 && complexity <= 3 && owners.some(o => o.trim() !== '');
        }
    };

    const handleGenerateSingle = async () => {
        if (!isValidInput()) {
            setError('Введите длину, сложность и владельца');
            return;
        }
        if (length === prevParams.current.length && complexity === prevParams.current.complexity && owner === prevParams.current.owner) {
            setError('Параметры не изменились, пароль не сгенерирован');
            return;
        }
        try {
            const response = await axios.get(`/passwords/generate?length=${length}&complexity=${complexity}&owner=${owner}`);
            const password = response.data.replace(/Пароль для [^:]+: /, '');
            setGeneratedPassword(password);
            setError(null);
            setGeneratedCount(prev => prev + 1);
            prevParams.current = { length, complexity, owner, owners: [''] };
        } catch (error) {
            console.error('Ошибка при генерации пароля:', error);
            setError('Не удалось сгенерировать пароль');
        }
    };

    const handleGenerateBulk = async () => {
        if (!isValidInput()) {
            setError('Введите длину, сложность и хотя бы одного владельца');
            return;
        }
        const validOwners = owners.filter(o => o.trim() !== '');
        if (length === prevParams.current.length && complexity === prevParams.current.complexity &&
            JSON.stringify(validOwners) === JSON.stringify(prevParams.current.owners.filter(o => o.trim() !== ''))) {
            setError('Параметры не изменились, пароли не сгенерированы');
            return;
        }
        try {
            const requests = validOwners.map(o => ({ length, complexity, owner: o }));
            const response = await axios.post('/passwords/generate/bulk', requests);
            setBulkPasswords(response.data);
            setError(null);
            setGeneratedCount(prev => prev + validOwners.length);
            prevParams.current = { length, complexity, owner: '', owners: validOwners };
        } catch (error) {
            console.error('Ошибка при массовой генерации паролей:', error);
            setError('Не удалось сгенерировать пароли');
        }
    };

    const handleAddOwner = () => {
        setOwners([...owners, '']);
    };

    const handleOwnerChange = (index, value) => {
        const newOwners = [...owners];
        newOwners[index] = value;
        setOwners(newOwners);
    };

    const handleResetOwners = () => {
        setOwners(['']);
    };

    const handleReturnToSingle = () => {
        setBulkMode('single');
        setOwners(['']);
        setBulkPasswords([]);
    };

    const handleResetAll = () => {
        setGeneratedPassword('');
        setBulkPasswords([]);
        setGeneratedCount(0);
        prevParams.current = { length: 15, complexity: 2, owner: '', owners: [''] };
    };

    const handleCopyPassword = (password) => {
        navigator.clipboard.writeText(password)
            .then(() => alert('Пароль скопирован в буфер обмена!'))
            .catch(err => console.error('Ошибка при копировании:', err));
    };

    return (
        <div className="generator-container">
            <h1 style={{ fontFamily: 'Times New Roman', fontSize: '21px', textAlign: 'center', lineHeight: '1.5' }}>
                Генератор паролей
            </h1>
            <p style={{ fontFamily: 'Times New Roman', fontSize: '14px', color: '#666', textAlign: 'center' }}>
                Этот генератор позволяет создавать безопасные пароли различной длины и сложности для одного или нескольких пользователей.
                <br />Настрой параметры и сгенерируй пароли для надежной защиты ваших данных.
            </p>
            <div className="counter-container">
                <div style={{ fontFamily: 'Times New Roman', fontSize: '14px' }}>
                    Сгенерировано: {generatedCount}
                </div>
                <button onClick={handleResetAll} className="btn btn-danger reset-btn" style={{ fontFamily: 'Times New Roman', fontSize: '12px' }}>
                    R
                </button>
            </div>
            <div className="form-group">
                <label style={{ fontFamily: 'Times New Roman', fontSize: '14px' }}>Длина</label>
                <input
                    type="number"
                    value={length}
                    onChange={e => setLength(parseInt(e.target.value) || 15)}
                    className="form-control"
                    min="4"
                    max="30"
                />
            </div>
            <div className="form-group">
                <label style={{ fontFamily: 'Times New Roman', fontSize: '14px' }}>Сложность</label>
                <input
                    type="number"
                    value={complexity}
                    onChange={e => setComplexity(parseInt(e.target.value) || 2)}
                    className="form-control"
                    min="1"
                    max="3"
                />
            </div>
            <div className="form-group">
                <label style={{ fontFamily: 'Times New Roman', fontSize: '14px' }}>Режим массовой генерации</label>
                <select
                    value={bulkMode}
                    onChange={e => setBulkMode(e.target.value)}
                    style={{ fontFamily: 'Times New Roman', fontSize: '14px' }}
                    className="form-control"
                >
                    <option value="single">Один пользователь</option>
                    <option value="multiple">Несколько пользователей</option>
                </select>
            </div>
            {bulkMode === 'single' ? (
                <div className="form-group">
                    <label style={{ fontFamily: 'Times New Roman', fontSize: '14px' }}>Владелец</label>
                    <input
                        type="text"
                        value={owner}
                        onChange={e => setOwner(e.target.value)}
                        className="form-control"
                    />
                </div>
            ) : (
                <>
                    {owners.map((o, index) => (
                        <div key={index} className="form-group">
                            <label style={{ fontFamily: 'Times New Roman', fontSize: '14px' }}>Владелец {index + 1}</label>
                            <input
                                type="text"
                                value={o}
                                onChange={e => handleOwnerChange(index, e.target.value)}
                                className="form-control"
                            />
                        </div>
                    ))}
                    <div>
                        <button
                            onClick={handleAddOwner}
                            className="btn btn-secondary small-btn"
                            style={{ fontFamily: 'Times New Roman', fontSize: '12px' }}
                        >
                            Добавить ещё владельца
                        </button>
                        <button
                            onClick={handleResetOwners}
                            className="btn btn-secondary small-btn"
                            style={{ fontFamily: 'Times New Roman', fontSize: '12px', marginLeft: '10px' }}
                        >
                            Сбросить владельцев
                        </button>
                    </div>
                </>
            )}
            <div>
                {bulkMode === 'single' ? (
                    <button
                        onClick={handleGenerateSingle}
                        className="btn btn-primary"
                        style={{ fontFamily: 'Times New Roman', fontSize: '14px' }}
                    >
                        Сгенерировать один пароль
                    </button>
                ) : (
                    <>
                        <button
                            onClick={handleGenerateBulk}
                            className="btn btn-primary large-btn"
                            style={{ fontFamily: 'Times New Roman', fontSize: '16px' }}
                        >
                            Сгенерировать массово
                        </button>
                        <button
                            onClick={handleReturnToSingle}
                            className="btn btn-secondary"
                            style={{ fontFamily: 'Times New Roman', fontSize: '14px', marginLeft: '20px', marginTop: '10px' }}
                        >
                            Вернуться к одному пользователю
                        </button>
                    </>
                )}
            </div>
            {error && (
                <p style={{ fontFamily: 'Times New Roman', fontSize: '14px', color: 'red', textAlign: 'center' }}>
                    {error}
                </p>
            )}
            {generatedPassword && (
                <div style={{ textAlign: 'center', marginTop: '10px' }}>
                    <p style={{ fontFamily: 'Times New Roman', fontSize: '14px' }}>
                        {generatedPassword}
                        <button
                            onClick={() => handleCopyPassword(generatedPassword)}
                            className="btn btn-secondary small-btn"
                            style={{ fontFamily: 'Times New Roman', fontSize: '12px', marginLeft: '10px' }}
                        >
                            Копировать
                        </button>
                    </p>
                </div>
            )}
            {bulkPasswords.length > 0 && (
                <div style={{ textAlign: 'center' }}>
                    <p style={{ fontFamily: 'Times New Roman', fontSize: '14px' }}>
                        Количество сгенерированных паролей: {bulkPasswords.length}
                    </p>
                    <ul style={{ listStyleType: 'none', padding: 0 }}>
                        {bulkPasswords.map((password, index) => (
                            <li key={index} style={{ fontFamily: 'Times New Roman', fontSize: '14px' }}>
                                {password}
                                <button
                                    onClick={() => handleCopyPassword(password)}
                                    className="btn btn-secondary small-btn"
                                    style={{ fontFamily: 'Times New Roman', fontSize: '12px', marginLeft: '10px' }}
                                >
                                    Копировать
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default PasswordGenerator;