import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function PokemonDetail() {
  const { id } = useParams();
  const [pokemon, setPokemon] = useState(null);

  useEffect(() => {
    axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`)
      .then(res => setPokemon(res.data));
  }, [id]);

  if (!pokemon) return <p>Loading...</p>;

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>{pokemon.name} #{pokemon.id}</h2>
      <img
        src={pokemon.sprites.other['official-artwork'].front_default}
        alt={pokemon.name}
        style={{ width: 200 }}
      />
      <p>Height: {pokemon.height}</p>
      <p>Weight: {pokemon.weight}</p>
    </div>
  );
}
