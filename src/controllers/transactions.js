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

module.exports = {
    registerTransaction
}