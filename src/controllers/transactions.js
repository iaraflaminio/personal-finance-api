const knex = require('../database/connection');

const registerTransaction = async (req, res) => {
    const { description, amount, date, category_id, type } = req.body;
    const { id: user_id } = req.user;

    if (!description || !amount || !date || !category_id || !type) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    if (type !== 'income' && type !== 'expense') {
        return res.status(400).json({ message: 'Type must be either "income" or "expense".' });
    }

    try {
        const categoryExists = await knex('categories').where({ id: category_id }).first();
        if (!categoryExists) {
            return res.status(404).json({ message: 'Category not found.' });
        }
        const [newTransaction] = await knex('transactions').insert({
            description,
            amount,
            date,
            category_id,
            user_id,
            type
        }).returning('*');

        return res.status(201).json(newTransaction);

    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};

const listTransactions = async (req, res) => {
    const { id: user_id } = req.user;
    const { category_id, type } = req.query;

    try {
        const query = knex('transactions')
            .select(
                'transactions.id',
                'transactions.description',
                'transactions.amount',
                'transactions.date',
                'transactions.type',
                'transactions.user_id',
                'transactions.category_id',
                'categories.name as category_name'
            )
            .join('categories', 'transactions.category_id', 'categories.id')
            .where({ 'transactions.user_id': user_id });

        if (category_id) {
            query.where({ 'transactions.category_id': category_id });
        }

        if (type) {
            query.where({ 'transactions.type': type });
        }

        const transactions = await query;

        return res.json(transactions);

    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};

const detailTransaction = async (req, res) => {
    const { id } = req.params;
    const { id: user_id } = req.user;

    try {
        const transaction = await knex('transactions')
            .select(
                'transactions.*',
                'categories.name as category_name'
            )
            .join('categories', 'transactions.category_id', 'categories.id')
            .where({
                'transactions.id': id,
                'transactions.user_id': user_id
            })
            .first();

        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found.' });
        }

        return res.json(transaction);

    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};

const getStatement = async (req, res) => {
    const { id: user_id } = req.user;
    const { from, to } = req.query;

    try {
        const query = () => knex('transactions').where({ user_id });

        const applyFilters = (q) => {
            if (from && to) {
                q.whereBetween('date', [from, to]);
            }
            return q;
        };

        const incomeSum = await applyFilters(query())
            .where({ type: 'income' })
            .sum('amount as total')
            .first();

        const expenseSum = await applyFilters(query())
            .where({ type: 'expense' })
            .sum('amount as total')
            .first();

        const income = Number(incomeSum.total) || 0;
        const expense = Number(expenseSum.total) || 0;

        return res.json({
            income,
            expense,
            balance: income - expense
        });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};

const updateTransaction = async (req, res) => {
    const { id } = req.params;
    const { id: user_id } = req.user;
    const { description, amount, date, category_id, type } = req.body;

    if (!description || !amount || !date || !category_id || !type) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    if (type !== 'income' && type !== 'expense') {
        return res.status(400).json({ message: 'Type must be either "income" or "expense".' });
    }

    try {
        const transaction = await knex('transactions')
            .where({ id, user_id })
            .first();

        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        const categoryExists = await knex('categories').where({ id: category_id }).first();
        if (!categoryExists) {
            return res.status(404).json({ message: 'Category not found.' })
        }

        await knex('transactions')
            .where({ id, user_id })
            .update({
                description,
                amount,
                date,
                category_id,
                type
            });

        return res.status(204).send();
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};

const deleteTransaction = async (req, res) => {
    const { id } = req.params;
    const { id: user_id } = req.user;

    try {
        const transaction = await knex('transactions')
            .where({ id, user_id })
            .first();

        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        await knex('transactions')
            .where({ id, user_id })
            .del();

        return res.status(204).send();

    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};

module.exports = {
    registerTransaction,
    listTransactions,
    detailTransaction,
    getStatement,
    updateTransaction,
    deleteTransaction
}