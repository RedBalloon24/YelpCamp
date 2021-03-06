require("dotenv").config();

var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var flash = require("connect-flash");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var methodOverride = require("method-override");
var User = require("./models/user")
// var Campground = require("./models/campground");
// var Comment = require("./models/comment");
// var seedDB = require("./seeds")

var campgroundRoutes = require("./routes/campgrounds")
var commentRoutes = require("./routes/comments")
var indexRoutes = require("./routes/index")

var MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
    .then(() => console.info(`Connected to the database: ${MONGODB_URI}`))
    .catch(error => console.error(`An error ocurred trying to connect to the database: ${MONGODB_URI}`, error));

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB();

app.locals.moment = require("moment");

app.use(require("express-session")({
   secret: process.env.EXPRESS_SESSION_SECRET,
   resave: false,
   saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
    res.locals.GMAPKEY = process.env.GMAPKEY
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);


app.listen(process.env.PORT || 3000, () => console.log("YelpCamp has started"));