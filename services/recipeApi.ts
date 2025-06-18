import axios, { AxiosError } from "axios";
import { RecipeSearchResponse, Recipe } from "@/types";

// Validate environment variables at startup
const validateEnvVars = () => {
  const APP_ID = process.env.NEXT_PUBLIC_EDAMAM_APP_ID;
  const APP_KEY = process.env.NEXT_PUBLIC_EDAMAM_APP_KEY;
  
  if (!APP_ID || !APP_KEY) {
    throw new Error("Edamam API credentials are missing. Please check your environment variables.");
  }
  return { APP_ID, APP_KEY };
};

const { APP_ID, APP_KEY } = validateEnvVars();
const BASE_URL = "https://api.edamam.com/api/recipes/v2";

// Define default parameters to reduce repetition
const DEFAULT_PARAMS = {
  type: "public",
  app_id: APP_ID,
  app_key: APP_KEY,
};

export const searchRecipes = async (query: string): Promise<Recipe[]> => {
  try {
    // Validate query before making the request
    if (!query.trim()) {
      throw new Error("Search query cannot be empty");
    }

    const response = await axios.get<RecipeSearchResponse>(BASE_URL, {
      params: {
        ...DEFAULT_PARAMS,
        q: query,
        field: [  // Explicitly request only needed fields
          "uri",
          "label",
          "image",
          "source",
          "url",
          "yield",
          "calories",
          "totalTime",
          "ingredientLines"
        ].join(",")
      },
      timeout: 5000, // Set timeout to 5 seconds
    });

    return response.data.hits.map((hit) => hit.recipe);
  } catch (error) {
    const axiosError = error as AxiosError;
    
    if (axiosError.response) {
      // Handle specific HTTP errors
      switch (axiosError.response.status) {
        case 401:
          throw new Error("Invalid API credentials - please check your configuration");
        case 404:
          throw new Error("API endpoint not found");
        case 429:
          throw new Error("API rate limit exceeded - please try again later");
        default:
          throw new Error(`API request failed with status ${axiosError.response.status}`);
      }
    } else if (axiosError.request) {
      throw new Error("No response received from the API server");
    } else {
      throw new Error(`Error setting up API request: ${axiosError.message}`);
    }
  }
};

// Utility function for direct API health check
export const checkApiHealth = async (): Promise<boolean> => {
  try {
    await axios.get(BASE_URL, {
      params: {
        ...DEFAULT_PARAMS,
        q: "test",
        timeout: 3000
      }
    });
    return true;
  } catch {
    return false;
  }
};