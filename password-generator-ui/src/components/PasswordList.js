import React from 'react';
import { Link } from 'react-router-dom';

const PasswordList = () => {
    return (
        <div style={{ textAlign: 'center', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <h2 style={{ fontFamily: 'Times New Roman', fontSize: '20px' }}>Добро пожаловать в генератор паролей</h2>
            <Link to="/generate" className="btn btn-primary" style={{ fontFamily: 'Times New Roman', fontSize: '14px', marginTop: '20px' }}>
                Перейти к генератору паролей
            </Link>
        </div>
    );
};

export default PasswordList;