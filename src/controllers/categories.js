const knex = require('../database/connection');

const listCategories = async (req, res) => {
    try {
        const categories = await knex('categories').select('name');

        if (categories.length === 0) {
            return res.status(200).json([]);
        }

        return res.status(200).json(categories);
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({message: 'Internal server error.'});
    }
};

module.exports = {
    listCategories
};