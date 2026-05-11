const jwt = require('jsonwebtoken');
const knex = require('../database/connection');

const verifyLogin = async (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({ message: 'Not authorized.' });
    }

    const token = authorization.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Authorization token needed.' });
    }

    try {
        const { id } = jwt.verify(token, process.env.JWT_SECRET);

        const user = await knex('users').where({ id }).first();

        if (!user) {
            return res.status(401).json({ message: 'Not authorized.' });
        }

        const { password: _, ...userData } = user;
        req.user = userData;

        next();

    } catch (error) {
        return res.status(401).json({ message: 'Not authorized.' });
    }
};

module.exports = verifyLogin;