const User = require('../models/usermodel');

exports.registerForm = (req, res) => {
    res.render('users/register', { error: null });
};

exports.register = async (req, res) => {
    try {
        const { username, email } = req.body;

        if (!username || !email) {
            return res.render('users/register', {
                error: "All fields required."
            });
        }

        await User.create(username, email);

        res.redirect('/users');
    } catch (err) {
        console.error(err);
        res.status(500).render('users/register', {
            error: "Error creating user"
        });
    }
};

exports.list = async (req, res) => {
    try {
        const [rows] = await User.getAll();
        res.render('users/list', { users: rows });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error loading users");
    }
};
