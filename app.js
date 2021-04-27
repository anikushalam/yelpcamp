if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

//mongo Atlas //password:   VtmidDSoXT3t9VKg
// console.log(process.env.CLOUDINARY_SECRET);


const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');

const userRoutes = require('./routes/users');
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
const MongoDBStore = require('connect-mongo');

// process.env.DB_URL
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/new-yelp-camp';
//For Connecting database
// 'mongodb://localhost:27017/new-yelp-camp'
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error"));
db.once('open', () => {
    console.log("Database connected");
});

const app = express();

//for new ejs biolerplates
app.engine('ejs', ejsMate);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//use static directory
app.use(express.static(path.join(__dirname, 'public')));
//for parsing the body if we use req.body nothing show in page
//So use this
app.use(express.urlencoded({ extended: true }));

//for  put and detele and patch request
app.use(methodOverride('_method'));

// for security purpose
app.use(helmet());

//for helmet to allow csp
const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net/",
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = [
    "https://fonts.gstatic.com/",
    "https://cdn.jsdelivr.net/",
    "https://use.fontawesome.com/"
];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/djfhip09l/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

const secret = process.env.SECRET || 'thisshouldbebettersecret!';
//for store a session data
const store = MongoDBStore.create({
    // url: dbUrl,
    // secret: 'thisshouldbebettersecret!',
    // //it save only one time
    // touchAfter: 24 * 60 * 60
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret
    }
});

store.on("error", function (e) {
    console.log("SESSION STORE ERROR ", e);
});
//for session use
const sessionConfig = {
    store,
    //for show in application sid as session
    name: 'session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        //only for https secure not show locally 
        // secure:true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig));
//for use flash
app.use(flash());
//for query
app.use(mongoSanitize({
    replaceWith: '_'
}));

//this after the session then use then work
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

//how to store data in database
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// middleware for flash
app.use((req, res, next) => {
    //for query string 
    // console.log(req.query);
    //for show the only logout
    // console.log(req.session);
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})


// app.get('/fakeUser', async (req, res) => {
//     const user = new User({ email: 'aks@gmail.com', username: 'ankush' });
//     //most important line for password setup
//     const newUser = await User.register(user, 'chicken');
//     res.send(newUser);
// })

app.use('/', userRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);

app.get('/', (req, res) => {
    res.render('home');
});

// https://images.unsplash.com/photo-1617301535895-adfb93d46243?ixid=MXwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHwzfHx8ZW58MHx8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60
// app.get('/makecampground', async (req, res) => {
//     const camp = new Campground({ title: 'My Backyard', description: 'cheap camping' });
//     await camp.save();
//     res.send(camp);
// });

app.all('*', (req, res, next) => {
    next(new ExpressError('Page is not Found', 404));
});

//for catch handling.......
app.use((err, req, res, next) => {
    // res.send("Oh boy it is error");
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong...';
    res.status(statusCode).render('error', { err });
});

const port = process.env.PORT || 8080;
app.listen(port, (req, res) => {
    console.log(`Serving on port ${port}`);
});