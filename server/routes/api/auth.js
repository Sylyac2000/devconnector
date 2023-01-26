const express = require('express');
const router = express.Router();
//auth middleware to protect routes
const auth = require('../../middleware/auth');
const User = require('../../models/User');
const {check, validationResult} = require("express-validator/check");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");

// @route GET api/auth
// @desc Test route: get user datas
// @access Public
router.get('/',  auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password'); //select without password
        res.json(user);
    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server error');
    }
    //res.send('Auth route')
});

// @route POST api/auth
// @desc login user and get token
// @access Public
router.post('/', [
        check('email', 'Email est requis').isEmail(),
        check('password', 'mdp est requis').exists()],
    async (req, res) => {
        console.log(req.body);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { email, password } = req.body
        try {

            // check if user exists
            let user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ errors: [{ msg: 'Login et/ou mot de passe incorrect' }] });
            }
            const isMatchPassword = await bcrypt.compare(password, user.password)
            if(!isMatchPassword) {
                return res.status(400).json({ errors: [{ msg: 'Login et/ou mot de passe incorrect' }] });

            }
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

module.exports = router;
