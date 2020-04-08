var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");
var URL_PATTERN = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
var USERNAME_PATTERN = /^(?=.{5,20}$)([A-Za-z._](?:(?:[A-Za-z0-9._]|(?:\.(?!\.))){1,28}(?:[A-Za-z0-9._]))?)$/gi;

var UserSchema = new mongoose.Schema({
    username: {
        type: String,
        match: [USERNAME_PATTERN, "Must have minimum 5 characters. May include numbers and special characters '.' and '_'."]
    },
    password: {
        type: String,
    },
    avatarURL: {
        type: String,
        match: [URL_PATTERN, "Invalid avatar URL pattern"]
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
    },    
    description: String,
    isAdmin: {
        type: Boolean,
        default: false
    }
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);