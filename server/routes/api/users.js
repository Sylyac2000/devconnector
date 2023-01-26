const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check')
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const User = require('../../models/User');
// @route POST api/users
// @desc Register user
// @access Public
router.post('/', [check('name', 'le nom est requis').not().isEmpty(),
check('email', 'Email est requis').isEmail(),
check('password', 'mdp de 8 caractères au moins est requis').isLength({ min: 8 })],
    async (req, res) => {
        console.log(req.body);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { name, email, password } = req.body
        try {

            // check if user exists
            let user = await User.findOne({ email });
            if (user) {
                return res.status(400).json({ errors: [{ msg: 'User existe déja' }] });
            }
            //Get user gravatar
            const avatar = gravatar.url(email, {
                s: '200',
                r: 'pg',
                d: 'mm'
            });
            user = new User({
                name, email, avatar, password
            });
            //Encrypt password
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
            await user.save();
            //return jsonwebtoken for authentication
            const payload = {
                user: {
                    id: user.id,
                }
            };
            jwt.sign(payload, config.get('jwtSecret'), { expiresIn: 36000 }, (err, token) => {
                if (err) throw err;
                res.json({ token })
            })
            //res.send('User registered')

        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }


    });
//+Write a code in javascript: a function to create a file with the name of the file given by the user and write some text in it.
module.exports = router;
