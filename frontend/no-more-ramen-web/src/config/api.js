/**
 * Base URL for all API calls.
 * ------
 * Change this to the server URL if it changes.
 */
const baseUrl = 'http://flip1.engr.oregonstate.edu:5550/';

/**
 * This interface makes it easier to access and change API endpoints.
 *
 * Example usage:
 * fetch(api.users, { method: 'GET' })
 */
const api = {
    users: baseUrl + 'users',
    ingredients: baseUrl + 'ingredients',
    recipes: baseUrl + 'recipes',
    units: baseUrl + 'units',
    restrictions: baseUrl + 'restrictions',
    recipeIngredients: baseUrl + 'recipe-ingredients',
    ingredientRestrictions: baseUrl + 'ingredient-restrictions',
};

export default api;
