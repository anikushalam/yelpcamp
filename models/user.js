const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// or
// const {Schema}=mongoose;

const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new Schema({
  firstName: {
    type: String,
    default: "",
  },
  middleName: {
    type: String,
    default: "",
  },
  lastName: {
    type: String,
    default: "",
  },
  bio: {
    type: String,
    default: "",
  },
  age: {
    type: Number,
    default: null,
  },
  state: {
    type: String,
    default: "",
  },
  city: {
    type: String,
    default: "",
  },
  zipCode: {
    type: Number,
    default: null,
  },
  permanentAddress: {
    type: String,
    default: "",
  },
  currentLocation: {
    type: String,
    default: "",
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  imageProfile: {
    type: String,
    default: "",
  },
});
//this is important line automatic fill username password field
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User1", UserSchema);
