import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

type Meal = {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strArea: string;
  strCategory: string;
  strInstructions: string;
  strYoutube?: string;
  [key: `strIngredient${number}`]: string;
  [key: `strMeasure${number}`]: string;
};

async function getRecipe(id: string): Promise<Meal | undefined> {
  const res = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
  );
  const data = await res.json();
  return data.meals?.[0];
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const meal = await getRecipe(params.id);

  return {
    title: meal?.strMeal || "Recipe Not Found",
    description: meal
      ? `Learn how to make ${meal.strMeal}, a delicious ${meal.strCategory} dish from ${meal.strArea}`
      : "The requested recipe could not be found",
    ...(meal?.strMealThumb && {
      openGraph: {
        images: [meal.strMealThumb],
      },
    }),
  };
}

interface PageProps {
  params: { id: string };
  searchParams?: Record<string, string | string[] | undefined>;
}

export default async function RecipePage({ params }: PageProps) {
  const meal = await getRecipe(params.id);
  if (!meal) return notFound();

  const ingredients = Array.from({ length: 20 }, (_, i) => {
    const ing = meal[`strIngredient${i + 1}`];
    const measure = meal[`strMeasure${i + 1}`];
    return ing?.trim() ? `${measure} ${ing}` : null;
  }).filter(Boolean) as string[];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      {/* Header Navigation */}
      <div className="bg-white shadow-sm border-b border-orange-100 sticky top-0 z-10 backdrop-blur-sm bg-white/95">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 
                       font-semibold transition-colors duration-300 group"
          >
            <span className="transform group-hover:-translate-x-1 transition-transform duration-300">
              ←
            </span>
            <span>Back to Recipes</span>
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden mb-8 border border-orange-100">
          <div className="relative">
            <Image
              src={meal.strMealThumb}
              alt={meal.strMeal}
              width={800}
              height={450}
              className="w-full h-64 md:h-80 object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>

            {/* Floating Info Card */}
            <div className="absolute bottom-6 left-6 right-6">
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl">
                <h1 className="text-3xl md:text-4xl font-black text-gray-800 mb-3">
                  {meal.strMeal}
                </h1>
                <div className="flex flex-wrap gap-3">
                  <span className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-4 py-2 rounded-full font-semibold">
                    <span>🌍</span>
                    {meal.strArea}
                  </span>
                  <span className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-full font-semibold">
                    <span>🍽️</span>
                    {meal.strCategory}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Ingredients Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-orange-100 sticky top-24">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">🧂</span>
                <h2 className="text-2xl font-bold text-gray-800">
                  Ingredients
                </h2>
              </div>

              <div className="space-y-3">
                {ingredients.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg 
                               hover:bg-orange-100 transition-colors duration-200"
                  >
                    <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700 font-medium">{item}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-orange-100">
                <div className="text-center text-sm text-gray-500">
                  <span className="inline-flex items-center gap-2">
                    <span>📊</span>
                    {ingredients.length} ingredients total
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Instructions Section */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-orange-100">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">👨‍🍳</span>
                <h2 className="text-2xl font-bold text-gray-800">
                  Instructions
                </h2>
              </div>

              <div className="prose prose-lg max-w-none">
                <div className="text-gray-700 leading-relaxed whitespace-pre-line text-base md:text-lg">
                  {meal.strInstructions}
                </div>
              </div>
            </div>

            {/* Video Tutorial Section */}
            {meal.strYoutube && (
              <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-orange-100">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-3xl">📺</span>
                  <h3 className="text-2xl font-bold text-gray-800">
                    Video Tutorial
                  </h3>
                </div>

                <div className="relative rounded-xl overflow-hidden shadow-lg">
                  <iframe
                    className="w-full aspect-video"
                    src={meal.strYoutube.replace("watch?v=", "embed/")}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={`${meal.strMeal} cooking tutorial`}
                  />
                </div>
              </div>
            )}

            {/* Recipe Tips Section */}
            <div className="bg-gradient-to-r from-orange-100 to-red-100 rounded-2xl p-6 md:p-8 border border-orange-200">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">💡</span>
                <h3 className="text-xl font-bold text-gray-800">
                  Cooking Tips
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/70 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">⏱️</span>
                    <span className="font-semibold text-gray-700">
                      Prep Time
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Read through all instructions before starting
                  </p>
                </div>

                <div className="bg-white/70 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">🔥</span>
                    <span className="font-semibold text-gray-700">Cooking</span>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Follow temperatures and timing carefully
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 
                       text-white px-8 py-4 rounded-xl font-semibold text-lg
                       hover:from-orange-600 hover:to-red-600 transform hover:scale-105 
                       transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <span>🔍</span>
            <span>Find More Recipes</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
