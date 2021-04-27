const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// or 
// const {Schema}=mongoose;

const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
});
//this is important line automatic fill username password field
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User1', UserSchema);