/**
 * Utility functions for managing kebab recipes in local storage
 */

const RECIPES_KEY = "city-kebab-recipes";

/**
 * Get all saved recipes from local storage
 * @returns {Array} Array of saved recipes
 */
export const getSavedRecipes = () => {
  try {
    const recipes = localStorage.getItem(RECIPES_KEY);
    return recipes ? JSON.parse(recipes) : [];
  } catch (error) {
    console.error("Error loading recipes from localStorage:", error);
    return [];
  }
};

/**
 * Save a new recipe to local storage
 * @param {Object} recipe - The recipe object to save
 * @param {string} recipe.name - Name of the recipe
 * @param {string} recipe.userName - User's name or nickname (optional)
 * @param {string} recipe.kebabType - Type of kebab
 * @param {string} recipe.kebabSize - Size of kebab (optional)
 * @param {Array} recipe.adds - Array of selected add-ons
 * @param {boolean} recipe.hasCheese - Whether recipe includes cheese
 * @param {string} recipe.sauce - Selected sauce
 * @returns {boolean} Success status
 */
export const saveRecipe = (recipe) => {
  try {
    const recipes = getSavedRecipes();
    const newRecipe = {
      ...recipe,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };

    recipes.push(newRecipe);
    localStorage.setItem(RECIPES_KEY, JSON.stringify(recipes));
    return true;
  } catch (error) {
    console.error("Error saving recipe to localStorage:", error);
    return false;
  }
};

/**
 * Delete a recipe from local storage
 * @param {string} recipeId - ID of the recipe to delete
 * @returns {boolean} Success status
 */
export const deleteRecipe = (recipeId) => {
  try {
    const recipes = getSavedRecipes();
    const filteredRecipes = recipes.filter((recipe) => recipe.id !== recipeId);
    localStorage.setItem(RECIPES_KEY, JSON.stringify(filteredRecipes));
    return true;
  } catch (error) {
    console.error("Error deleting recipe from localStorage:", error);
    return false;
  }
};

/**
 * Get a specific recipe by ID
 * @param {string} recipeId - ID of the recipe to retrieve
 * @returns {Object|null} Recipe object or null if not found
 */
export const getRecipeById = (recipeId) => {
  try {
    const recipes = getSavedRecipes();
    return recipes.find((recipe) => recipe.id === recipeId) || null;
  } catch (error) {
    console.error("Error getting recipe by ID:", error);
    return null;
  }
};

/**
 * Clear all saved recipes
 * @returns {boolean} Success status
 */
export const clearAllRecipes = () => {
  try {
    localStorage.removeItem(RECIPES_KEY);
    return true;
  } catch (error) {
    console.error("Error clearing recipes from localStorage:", error);
    return false;
  }
};

