const express = require('express');
const { listCategories } = require('./controllers/categories');
const { registerUser, login, detailUser, updateUser } = require('./controllers/users');
const verifyLogin = require('./middlewares/auth');
const { registerTransaction, listTransactions, detailTransaction, getStatement, updateTransaction } = require('./controllers/transactions');

const routes = express.Router();

routes.get('/', (req, res) => {
    return res.json({message: 'Welcome to the Personal Finance API! 🚀'})
});

//users
routes.post('/newuser', registerUser);
routes.post('/login', login);

routes.use(verifyLogin);

routes.get('/profile', detailUser);
routes.put('/profileupdate', updateUser);

//categories route
routes.get('/categories', listCategories);

//transactions
routes.post('/newtransaction', registerTransaction);
routes.get('/transactions', listTransactions);
routes.get('/transaction/:id', detailTransaction);
routes.get('/transactions/statement', getStatement);
routes.put('/transactions/edit/:id', updateTransaction);

module.exports = routes;