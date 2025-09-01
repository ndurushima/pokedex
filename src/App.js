import React, { useState, useEffect, useRef } from 'react';
import PokemonList from './PokemonList';
import axios from 'axios';
import Pagination from './Pagination';
import Header from './Header';

const PAGE_URL = 'https://pokeapi.co/api/v2/pokemon';
const INDEX_URL = `${PAGE_URL}?limit=2000&offset=0`; 
const MAX_MATCHES = 30; 

function App() {
  const [pokemon, setPokemon] = useState([]);
  const [currentPageUrl, setCurrentPageUrl] = useState(PAGE_URL);
  const [nextPageUrl, setNextPageUrl] = useState();
  const [prevPageUrl, setPrevPageUrl] = useState();
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);

  const [indexData, setIndexData] = useState(null);
  const indexControllerRef = useRef(null);

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

  const searchTimeoutRef = useRef(null);

  function buildIndexItems(results) {
    return results.map((p) => {
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
  }

  function filterIndex(idx, q) {
    const isNumeric = /^\d+$/.test(q);
    const query = q.toLowerCase();

    let matches = [];
    if (isNumeric) {
      matches = idx.filter((p) => String(p.id || '').startsWith(query));
    } else {
      matches = idx.filter((p) => p.name.includes(query));
    }
    return matches.slice(0, MAX_MATCHES);
  }

  function handleSearch(raw) {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
      searchTimeoutRef.current = null;
    }

    const query = String(raw || '').trim().toLowerCase();

    if (!query) {
      setSearching(false);
      setCurrentPageUrl(PAGE_URL);
      return;
    }

    setSearching(true);

    searchTimeoutRef.current = setTimeout(async () => {
      try {
        if (!indexData) {
          if (indexControllerRef.current) {
            indexControllerRef.current.abort();
            indexControllerRef.current = null;
          }
          indexControllerRef.current = new AbortController();

          setLoading(true);
          const res = await axios.get(INDEX_URL, { signal: indexControllerRef.current.signal });
          const idx = buildIndexItems(res.data.results || []);
          setIndexData(idx);

          const filtered = filterIndex(idx, query);
          setPokemon(filtered);
          setLoading(false);
        } else {
          const filtered = filterIndex(indexData, query);
          setPokemon(filtered);
        }
      } catch (err) {
        if (err?.name === 'CanceledError' || err?.code === 'ERR_CANCELED') return;
        console.error(err);
        setPokemon([]);
        setLoading(false);
      }
    }, 500); 
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
