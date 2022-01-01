const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const users = require('../controllers/users');
const passport = require('passport');

// router.get('/register', users.renderRegister);

// router.post('/register', catchAsync(users.register));

// router.get('/login', users.renderLogin);

//work as middleware
// passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' })
// router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login);

// router.get('/logout', users.logout)
 
router.route('/register')
    .get(users.renderRegister)
    .post(catchAsync(users.register));

router.route('/login')
    .get(users.renderLogin)
    .post(passport.authenticate('local',
        { failureFlash: true, failureRedirect: '/login' }),
        users.login);

router.get('/logout', users.logout)

module.exports = router;
