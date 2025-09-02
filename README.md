Pokedex App


A simple Pokédex web app built with React and the PokeAPI. Users can browse Pokémon by page, search by name or number (with partial matching), and view individual Pokémon details.


--------Features---------

* Browse Pokémon with pagination (Prev/Next buttons).
* Search by Pokémon name or number (supports partial matches like pika → Pikachu).
* View Pokémon images and IDs in a responsive grid layout.
* Dynamic detail page for each Pokémon with extra stats.
* Styled layout (header, grid, pagination) using CSS modules.
* Built with React Router for client-side routing.


------Setup Instructions-----

1. Clone the repository:
git clone https://github.com/your-username/pokedex-app.git
cd pokedex-app

2. Install dependencies:
npm install

3. Start the development server:
npm start

4. Open the app in your browser at: http://localhost:3000


--------API Used---------

Base URL: PokeAPI


-----Endpoints Used-----

GET /api/v2/pokemon?limit=20&offset=0 → fetch paginated Pokémon list

GET /api/v2/pokemon/:id → fetch details for a specific Pokémon

GET /api/v2/pokemon?limit=2000&offset=0 → fetch full index for partial search


----Project Structure----
src/
  App.js
  index.js
  Header.js
  PokemonList.js
  PokemonDetail.js
  Pagination.js
  styles/
    Header.css
    PokemonList.css
    Pagination.css



------Challenges-------

Handling debounced search to avoid hammering the API while typing.

Implementing AbortController to cancel in-flight requests when the user types quickly.

Building an index of all Pokémon once to allow fast partial searching.

Ensuring pagination and search modes don’t conflict.



-----Known Bugs / Future Improvements-----

Detail page is minimal (could include abilities, moves, and weaknesses).

Search is limited to the first 1000 Pokémon in the index.

Pagination and search are separate flows (can’t paginate search results yet).

Styling is basic; could be improved with a design system or animations.

