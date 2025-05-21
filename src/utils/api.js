import axios from "axios";

export const fetchPokemons = async (offset = 0, limit = 15) => {
  const res = await axios.get(
    `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`
  );

  // Store total count
  const totalCount = res.data.count;

  // Get details
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