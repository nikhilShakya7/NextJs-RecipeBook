"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

type Meal = {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strArea: string;
  strCategory: string;
};

export default function HomePage() {
  const [search, setSearch] = useState("beef");
  const [recipes, setRecipes] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchRecipes() {
      setLoading(true);
      try {
        const res = await fetch(
          `https://www.themealdb.com/api/json/v1/1/search.php?s=${search}`
        );
        const data = await res.json();
        setRecipes(data.meals || []);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      } finally {
        setLoading(false);
      }
    }

    const debounceTimer = setTimeout(fetchRecipes, 300);
    return () => clearTimeout(debounceTimer);
  }, [search]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-6xl mx-auto px-6 py-16">
          <div className="text-center">
            <div className="inline-flex items-center gap-3 mb-4">
              <span className="text-6xl animate-bounce">🍽️</span>
              <h1 className="text-5xl md:text-7xl font-black tracking-tight">
                Recipe Finder
              </h1>
            </div>
            <p className="text-xl md:text-2xl text-orange-100 max-w-2xl mx-auto leading-relaxed">
              Discover delicious meals from around the world. Search, explore,
              and cook amazing dishes.
            </p>
          </div>
        </div>
        {/* Decorative waves */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden">
          <svg
            className="relative block w-full h-12"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M0,120 L1200,120 L1200,60 C1000,20 800,80 600,60 C400,40 200,100 0,60 Z"
              fill="rgb(255 247 237)"
            ></path>
          </svg>
        </div>
      </div>

      {/* Search Section */}
      <div className="max-w-6xl mx-auto px-6 -mt-8 relative z-10">
        <div className="bg-white rounded-2xl shadow-2xl border border-orange-100 p-8 backdrop-blur-sm">
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span className="text-2xl">🔍</span>
            </div>
            <input
              className="w-full pl-14 pr-6 py-4 text-lg border-2 border-orange-200 rounded-xl 
                         focus:border-white-500 focus:ring-4 focus:ring-orange-100 outline-none
                         transition-all duration-300 bg-orange-50/50 placeholder-orange-400
                         hover:border-orange-300 text-black"
              type="text"
              placeholder="Search for meals (e.g., pasta, chicken, beef)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
              <span className="absolute inset-0 flex items-center justify-center text-2xl">
                🍳
              </span>
            </div>
          </div>
        ) : recipes.length > 0 ? (
          <>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Found {recipes.length} delicious recipe
                {recipes.length !== 1 ? "s" : ""}
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-white-400 to-white-400 mx-auto rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recipes.map((meal, index) => (
                <div
                  key={meal.idMeal}
                  className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl 
                             transition-all duration-500 transform hover:-translate-y-2
                             border border-orange-100 overflow-hidden"
                  style={{
                    animationDelay: `${index * 100}ms`,
                  }}
                >
                  {/* Image Container */}
                  <div className="relative overflow-hidden bg-gradient-to-br from-orange-100 to-red-100">
                    <img
                      src={meal.strMealThumb}
                      alt={meal.strMeal}
                      className="w-full h-48 object-cover transition-transform duration-700 
                                 group-hover:scale-110"
                    />
                    <div
                      className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent 
                                  opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    ></div>

                    {/* Category Badge */}
                    <div className="absolute top-4 right-4">
                      <span
                        className="bg-white/90 backdrop-blur-sm text-orange-600 px-3 py-1 
                                     rounded-full text-sm font-semibold shadow-lg"
                      >
                        {meal.strCategory}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3
                      className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 
                                   group-hover:text-orange-600 transition-colors duration-300"
                    >
                      {meal.strMeal}
                    </h3>

                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-lg">🌍</span>
                      <span className="text-gray-600 font-medium">
                        {meal.strArea} Cuisine
                      </span>
                    </div>

                    <Link
                      href={`/recipe/${meal.idMeal}`}
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 
                                 text-white px-6 py-3 rounded-lg font-semibold
                                 hover:from-orange-600 hover:to-red-600 
                                 transform hover:scale-105 transition-all duration-300 
                                 shadow-lg hover:shadow-xl group"
                    >
                      <span>View Recipe</span>
                      <span className="transform group-hover:translate-x-1 transition-transform duration-300">
                        →
                      </span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <div className="text-8xl mb-6">🤔</div>
            <h3 className="text-2xl font-bold text-gray-600 mb-2">
              No recipes found
            </h3>
            <p className="text-black-500 max-w-md mx-auto">
              Try searching for something else like "pasta", "chicken", or
              "dessert"
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-8 mt-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-gray-300">Powered by TheMealDB API •</p>
        </div>
      </footer>
    </main>
  );
}
