import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const PokemonDetail = () => {
  const { name } = useParams();
  const [pokemon, setPokemon] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      const res = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`);
      setPokemon(res.data);
    };
    fetchDetails();
  }, [name]);

  if (!pokemon) return <div className="text-white text-center">Loading...</div>;

  return (
    <div className="p-6 bg-slate-800 text-white">
      <Link to={'/'}><button>back</button></Link>
      <h1 className="text-3xl font-bold mb-4">{pokemon.name.toUpperCase()}</h1>
      <img
        src={pokemon.sprites.other["official-artwork"].front_default}
        alt={pokemon.name}
        className="w-64 h-64 object-contain"
      />
      <div className="mt-4">
        <p><strong>Height:</strong> {pokemon.height}</p>
        <p><strong>Weight:</strong> {pokemon.weight}</p>
        <p><strong>Types:</strong> {pokemon.types.map(t => t.type.name).join(", ")}</p>
      </div>
    </div>
  );
};

export default PokemonDetail;
