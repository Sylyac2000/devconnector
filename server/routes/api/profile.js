const express = require('express');
const router = express.Router();
//to protect a route add auth middleware
const auth = require('../../middleware/auth');

const { check, validationResult } = require('express-validator/check')
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const User = require('../../models/User');
const Profile = require('../../models/Profile');

// @route GET api/profile/me
// @desc Get current user profile
// @access Private
router.get('/me', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({user: req.user.id}).populate('user', ['name', 'avatar']);
        if (!profile) {
            return res.status(400).json({ msg: 'Pas de profil pour ce user' });
        }

        res.json(profile);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');

    }

});

// @route POST api/profile
// @desc create or update user profile
// @access Private
router.post('/', auth, [check('status', 'Status est requis').not().isEmpty(),
    check('skills', 'Compétence est requis').not().isEmpty()], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const profile = await Profile.findOne({user: req.user.id}).populate('user', ['name', 'avatar']);
        if (!profile) {
            //return res.status(400).json({ msg: 'Pas de profil pour ce user' });
        }

        const {company, website, location, bio, status, githubusername, skills, youtube, facebook, twitter, instagram, linkedin, handle} = req.body;
        //build profile object
        const profileFields = {};
        profileFields.user = req.user.id;
        if (company) profileFields.company = company;
        if (website) profileFields.website = website;
        if (location) profileFields.location = location;
        if (bio) profileFields.bio = bio;
        if (status) profileFields.status = status;
        if (githubusername) profileFields.githubusername = githubusername;
        if (skills) profileFields.skills = skills.split(',').map(skill => skill.trim());
        profileFields.handle = handle;
        //build social object
        profileFields.social = {};

        if (youtube) profileFields.social.youtube = youtube;
        if (twitter) profileFields.social.twitter = twitter;
        if (facebook) profileFields.social.facebook = facebook;
        if (linkedin) profileFields.social.linkedin = linkedin;
        if (instagram) profileFields.social.instagram = instagram;
        //res.json(profile);
        console.log(profileFields);
        //res.send('hello');
        

        try {
            let profile = await Profile.findOne({user: req.user.id})
            //update
            if(profile) {
                profile = await Profile.findOneAndUpdate({user: req.user.id}, {$set: profileFields}, {new: true})
                return res.json(profile);
            }
            // create
            profile = new Profile(profileFields);
            await profile.save();
            res.json(profile);
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');

    }

});

// @route GET api/profile
// @desc Get all profiles
// @access Public
router.get('/', async (req, res) => {
    try {
        const profiles = await Profile.find().populate('user', ['name', 'avatar']);
        res.json(profiles);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');

    }

});

// @route GET api/profile/user/:user_id
// @desc Get  profile by user id
// @access Public
router.get('/user/:user_id', async (req, res) => {
    try {
        const profile = await Profile.findOne({user: req.params.user_id}).populate('user', ['name', 'avatar']);
        if(!profile) {
            return res.status(400).json({msg: "cet utilisateur n'a pas de profil"})
        }
        res.json(profile);

    } catch (err) {
        console.error(err.message);
        if(err.kind == 'ObjectId') {
            return res.status(400).json({msg: "cet utilisateur n'a pas de profil"})
        }
        res.status(500).send('Server error');

    }

});

// @route DELETE api/profile
// @desc    Delete user and profile
// @access  Private
router.delete('/', auth,
    async (req, res) => {
    try {
        //remove profile
        await Profile.findOneAndRemove({user: req.user.id});
        //remove user
        await User.findOneAndRemove({_id: req.user.id});
        res.json({msg: 'user supprimé'});

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');

    }

});


// @route   POST api/profile/experience
// @desc    Add experience to profile
// @access  Private
router.put(
    '/experience',
    auth,
    [
        check('title', 'title est requis').not().isEmpty(),
        check('company', 'company est requis').not().isEmpty(),
        check('from', 'from est requis').not().isEmpty()
    ],
    async(req, res) => {
    const errors = validationResult(req);
    // Check Validation
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    } = req.body;
    const newExp = {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    };

    try {
        //remove profile
        const profile = await Profile.findOne({user: req.user.id});
        profile.experience.unshift(newExp);
        await profile.save()
        res.json(profile);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');

    }


        /*Profile.findOne({ user: req.user.id }).then(profile => {
            const newExp = {
                title: req.body.title,
                company: req.body.company,
                location: req.body.location,
                from: req.body.from,
                to: req.body.to,
                current: req.body.current,
                description: req.body.description
            };

            // Add to exp array
            profile.experience.unshift(newExp);

            profile.save().then(profile => res.json(profile));
        });*/
    }
);

// @route   DELETE api/profile/experience/:exp_id
// @desc    Delete experience from profile
// @access  Private
router.delete(
    '/experience/:exp_id',
    auth,
    async(req, res) => {
        try{
            const profile = await Profile.findOne({ user: req.user.id })
            // Get remove index
            const removeIndex = profile.experience
                        .map(item => item.id)
                        .indexOf(req.params.exp_id);

            // Splice out of array
            profile.experience.splice(removeIndex, 1);

            // Save
            await profile.save();

            res.json(profile);

        }
        catch (err) {

        }

    }
);


// @route   PUt api/profile/education
// @desc    add profile education
// @access  Private
router.put(
    '/education',
    auth,
    [
        check('school', 'school est requis').not().isEmpty(),
        check('degree', 'degree est requis').not().isEmpty(),
        check('fieldofstudy', 'fieldofstudy est requis').not().isEmpty(),
        check('from', 'from est requis').not().isEmpty()
    ],
    async(req, res) => {
        const errors = validationResult(req);
        // Check Validation
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
                const {
                    school,
                    degree,
                    fieldofstudy,
                    from,
                    to,
                    current,
                    description
                } = req.body;
                const newEdu = {
                    school,
                    degree,
                    fieldofstudy,
                    from,
                    to,
                    current,
                    description
                };

                try {
                    //remove profile
                    const profile = await Profile.findOne({user: req.user.id});
                    profile.education.unshift(newEdu);
                    await profile.save()
                    res.json(profile);

                } catch (err) {
                    console.error(err.message);
                    res.status(500).send('Server error');

                }

    }
);


// @route   DELETE api/profile/education/:edu_id
// @desc    Delete education from profile
// @access  Private
router.delete(
    '/education/:edu_id',
    auth,
    async(req, res) => {
        try{
            const profile = await Profile.findOne({ user: req.user.id })
            // Get remove index
            const removeIndex = profile.education
                .map(item => item.id)
                .indexOf(req.params.edu_id);

            // Splice out of array
            profile.education.splice(removeIndex, 1);

            // Save
            await profile.save();

            res.json(profile);

        }
        catch (err) {

        }

    }
);

module.exports = router;
