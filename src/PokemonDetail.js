import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { capitalize } from '@mui/material';

export default function PokemonDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const fromSeach = location.state?.fromSearch;

  const [pokemon, setPokemon] = useState(null);

  useEffect(() => {
    axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`)
      .then(res => setPokemon(res.data));
  }, [id]);

  if (!pokemon) return <p>Loading...</p>;

  // ---- Conversions for Height and Weight ----
  const heightMeters = pokemon.height /10; // decimeters to meters
  const weightKg = pokemon.weight / 10; // hectograms to kilograms
  const weightLbs = (weightKg * 2.20462).toFixed(1); // Kilograms to pounds

  function toFeetInches(meters) {
    const totalInches = meters * 39.3701;
    const feet = Math.floor(totalInches / 12);
    const inches = Math.round(totalInches % 12);
    return `${feet}' ${inches}"`;
  }

  const heightFeetInches = toFeetInches(heightMeters);

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>#{pokemon.id}</h2>
      <h1>{capitalize(pokemon.name)}</h1>
      <img
        src={pokemon.sprites.other['official-artwork'].front_default}
        alt={pokemon.name}
        style={{ width: 200 }}
      />
      <p><strong>Type:</strong> {pokemon.types.map(t => capitalize(t.type.name)).join(', ')}</p>
      <p><strong>Height:</strong> {heightFeetInches}</p>
      <p><strong>Weight:</strong> {weightLbs} lbs.</p>

      <button onClick={() => {
        if (fromSeach) {
          navigate('/', { state: {reset: true}});
        } else {
        navigate('/')};
        }} className="back-button">Back to List</button>
    </div>
  );
}
