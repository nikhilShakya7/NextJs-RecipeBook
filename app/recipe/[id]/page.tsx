import { notFound } from "next/navigation";

async function getRecipe(id: string) {
  const res = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
  );
  const data = await res.json();
  return data.meals?.[0];
}

export default async function RecipePage({
  params,
}: {
  params: { id: string };
}) {
  const meal = await getRecipe(params.id);

  if (!meal) return notFound();

  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ing = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ing && ing.trim()) ingredients.push(`${measure} ${ing}`);
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">{meal.strMeal}</h1>
      <p className="text-gray-600 mb-2">
        {meal.strArea} • {meal.strCategory}
      </p>
      <img
        src={meal.strMealThumb}
        alt={meal.strMeal}
        className="rounded-lg w-full mb-4"
      />

      <h2 className="text-xl font-semibold mt-4">🧂 Ingredients</h2>
      <ul className="list-disc pl-5 mb-4">
        {ingredients.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>

      <h2 className="text-xl font-semibold mt-4">👨‍🍳 Instructions</h2>
      <p className="whitespace-pre-line text-sm text-gray-800">
        {meal.strInstructions}
      </p>

      {meal.strYoutube && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">📺 Video Tutorial</h3>
          <iframe
            className="w-full aspect-video rounded-lg"
            src={meal.strYoutube.replace("watch?v=", "embed/")}
            frameBorder="0"
            allowFullScreen
          />
        </div>
      )}

      <a href="/" className="mt-6 inline-block text-blue-600 underline">
        ← Back to Home
      </a>
    </div>
  );
}
