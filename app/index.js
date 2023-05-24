const express = require('express');
const exphbs = require('express-handlebars');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');

const mysqlConnection = require('./db/connection');

const userRoutes = require('./routes/users');

dotenv.config();

const app = express();

app.engine(
    'hbs',
    exphbs.engine({
        extname: '.hbs',
    })
);
app.set('view engine', 'hbs');

app.use(bodyParser.json());

mysqlConnection.connect((err) => {
    if (err) {
        throw err;
    }

    console.log('Connected to MySQL Server!');
});

app.use('/users', userRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Server listening on port ${process.env.PORT}`);
});
