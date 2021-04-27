const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');

//For Connecting database
mongoose.connect('mongodb://localhost:27017/new-yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error"));
db.once('open', () => {
    console.log("Database connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    // const c = new Campground({ title: 'purple field' });
    // await c.save();

    for (let i = 0; i < 300; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            //User Id
            author: "6077674ff9a79b24d4d09026",
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)} `,
            // image: 'https://source.unsplash.com/collection/483215',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta, dolor repellat molestias aut itaque mollitia accusamus laboriosam, quis cum incidunt voluptatum, vel ut.',
            price,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ]
            },
            images: [
                // {

                //     url: 'https://source.unsplash.com/collection/483215',
                //     filename: 'YelpCamp'
                // },
                // {

                //     url: 'https://source.unsplash.com/collection/483215',
                //     filename: 'YelpCamp'
                // }
                {
                    url: 'https://res.cloudinary.com/djfhip09l/image/upload/v1618840648/YelpCamp/d735y8pqtkj6kl7pfb9n.jpg',
                    filename: 'YelpCamp/d735y8pqtkj6kl7pfb9n'
                },
                {

                    url: 'https://res.cloudinary.com/djfhip09l/image/upload/v1618828331/YelpCamp/omfvasxxvjehf73ycso9.jpg',
                    filename: 'YelpCamp/omfvasxxvjehf73ycso9'
                }
            ]
        });
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})