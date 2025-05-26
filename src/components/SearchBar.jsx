import React, { useState } from "react";

const SearchBar = ({ allPokemonNames, onSelectPokemon }) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length === 0) {
      setSuggestions([]);
      return;
    }

    const filtered = allPokemonNames
      .filter((name) => name.toLowerCase().startsWith(value.toLowerCase()));

    setSuggestions(filtered);
  };

  const handleSelect = (name) => {
    setQuery(name);
    setSuggestions([]);
    onSelectPokemon(name);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim() !== "") {
      onSelectPokemon(query.toLowerCase());
      setSuggestions([]);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full mx-auto">
      <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">
        Search
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
          <svg
            className="w-4 h-4 text-gray-500 dark:text-gray-400"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
          </svg>
        </div>
        <input type="search" id="default-search" value={query} onChange={handleChange} placeholder="Search Pokémon..." className="block w-full p-4 ps-10 text-sm text-white border rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-gray-700 border-gray-600 placeholder-gray-400"/>
        
        <button type="submit" className="text-white absolute end-2.5 bottom-2.5 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 bg-blue-600 dark:hover:bg-blue-700 focus:ring-blue-800 transition-ease duration-200 hover:cursor-pointer">
          Search
        </button>
      </div>

      {suggestions.length > 0 && (
        <ul className="absolute z-10 w-full mt-1 border rounded shadow-md max-h-40 overflow-y-auto bg-gray-700 border-gray-600">
          {suggestions.map((name) => (
            <li key={name} onClick={() => handleSelect(name)} className="px-4 py-2 cursor-pointer hover:bg-blue-600 text-white">
              {name.charAt(0).toUpperCase() + name.slice(1)}
            </li>
          ))}
        </ul>
      )}
    </form>
  );
};

export default SearchBar;
