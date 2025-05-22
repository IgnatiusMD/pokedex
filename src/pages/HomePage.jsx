import React, { useEffect, useState } from "react";
import { fetchPokemons } from "../utils/api";
import PokemonCard from "../components/PokemonCard";
import SearchBar from "../components/SearchBar";

const Home = () => {
  const [pokemons, setPokemons] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const perPage = 15;

  useEffect(() => {
    const loadData = async () => {
      const { pokemons, totalCount } = await fetchPokemons(
        (currentPage - 1) * perPage,
        perPage
      );
      setPokemons(pokemons);
      setTotalPages(Math.ceil(totalCount / perPage));
    };
    loadData();
  }, [currentPage]);

  const generatePagination = () => {
    const pages = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, "...", totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(
          1,
          "...",
          totalPages - 4,
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        pages.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages
        );
      }
    }

    return pages;
  };

  return (
    <div className="p-6 flex flex-col gap-4 bg-slate-800">
      <h1 className="text-3xl font-bold text-center">Pokédex</h1>

      <SearchBar />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {pokemons.map((pokemon) => (
          <PokemonCard key={pokemon.name} pokemon={pokemon} />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-8">
        <div className="inline-flex gap-1">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-3 py-2 text-sm rounded transition
              ${currentPage === 1
                ? "text-gray-400 cursor-not-allowed"
                : "text-white hover:text-blue-600 hover:cursor-pointer"}
            `}
          >
            ← Previous
          </button>

          {generatePagination().map((page, index) =>
            page === "..." ? (
              <span
                key={`ellipsis-${index}`}
                className="px-3 py-2 text-sm text-gray-400"
              >
                ...
              </span>
            ) : (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-2 text-sm rounded ${
                  currentPage === page
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-white hover:text-blue-600 hover:cursor-pointer"
                }`}
              >
                {page}
              </button>
            )
          )}

          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`px-3 py-2 text-sm rounded transition
              ${currentPage === totalPages
                ? "text-gray-400 cursor-not-allowed"
                : "text-white hover:text-blue-600 hover:cursor-pointer"}
            `}
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
