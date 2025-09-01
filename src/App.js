import React, { useState, useEffect }from 'react';
import PokemonList from './PokemonList';
import axios from 'axios';
import Pagination from './Pagination';
import Header from './Header';

function App() {
  const [pokemon, setPokemon] = useState([])
  const [currentPageUrl, setCurrentPageUrl] = useState("https://pokeapi.co/api/v2/pokemon")
  const [nextPageUrl, setNextPageUrl] = useState()
  const [prevPageUrl, setPrevPageUrl] = useState()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    let cancel
    axios.get(currentPageUrl, {
      cancelToken: new axios.CancelToken(c => cancel = c)
    }).then(res => {
      setNextPageUrl(res.data.next)
      setPrevPageUrl(res.data.previous)

      const mapped = res.data.results.map(p => {
        // robust id extraction
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

      setPokemon(mapped)
      setLoading(false)
    })
    .catch(() => setLoading(false));

    return () => cancel && cancel()
  }, [currentPageUrl])

  function gotoNextPage() {
    setCurrentPageUrl(nextPageUrl)
  }

  function gotoPrevPage() {
    setCurrentPageUrl(prevPageUrl)
  }

  if (loading) return "Loading..."

  function handleSearch(query) {
    setCurrentPageUrl(`https://pokeapi.co/api/v2/pokemon/${query}`);
  }

  return (
    <>
      <Header onSearch={handleSearch} />
      <PokemonList pokemon={pokemon} />
      <Pagination 
        gotoNextPage={nextPageUrl ? gotoNextPage : null}
        gotoPrevPage={prevPageUrl ? gotoPrevPage : null}
      />
    </>
  );
}

export default App;
