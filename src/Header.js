import React, { useState } from 'react';
import '../styles/Header.css';

export default function Header({ onSearch }) {
    const [query, setQuery] = useState('');

    function handleSubmit(e) {
        e.preventDefault();
        if (query.trim() !== '') {
            onSearch(query.trim().toLowerCase());
            setQuery('');
        }
    }


    return (
        <header className="header">
            <h1 className="header-title">Pokedex</h1>
            <form className="search-form" onSubmit={handleSubmit}>
                <input 
                    type="text"
                    placeholder='Seach Pokemon by name or number'
                    value={query}
                    onChange={(e) => setQuery(e.target.value)} className='search-input'
                />
                <button type="submit" className="search-button">Search</button>
            </form>
        </header>
    )
}