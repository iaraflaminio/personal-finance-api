const knex = require('../database/connection');
const bcrypt = require('bcrypt');

const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({message: 'All fields are required.'});
    }

    try {
        const userExists = await knex('users').where({ email }).first();

        if (userExists) {
            return res.status(400).json({ message: 'Email already registered.' })
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const newUser = await knex('users').insert({
            name,
            email,
            password: passwordHash
        }).returning(['id', 'name', 'email']);

        if (!newUser) {
            return res.status(400).json({ message: 'User not registered, try again'})
        }

        return res.status(201).json(newUser[0]);
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: 'Internal server error.' });
    }
}

module.exports = {
    registerUser
}