/*
    Users
*/

-- Insert a new user

INSERT INTO Users (first_name, last_name, email) VALUES (:firstNameInput, :lastNameInput, :emailInput);

-- Edit a user
UPDATE Users 
SET first_name = :firstNameInput, last_name = :lastNameInput, email = :emailInput
WHERE user_id = :userIdInput;

-- Delete a user

DELETE FROM Users WHERE user_id = 1;

-- Retrieve all users

SELECT * FROM Users;


/*
    Recipes
*/

-- Select all recipes sorted by creation time
SELECT * FROM Recipes ORDER BY created_time DESC;

-- Select the latest 5 recipes
SELECT * FROM Recipes ORDER BY created_time DESC LIMIT 5;

-- Add recipe
INSERT INTO Recipes (author_id, name, content) 
VALUES (:authorIdInput, :nameInput, :contentInput);

-- Edit recipe
UPDATE Recipes 
SET author_id = :authorIdInput, name = :nameInput, content = :contentInput 
WHERE recipe_id = :recipeIdInput;

-- Delete recipe
DELETE FROM Recipes 
WHERE recipe_id = :recipeIdInput;

/* 
    Restrictions 
*/

-- List restrictions
SELECT * FROM Restrictions;

-- Add restriction
INSERT INTO Restrictions (name) 
VALUES (:nameInput);

-- Edit restriction
UPDATE Restrictions 
SET name = :nameInput 
WHERE restr_id = :restrIdInput;

-- Delete restriction
DELETE FROM Restrictions 
WHERE restr_id = :restrIdInput;

-- Find how many ingredients have a specific restriction
-- Useful before deleting restrictions
SELECT COUNT(*) 
FROM Ingredients 
WHERE ingredient_id IN (
  SELECT ingredient_id 
  FROM Ingredient_Restrictions 
  WHERE restr_id = :restrIdInput
);

/*
    Ingredients
*/

-- List ingredients
SELECT * FROM Ingredients;

-- Create ingredient
INSERT INTO Ingredients (name, unit_id, price_per_unit) 
VALUES (:nameInput, :unitIdInput, :pricePerUnitInput);

-- Edit ingredient
UPDATE Ingredients 
SET name = :nameInput, unit_id = :unitIdInput, price_per_unit = :pricePerUnitInput 
WHERE ingredient_id = :ingredientIdInput;

-- Delete ingredient
DELETE FROM Ingredients 
WHERE ingredient_id = :ingredientIdInput;

/*
    IngredientRestrictions
*/

-- Find out how many restrictions are associated with an ingredient
SELECT Restrictions.name AS restriction_name
FROM IngredientRestrictions
JOIN Restrictions
ON IngredientRestrictions.restr_id = Restrictions.restr_id
WHERE IngredientRestrictions.ingredient_id = :ingredientIdInput;

/*
    Units
*/

-- List units
SELECT * FROM Units;

-- Create unit
INSERT INTO Units (name) 
VALUES (:nameInput);

-- Edit unit
UPDATE Units 
SET name = :nameInput 
WHERE unit_id = :unitIdInput;

-- Delete unit
DELETE FROM Units 
WHERE unit_id = :unitIdInput;
