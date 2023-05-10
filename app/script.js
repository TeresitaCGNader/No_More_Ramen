// Sample recipe data
const recipes = [
    {
      name: 'Chocolate Cake',
      content: 'Preheat the oven...'
    },
    {
      name: 'Brownies',
      content: 'Mix together butter...'
    },
    {
      name: 'Pizza',
      content: 'Make the pizza dough...'
    },
    {
      name: 'Tacos',
      content: 'Cook the ground beef...'
    },
    {
      name: 'Pancakes',
      content: 'Mix together flour...'
    }
  ];
  
  // Function to create recipe cards dynamically
  function createRecipeCard(name, content) {
    const recipeContainer = document.getElementById('recipeContainer');
  
    const recipeDiv = document.createElement('div');
    recipeDiv.className = 'recipe-container';
  
    const recipeBlock = document.createElement('div');
    recipeBlock.className = 'recipe-block';
  
    const recipeTitle = document.createElement('h2');
    recipeTitle.textContent = name;
  
    const recipeDescription = document.createElement('p');
    recipeDescription.textContent = content;
  
    recipeBlock.appendChild(recipeTitle);
    recipeBlock.appendChild(recipeDescription);
    recipeDiv.appendChild(recipeBlock);
    recipeContainer.appendChild(recipeDiv);
  }
  
  // Sort recipes by created_time in descending order
  recipes.sort((a, b) => new Date(b.created_time) - new Date(a.created_time));
  
  // Display most recent recipes
  const recentRecipes = recipes.slice(0, 4); // Get the most recent 4 recipes
  recentRecipes.forEach(recipe => {
    createRecipeCard(recipe.name, recipe.content);
  });