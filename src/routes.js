const express = require('express');
const { listCategories } = require('./controllers/categories');

const routes = express.Router();

routes.get('/', (req, res) => {
    return res.json({message: 'Welcome to the Personal Finance API! 🚀'})
});

//categories route
routes.get('/categories', listCategories)

module.exports = routes;