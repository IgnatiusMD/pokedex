import axios from "axios";

export const fetchPokemons = async (offset = 0, limit = 15) => {
  const res = await axios.get(
    `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`
  );

  const totalCount = res.data.count;

  const detailed = await Promise.all(
    res.data.results.map(async (p) => {
      const details = await axios.get(p.url);
      return {
        name: details.data.name,
        image: details.data.sprites.other["official-artwork"].front_default,
      };
    })
  );

  return {
    pokemons: detailed,
    totalCount,
  };
};

export const fetchAllPokemonNames = async () => {
  const res = await axios.get("https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0");
  return res.data.results.map((p) => p.name);
};
