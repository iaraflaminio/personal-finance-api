const knex = require('../database/connection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'All fields are required.' });
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
            return res.status(400).json({ message: 'User not registered, try again' })
        }

        return res.status(201).json(newUser[0]);
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
        const user = await knex('users').where({ email }).first();

        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);

        if (!isValidPassword) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: '8h'
        });

        const { password: _, ...userData } = user;

        return res.json({
            user: userData,
            token
        });

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};

const detailUser = async (req, res) => {
    return res.json(req.user);
};

const updateUser = async (req, res) => {
    const { name, email, password } = req.body;
    const { id } = req.user;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        const emailConflict = await knex('users')
            .where({ email })
            .whereNot({ id })
            .first();

            if (emailConflict) {
                return res.status(400).json({ message: 'The email is already in use by another user.' });
            }

            const passwordHash = await bcrypt.hash(password, 10);

            await knex('users')
            .where({ id })
            .update({
                name,
                email,
                password: passwordHash
            });

            return res.status(204).send();

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: 'Internal server error.' });
    }
};

module.exports = {
    registerUser,
    login,
    detailUser,
    updateUser
};