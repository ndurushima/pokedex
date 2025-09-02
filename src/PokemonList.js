import React from 'react';
import { Link } from 'react-router-dom';
import './styles/PokemonList.css';

export default function PokemonList({ pokemon }) {
  return (
    <div className="pokemon-grid">
        {pokemon.map(p => (
          <Link
            to={`/pokemon/${p.id}`}
            state={{ fromSearch: true}}
            key={p.id}
            className="pokemon-card-link"
          >

            <div key={p.id} className="pokemon-card">
              <img 
                src={p.image}
                alt={p.name}
                loading="lazy"
                onError={e => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${p.id}.svg`;
                }}
              />
              <div className="pokemon-name">{p.name}</div>
              <div className="pokemon-id">#{p.id}</div>
            </div>
          </Link>
        ))}
    </div>
  )
}
