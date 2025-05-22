import React from "react";
import { Link } from "react-router-dom";

const PokemonCard = ({ pokemon }) => {
  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  return (
    <Link to={`/pokemon/${pokemon.name}`}>
      <div className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition duration-300 hover:cursor-pointer">
        <img
          src={pokemon.image}
          alt={pokemon.name}
          className="w-full h-32 object-contain mb-2"
        />
        <h2 className="text-center text-lg font-semibold">
          {capitalize(pokemon.name)}
        </h2>
      </div>
    </Link>
  );
};

export default PokemonCard;