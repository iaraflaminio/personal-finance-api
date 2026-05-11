const express = require('express');
const { listCategories } = require('./controllers/categories');
const { registerUser } = require('./controllers/users');

const routes = express.Router();

routes.get('/', (req, res) => {
    return res.json({message: 'Welcome to the Personal Finance API! 🚀'})
});

//users
routes.post('/newuser', registerUser)

//categories route
routes.get('/categories', listCategories)

module.exports = routes;