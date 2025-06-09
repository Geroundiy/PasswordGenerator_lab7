import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PasswordGenerator from './components/PasswordGenerator';
import TagForm from './components/TagForm';

function App() {
    return (
        <div>
            <Routes>
                <Route path="/" element={<PasswordGenerator />} />
                <Route path="/tags/add" element={<TagForm />} />
            </Routes>
        </div>
    );
}

export default App;