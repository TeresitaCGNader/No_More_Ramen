/**
 * Base URL for all API calls
 */
const baseUrl = "http://localhost:5550/";

const api = {
  users: baseUrl + "users",
  ingredients: baseUrl + "ingredients",
  recipes: baseUrl + "recipes",
  units: baseUrl + "units",
  restrictions: baseUrl + "restrictions",
  recipeIngredients: baseUrl + "recipe-ingredients",
  ingredientRestrictions: baseUrl + "ingredient-restrictions",
};

export default api;
