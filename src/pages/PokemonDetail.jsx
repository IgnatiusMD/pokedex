import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import typeIcons from "../utils/elements";

const PokemonDetail = () => {
  const { name } = useParams();
  const [pokemon, setPokemon] = useState(null);
  const [flavorText, setFlavorText] = useState("");
  const [evolution, setEvolution] = useState("None");
  const [weaknesses, setWeaknesses] = useState([]);
  const [isStuckLoading, setIsStuckLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const pokeRes = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`);
      const speciesRes = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${name}`);
      const flavor = speciesRes.data.flavor_text_entries.find(entry => entry.language.name === "en");
      const evoChainUrl = speciesRes.data.evolution_chain.url;

      const evoRes = await axios.get(evoChainUrl);
      const evoData = evoRes.data.chain;
      let nextEvo = "None";
      if (evoData.species.name === name) {
        if (evoData.evolves_to.length > 0) {
          nextEvo = evoData.evolves_to[0].species.name;
        }
      } else {
        evoData.evolves_to.forEach(e1 => {
          if (e1.species.name === name && e1.evolves_to.length > 0) {
            nextEvo = e1.evolves_to[0].species.name;
          }
        });
      }

      const weaknessesSet = new Set();
      await Promise.all(
        pokeRes.data.types.map(async ({ type }) => {
          const typeRes = await axios.get(type.url);
          typeRes.data.damage_relations.double_damage_from.forEach(d => weaknessesSet.add(d.name));
        })
      );

      setPokemon(pokeRes.data);
      setFlavorText(flavor?.flavor_text.replace(/\f/g, " ") || "No description.");
      setEvolution(nextEvo);
      setWeaknesses([...weaknessesSet]);
    };

    fetchData();
  }, [name]);


  useEffect(() => {
    const timer = setTimeout(() => {
      setIsStuckLoading(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  if (!pokemon) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-white text-xl gap-4">
        <p>Loading...</p>
        {isStuckLoading && (
          <div className="flex flex-col item-center justify-center">
            <p>The Pokemon you are looking might not be available</p>
            <p className="text-center">Please wait a bit longer</p>
            <Link to="/" className="text-blue-400 underline text-center">
              ← Back to Home
            </Link>
          </div>
        )}
      </div>
    );
  }

  const height = (pokemon.height / 10).toFixed(1);
  const weight = (pokemon.weight / 10).toFixed(1);
  const abilities = pokemon.abilities.map(a => a.ability.name).join(", ");
  const stats = pokemon.stats.map(stat => (
    <p key={stat.stat.name}>
      <strong>{stat.stat.name.replace("-", " ")}:</strong> {stat.base_stat}
    </p>
  ));

  return (
    <div className="p-6 max-w-md mx-auto bg-gray-700 rounded-lg shadow-md mt-8 mb-8">
      <Link to="/" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-ease duration-200">&larr; Back</Link>

      {/* Types */}
      <div className="flex justify-center gap-4 mb-4">
        {pokemon.types.map(({ type }) => (
          <div key={type.name} className="relative group w-10 h-10">
            <img src={typeIcons[type.name]?.icon} alt={type.name} className="w-full h-full" />
            <span className="absolute bottom-full mb-1 hidden group-hover:block bg-black text-white text-xs rounded px-2 py-1">
              {typeIcons[type.name]?.label}
            </span>
          </div>
        ))}
      </div>

      {/* Image */}
      <div className="flex justify-center mb-4 bg-white rounded">
        <img
          src={pokemon.sprites.other["official-artwork"].front_default}
          alt={pokemon.name}
          className="w-48 h-48 object-contain"
        />
      </div>

      {/* Info */}
      <div className="text-center text-gray-800 dark:text-gray-100">
        <h1 className="text-2xl font-bold mb-2 capitalize">{pokemon.name}</h1>
        <p><strong>Height:</strong> {height} m</p>
        <p><strong>Weight:</strong> {weight} kg</p>
        <p><strong>Abilities:</strong> {abilities}</p>
        <p><strong>Evolution:</strong> {evolution !== "None" ? (
          <Link to={`/pokemon/${evolution}`} className="underline">
            {evolution.charAt(0).toUpperCase() + evolution.slice(1)}
          </Link>
        ) : "None"}</p>

        <p><strong>Weaknesses:</strong></p>
        <div className="flex justify-center flex-wrap gap-2 my-2">
          {weaknesses.map(type => (
            <div key={type} className="relative group w-8 h-8">
              <img src={typeIcons[type]?.icon} alt={type} className="w-full h-full" />
              <span className="absolute bottom-full mb-1 hidden group-hover:block bg-black text-white text-xs rounded px-2 py-1">
                {typeIcons[type]?.label}
              </span>
            </div>
          ))}
        </div>

        <div className="italic text-sm text-gray-600 dark:text-gray-300 mt-4">“{flavorText}”</div>

        <div className="mt-4 text-left">
          <div className="mt-4 text-left">
            <h2 className="font-bold mb-2">Base Stats</h2>
            <div className="grid grid-cols-2 gap-x-8 text-sm">
              
              <div className="space-y-1">
                {["hp", "attack", "defense"].map((key) => {
                  const stat = pokemon.stats.find(s => s.stat.name === key);
                  const label = key.charAt(0).toUpperCase() + key.slice(1);
                  return (
                    <div key={key}>
                      <strong>{label}:</strong> {stat.base_stat}
                    </div>
                  );
                })}
              </div>

              <div className="space-y-1">
                {["speed", "special-attack", "special-defense"].map((key) => {
                  const stat = pokemon.stats.find(s => s.stat.name === key);
                  const label = key.split("-").map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(" ");
                  return (
                    <div key={key}>
                      <strong>{label}:</strong> {stat.base_stat}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PokemonDetail;