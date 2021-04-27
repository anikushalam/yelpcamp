const User = require('../models/user');

module.exports.renderRegister = (req, res) => {
    res.render('users/register');
}

module.exports.register = async (req, res) => {
    // res.send(req.body);
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        // res.send(email);
        const registerUser = await User.register(user, password);
        req.login(registerUser, err => {
            if (err) return next(err);
            // console.log(registerUser);
            req.flash('success', 'Welcome to the Yelpcamp');
            res.redirect('/campgrounds');
        })

    } catch (err) {
        req.flash('error', err.message);
        res.redirect('register');
    }

}

module.exports.renderLogin = (req, res) => {
    res.render('users/login');
}

module.exports.login = (req, res) => {
    req.flash('success', 'welcome back');
    //this is take where my page login and go there that login edit after login we auto go edit page
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res) => {
    req.logout();
    req.flash('success', 'GoodBye');
    res.redirect('/campgrounds');
}