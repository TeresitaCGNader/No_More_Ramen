<h1>Live Website</h1>
https://web.engr.oregonstate.edu/~guzmannt/cs340/No_More_Ramen/app/index.html (old version with no database)
http://flip1.engr.oregonstate.edu:5550/users (new version with database)

<h1>Project Overview</h1>
<p>Navigating the complexities of budgeting as a college student has always been a challenge. LivingCost reports that Corvallis, Oregon has an average cost of living of $1983[1]. However, three of the most crucial groceries for college students, namely eggs (12 for $3.74), rice (1 kg or 2.2 lb for $3.51), and chicken breast (1 kg or 2.2 lb for $11.1), are among the priciest items. Consequently, they often resort to austerity foods such as instant mac and cheese, ramen, oatmeal, etc. Our mission is to empower students with exciting meal options that promote both financial savviness and culinary satisfaction, enabling them to cut down expenses without compromising on their taste buds or health.</p>
<p>No longer do students need to rely on bland, inexpensive meals. No More Ramen is a web platform for crowd-sourcing budget-conscious and delicious recipes aimed at students in Corvallis (designed to serve ~35000 members of the OSU student body). Students will be able to share and find recipes within their budget, calculated based on the approximate price of ingredients. The website will utilize a database backend to record recipes, their authors, the ingredients used in the recipes, their costs, as well as special dietary restrictions. The cost calculation was designed with a manually curated reference table (2023 sources) in mind.</p>

<h2>Color Palette for Website</h2>

![color palette](color_palette_for_website.png)

## Setup Local Docker instance for testing database

1. Install Docker
2. Run `docker run --name mysql_container -p 3350:3306 -e MYSQL_ROOT_PASSWORD=admin -d mysql:latest`
3. Connect to it on MySQL Workbench.
4. Run `CREATE DATABASE db; USE db;` in a Query Executor.
5. Copy and paste the contents of `DDL.SQL` and Execute.

## Running the frontend

1. `cd frontend/no-more-ramen-web`
2. Open `config/api.js` and edit the base URL to the server URL (eg. `'http://flip1.engr.oregonstate.edu:5550/'` if it isn't already).
3. `npm i`
4. `npm run dev` -- This should start up the app on your browser.
5. Any changes you make should be reflected on save. If not, kill the process and go back to step 4.
