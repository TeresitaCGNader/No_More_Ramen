// Sample recipe data
const recipes = [
    {
      name: 'Chocolate Cake',
      content: 'Preheat the oven...',
      created_time: '2022-04-01 12:30:00'
    },
    {
      name: 'Brownies',
      content: 'Mix together butter...',
      created_time: '2022-04-03 11:15:00'
    },
    {
      name: 'Pizza',
      content: 'Make the pizza dough...',
      created_time: '2022-04-02 13:45:00'
    },
    {
      name: 'Tacos',
      content: 'Cook the ground beef...',
      created_time: '2022-04-04 10:00:00'
    },
    {
      name: 'Pancakes',
      content: 'Mix together flour...',
      created_time: '2022-04-10 4:45:00'
    }
  ];
  
  // Function to create recipe cards dynamically
  function createRecipeCard(name, content, createdTime) {
    const recipeContainer = document.getElementById('recipeContainer');
  
    const recipeDiv = document.createElement('div');
    recipeDiv.className = 'recipe-container';
  
    const recipeBlock = document.createElement('div');
    recipeBlock.className = 'recipe-block';
  
    const recipeTitle = document.createElement('h2');
    recipeTitle.textContent = name;
  
    const recipeDate = document.createElement('p');
    recipeDate.textContent = formatDate(createdTime);
  
    recipeBlock.appendChild(recipeTitle);
    recipeBlock.appendChild(recipeDate);
    recipeDiv.appendChild(recipeBlock);
    recipeContainer.appendChild(recipeDiv);
  }
  
  // Function to format the date in a desired format (e.g., "April 1, 2022")
  function formatDate(dateString) {
    const options = { month: 'long', day: 'numeric', year: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
  }
  
  // Sort recipes by created_time in descending order
  recipes.sort((a, b) => new Date(b.created_time) - new Date(a.created_time));
  
  // Display most recent recipes
  const recentRecipes = recipes.slice(0, 4); // Get the most recent 4 recipes
  
  const recipeGrid = document.createElement('div');
  recipeGrid.className = 'recipe-grid';
  
  recentRecipes.forEach(recipe => {
    createRecipeCard(recipe.name, recipe.content, recipe.created_time);
  });
  
  const recipeContainer = document.getElementById('recipeContainer');
  recipeContainer.appendChild(recipeGrid);