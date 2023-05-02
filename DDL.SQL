SET FOREIGN_KEY_CHECKS=0;
SET AUTOCOMMIT = 0;

CREATE OR REPLACE TABLE Users (
  user_id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  email VARCHAR(100) NOT NULL
);

CREATE OR REPLACE TABLE Recipes (
  recipe_id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
  author_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  content LONGTEXT,
  created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (author_id) REFERENCES Users(user_id)
);

CREATE OR REPLACE TABLE Units (
  unit_id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
  measurement_type VARCHAR(20) NOT NULL,
  name VARCHAR(20) NOT NULL
);

CREATE OR REPLACE TABLE Ingredients (
  ingredient_id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  unit_id INT NOT NULL,
  price_per_unit FLOAT NOT NULL,
  FOREIGN KEY (unit_id) REFERENCES Units(unit_id)
);

CREATE OR REPLACE TABLE Restrictions (
  restr_id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
  name VARCHAR(50) NOT NULL
);

CREATE OR REPLACE TABLE RecipeIngredients (
  recipe_id INT NOT NULL,
  ingredient_id INT NOT NULL,
  quantity DOUBLE NOT NULL,
  PRIMARY KEY (recipe_id, ingredient_id),
  FOREIGN KEY (recipe_id) REFERENCES Recipes(recipe_id),
  FOREIGN KEY (ingredient_id) REFERENCES Ingredients(ingredient_id)
);

CREATE OR REPLACE TABLE IngredientRestrictions (
  ingredient_id INT NOT NULL,
  restr_id INT NOT NULL,
  PRIMARY KEY (ingredient_id, restr_id),
  FOREIGN KEY (ingredient_id) REFERENCES Ingredients(ingredient_id),
  FOREIGN KEY (restr_id) REFERENCES Restrictions(restr_id)
);

SET FOREIGN_KEY_CHECKS=1;
COMMIT;


INSERT INTO Users (user_id, first_name, last_name, email)
VALUES (1, 'John', 'Doe', 'john.doe@example.com'),
(2, 'Jane', 'Smith', 'jane.smith@example.com'),
(3, 'Tom', 'Brown', 'tom.brown@example.com'),
(4, 'Sarah', 'Lee', 'sarah.lee@example.com');


INSERT INTO Recipes (recipe_id, author_id, name, content, created_time)
VALUES (1, 1, 'Chocolate Cake', 'Preheat the oven...', '2022-04-01 12:30:00'),
(2, 1, 'Pizza', 'Make the pizza dough...', '2022-04-02 13:45:00'),
(3, 2, 'Brownies', 'Mix together butter...', '2022-04-03 11:15:00'),
(4, 2, 'Tacos', 'Cook the ground beef...', '2022-04-04 10:00:00'),
(10, 3, 'Pancakes', 'Mix together flour...', '2022-04-10 4:45:00');


INSERT INTO Ingredients (ingredient_id, name, unit_id, price_per_unit)
VALUES (1, 'Flour', 1, 2.99),
(2, 'Sugar', 1, 1.99),
(3, 'Salt', 1, 0.99),
(4, 'Pepper', 1, 1.49),
(5, 'Olive Oil', 6, 5.99),
(6, 'Cheese', 1, 3.99),
(7, 'Chicken', 2, 7.99),
(8, 'Beef', 2, 9.99),
(9, 'Carrots', 1, 1.49),
(10, 'Broccoli', 1, 1.99);


INSERT INTO Units (unit_id, measurement_type, name)
VALUES (1, 'Weight', 'oz'),
(2, 'Weight', 'lb'),
(3, 'Volume', 'tsp'),
(4, 'Volume', 'tbsp'),
(5, 'Volume', 'cup'),
(6, 'Volume', 'fluid ounce'),
(7, 'Volume', 'quart'),
(8, 'Volume', 'gallon'),
(9, 'Length', 'inch');


INSERT INTO Restrictions (restr_id, name)
VALUES (1, 'Peanuts'),
(2, 'Tree Nuts'),
(3, 'Dairy'),
(4, 'Eggs'),
(5, 'Fish'),
(6, 'Shellfish'),
(7, 'Wheat'),
(8, 'Soy'),
(9, 'Gluten-Free'),
(10, 'Vegetarian'),
(11, 'Vegan'),
(12, 'Kosher'),
(13, 'Halal'),
(14, 'Low Sodium'),
(15, 'Low Fat'),
(16, 'Low Carb'),
(17, 'Diabetic-Friendly'),
(18, 'Nut-Free'),
(19, 'Lactose-Free'),
(20, 'High Protein');