import React, { useState, useEffect, useRef } from 'react';
import PokemonList from './PokemonList';
import axios from 'axios';
import Pagination from './Pagination';
import Header from './Header';

const PAGE_URL = 'https://pokeapi.co/api/v2/pokemon';

function App() {
  const [pokemon, setPokemon] = useState([]);
  const [currentPageUrl, setCurrentPageUrl] = useState(PAGE_URL);
  const [nextPageUrl, setNextPageUrl] = useState();
  const [prevPageUrl, setPrevPageUrl] = useState();
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);

  // ===== Normal paginated fetch =====
  useEffect(() => {
    if (searching) return;

    const controller = new AbortController();
    setLoading(true);

    axios
      .get(currentPageUrl, { signal: controller.signal })
      .then((res) => {
        setNextPageUrl(res.data.next);
        setPrevPageUrl(res.data.previous);

        const mapped = res.data.results.map((p) => {
          const match = p.url.match(/\/pokemon\/(\d+)\//);
          const id = match ? match[1] : null;
          return {
            name: p.name,
            id,
            image: id
              ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`
              : '',
          };
        });

        setPokemon(mapped);
      })
      .catch((err) => {
        if (err?.name === 'CanceledError' || err?.code === 'ERR_CANCELED') return;
        console.error(err);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [currentPageUrl, searching]);

  // ===== Debounced live search (single Pokémon) =====
  const searchTimeoutRef = useRef(null);
  const searchControllerRef = useRef(null);

  function handleSearch(raw) {
    // Cancel any pending debounce timer
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
      searchTimeoutRef.current = null;
    }
    // Abort any in-flight search request
    if (searchControllerRef.current) {
      searchControllerRef.current.abort();
      searchControllerRef.current = null;
    }

    const query = String(raw || '').trim().toLowerCase();

    if (!query) {
      // Reset to paginated mode; do NOT setLoading(true) here
      setSearching(false);
      setCurrentPageUrl(PAGE_URL);
      return;
    }

    setSearching(true);

    // Debounce the actual request
    searchTimeoutRef.current = setTimeout(async () => {
      const controller = new AbortController();
      searchControllerRef.current = controller;

      // Only now that we’re about to fire the request, show loader
      setLoading(true);
      try {
        const res = await axios.get(`${PAGE_URL}/${query}`, {
          signal: controller.signal,
        });
        const poke = {
          name: res.data.name,
          id: res.data.id,
          image: res.data.sprites?.other?.['official-artwork']?.front_default || '',
        };
        setPokemon([poke]);
      } catch (err) {
        if (err?.name === 'CanceledError' || err?.code === 'ERR_CANCELED') {
          // aborted because user kept typing — do nothing
          return;
        }
        // Not found or other error => show empty list
        setPokemon([]);
      } finally {
        setLoading(false);
      }
    }, 1000); // adjust delay if you want it snappier/slower
  }

  function gotoNextPage() {
    setCurrentPageUrl(nextPageUrl);
  }

  function gotoPrevPage() {
    setCurrentPageUrl(prevPageUrl);
  }

  if (loading) return 'Loading...';

  return (
    <>
      <Header onSearch={handleSearch} />
      <PokemonList pokemon={pokemon} />
      {!searching && (
        <Pagination
          gotoNextPage={nextPageUrl ? gotoNextPage : null}
          gotoPrevPage={prevPageUrl ? gotoPrevPage : null}
        />
      )}
    </>
  );
}

export default App;
