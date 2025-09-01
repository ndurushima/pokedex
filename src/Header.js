import React from 'react';
import './styles/Header.css';

export default function Header({ onSearch }) {
    function handleChange(e) {
    const value = e.target.value;
    onSearch(value);
  }

    return (
        <header className="header">
            <h1 className="header-title">Pokedex</h1>
            <div className="search-form">
                <input 
                    type="text"
                    placeholder='Seach Pokemon by name or number'
                    onChange={handleChange}
                    className='search-input'
                />
            </div>
        </header>
    )
}