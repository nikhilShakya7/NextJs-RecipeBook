export interface Recipe{
    uri: string;
    label: string;
    image: string;
    source: string;
    url: string;
    yield:number;
    calories:number;
    totalTime:number;
    ingredients: string[];
}
export interface RecipeSearchResponse{
    hits: {
        recipe:Recipe;
    }[];
}