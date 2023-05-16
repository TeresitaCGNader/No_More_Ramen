SET FOREIGN_KEY_CHECKS=0;
SET AUTOCOMMIT = 0;

-- Drop previous instances of tables
DROP TABLE IF EXISTS Users;
DROP TABLE IF EXISTS Recipes;
DROP TABLE IF EXISTS Units;
DROP TABLE IF EXISTS Ingredients;
DROP TABLE IF EXISTS Restrictions;
DROP TABLE IF EXISTS RecipeIngredients;
DROP TABLE IF EXISTS IngredientRestrictions;

-- Users
-- Records the details of the Users that will use the recipe website. Our primary target demographic is college students so we are assuming that most users are college students living in or near Oregon.

CREATE TABLE IF NOT EXISTS Users (
  user_id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(100) NOT NULL
);

-- Recipes
-- Records the details of the recipes written by users. Users will be able to see all recipes that are not filtered out by other options. Authors are not required as recipes can be written anonymously.

CREATE TABLE IF NOT EXISTS Recipes (
  recipe_id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
  author_id INT,
  name VARCHAR(100) NOT NULL,
  content LONGTEXT,
  created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_r_user FOREIGN KEY (author_id) REFERENCES Users(user_id) ON DELETE SET NULL
);

-- Units
-- Records types of units for each ingredient. This category table is used to differentiate between different units of measurements.

CREATE TABLE IF NOT EXISTS Units (
  unit_id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
  name VARCHAR(20) NOT NULL
);

-- Ingredients: records the details of the Ingredients stored on the website. This table will be manually curated by the team to ensure accurate prices for the most common ingredients.

CREATE TABLE IF NOT EXISTS Ingredients (
  ingredient_id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  unit_id INT NOT NULL,
  price_per_unit FLOAT NOT NULL,
  CONSTRAINT fk_i_unit FOREIGN KEY (unit_id) REFERENCES Units(unit_id) ON DELETE CASCADE
);

-- Restrictions
-- Category table to store the most common dietary restrictions used to filter out recipes incompatible with some users. We will use common dietary restrictions associated with lifestyle decisions and religion, as well as the FDA’s list of major allergen groups.

CREATE TABLE IF NOT EXISTS Restrictions (
  restr_id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
  name VARCHAR(50) NOT NULL
);

-- RecipeIngredients
-- Junction table to facilitate the relationship between Recipes and Ingredients. This table also has the quantity of the ingredient used in the associated recipe, using the unit of measurement defined in the Ingredients table.

CREATE TABLE IF NOT EXISTS RecipeIngredients (
  recipe_id INT NOT NULL,
  ingredient_id INT NOT NULL,
  quantity DOUBLE NOT NULL,
  PRIMARY KEY (recipe_id, ingredient_id),
  CONSTRAINT fk_ri_recipe FOREIGN KEY (recipe_id) REFERENCES Recipes(recipe_id) ON DELETE CASCADE,
  CONSTRAINT fk_ri_ingredient FOREIGN KEY (ingredient_id) REFERENCES Ingredients(ingredient_id) ON DELETE CASCADE
);

-- IngredientRestrictions
-- Junction table to facilitate the M:N relationship between Ingredients and Restrictions.

CREATE TABLE IF NOT EXISTS IngredientRestrictions (
  ingredient_id INT NOT NULL,
  restr_id INT NOT NULL,
  PRIMARY KEY (ingredient_id, restr_id),
  CONSTRAINT fk_ir_ingredient FOREIGN KEY (ingredient_id) REFERENCES Ingredients(ingredient_id) ON DELETE CASCADE,
  CONSTRAINT fk_ir_restr FOREIGN KEY (restr_id) REFERENCES Restrictions(restr_id) ON DELETE CASCADE
);

-- Sample Data
INSERT INTO Users (first_name, last_name, email)
VALUES ('John', 'Doe', 'john.doe@example.com'),
       ('Jane', 'Smith', 'jane.smith@example.com'),
       ('Tom', 'Brown', 'tom.brown@example.com'),
       ('Sarah', 'Lee', 'sarah.lee@example.com');

INSERT INTO Recipes (author_id, name, content, created_time)
VALUES (1, 'Chocolate Cake', 'Preheat the oven...', '2022-04-01 12:30:00'),
       (2, 'Brownies', 'Mix together butter...', '2022-04-03 11:15:00'),
       (1, 'Pizza', 'Make the pizza dough...', '2022-04-02 13:45:00'),
       (2, 'Tacos', 'Cook the ground beef...', '2022-04-04 10:00:00'),
       (null, 'Pancakes', 'Mix together flour...', '2022-04-10 4:45:00');

INSERT INTO Units (name)
VALUES ('oz'),
       ('lb'),
       ('tsp'),
       ('tbsp'),
       ('cup'),
       ('fluid ounce'),
       ('quart'),
       ('gallon'),
       ('inch');

INSERT INTO Restrictions (name)
VALUES ('Peanuts'),
       ('Tree Nuts'),
       ('Dairy'),
       ('Eggs'),
       ('Fish'),
       ('Shellfish'),
       ('Wheat'),
       ('Soy'),
       ('Has Gluten'),
       ('Non-Vegetarian'),
       ('Non-Vegan'),
       ('Non-Kosher'),
       ('Non-Halal');

INSERT INTO Ingredients (name, unit_id, price_per_unit)
-- Chocolate Cake Ingredients
VALUES ('Flour', 5, 0.50),            -- cups
       ('Sugar', 5, 0.65),            -- cups
       ('Eggs', 6, 0.25),             -- fluid ounces (assuming 1 egg = 1.75 fl oz)
       ('Milk', 6, 0.10),             -- fluid ounces

-- Brownies Ingredients
       ('Butter', 5, 1.00),           -- cups
       ('Baking Powder', 4, 0.03),    -- tablespoons
       ('Vanilla Extract', 4, 0.25),  -- tablespoons
       ('Chocolate Chips', 2, 1.50),  -- pounds

-- Pizza Ingredients
       ('Olive Oil', 6, 0.15),        -- fluid ounces
       ('Tomato Sauce', 5, 0.75),     -- cups
       ('Cheese', 2, 1.25),           -- pounds
       ('Pepperoni', 2, 0.80),        -- pounds

-- Tacos Ingredients
       ('Cocoa Powder', 5, 0.70),     -- cups
       ('Baking Soda', 4, 0.02),      -- tablespoons
       ('Salt', 4, 0.01),             -- tablespoons
       ('Ground Beef', 2, 3.00);      -- pounds

INSERT INTO RecipeIngredients (recipe_id, ingredient_id, quantity)
-- Chocolate Cake RecipeIngredients
VALUES (1, 1, 2.0), -- 2 cups of Flour
(1, 2, 1.5), -- 1.5 cups of Sugar
(1, 3, 3.5), -- 3.5 fluid ounces of Eggs (2 eggs)
(1, 4, 8.0), -- 8 fluid ounces of Milk

-- Brownies RecipeIngredients
(2, 5, 0.5), -- 0.5 cups of Butter
(2, 6, 1.0), -- 1 tablespoon of Baking Powder
(2, 7, 2.0), -- 2 tablespoons of Vanilla Extract
(2, 8, 0.5), -- 0.5 pounds of Chocolate Chips

-- Pizza RecipeIngredients
(3, 9, 2.0), -- 2 fluid ounces of Olive Oil
(3, 10, 2.0), -- 2 cups of Tomato Sauce
(3, 11, 1.0), -- 1 pound of Cheese
(3, 12, 0.5), -- 0.5 pounds of Pepperoni

-- Tacos RecipeIngredients
(4, 13, 1.0), -- 1 cup of Cocoa Powder
(4, 14, 0.5), -- 0.5 tablespoons of Baking Soda
(4, 15, 1.0), -- 1 tablespoon of Salt
(4, 16, 1.0); -- 1 pound of Ground Beef

INSERT INTO IngredientRestrictions (ingredient_id, restr_id)
VALUES
-- Chocolate Cake Ingredients
(1, 9), -- Flour: Has Gluten
(3, 4), -- Eggs: Eggs
(3, 11), -- Eggs: Non-Vegan
(4, 3), -- Milk: Dairy
(4, 11), -- Milk: Non-Vegan

-- Brownies Ingredients
(5, 3), -- Butter: Dairy
(8, 2), -- Chocolate Chips: Tree Nuts (assuming chocolate chips contain traces of nuts)

-- Pizza Ingredients
(9, 8), -- Olive Oil: Soy (assuming the oil contains traces of soy)
(10, 10), -- Tomato Sauce: Non-Vegetarian (assuming the sauce contains meat)
(11, 3), -- Cheese: Dairy
(11, 11), -- Cheese: Non-Vegan
(12, 10), -- Pepperoni: Non-Vegetarian
(12, 11), -- Pepperoni: Non-Vegan
(12, 12), -- Pepperoni: Non-Kosher
(12, 13), -- Pepperoni: Non-Halal

-- Tacos Ingredients
(16, 10), -- Ground Beef: Non-Vegetarian
(16, 11), -- Ground Beef: Non-Vegan
(16, 12), -- Ground Beef: Non-Kosher
(16, 13); -- Ground Beef: Non-Halal

SET FOREIGN_KEY_CHECKS=1;
COMMIT;