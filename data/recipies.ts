// Sample API that returns all recipes
const recipes = [
  {
    id: 'spaghetti-carbonara',
    title: 'Spaghetti Carbonara',
    ingredients: ['Spaghetti', 'Eggs', 'Parmesan', 'Pancetta', 'Pepper'],
    steps: [
      'Cook spaghetti until al dente.',
      'Fry pancetta until crispy.',
      'Whisk eggs and cheese together.',
      'Combine all with drained pasta.',
    ],
    image: '/carbonara.jpg',
  },
  {
    id: 'veggie-curry',
    title: 'Veggie Curry',
    ingredients: ['Potato', 'Carrot', 'Peas', 'Curry Powder', 'Coconut Milk'],
    steps: [
      'Sauté veggies in oil.',
      'Add curry powder and cook briefly.',
      'Pour in coconut milk and simmer.',
      'Serve with rice.',
    ],
    image: '/veggie-curry.jpg',
  },
];

export default function handler(req: { query: { id: any; }; }, res: { status: (arg0: number) => { (): any; new(): any; json: { (arg0: { id?: string; title?: string; ingredients?: string[]; steps?: string[]; image?: string; message?: string; }): void; new(): any; }; }; }) {
  const { id } = req.query;
  const recipe = recipes.find(r => r.id === id);

  if (recipe) {
    res.status(200).json(recipe);
  } else {
    res.status(404).json({ message: 'Recipe not found' });
  }
}
