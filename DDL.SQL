SET FOREIGN_KEY_CHECKS=0;
SET AUTOCOMMIT = 0;

CREATE OR REPLACE TABLE Users (
  user_id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  email VARCHAR(100) NOT NULL
);

CREATE OR REPLACE TABLE Recipes (
  recipe_id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
  author_id INT NULL,
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