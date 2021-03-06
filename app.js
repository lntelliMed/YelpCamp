var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    flash           = require("connect-flash"),    
    passport        = require("passport"),
    localStrategy   = require("passport-local"), 
    methodOverride  = require("method-override"),   
    Campground      = require("./models/campground"),
    Comment         = require("./models/comment"),  
    User            = require("./models/user"),    
    seedDB          = require("./seeds");

var commentRoutes       = require("./routes/comments"),
    campgroundRoutes    = require("./routes/campgrounds"),
    indexRoutes          = require("./routes/index");       
    
mongoose.Promise = global.Promise;    
// mongoose.connect("mongodb://localhost/yelp_camp");

var url = process.env.DATABASEURL || "mongodb://localhost/yelp_camp";
// mongoose.connect("mongodb://localhost/yelp_camp", {useMongoClient: true});
// mongoose.connect("mongodb://yelp:camp@ds229465.mlab.com:29465/yelp_camp", {useMongoClient: true});
mongoose.connect(url, {useMongoClient: true});


app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

//seedDB();

app.use(require("express-session")({
    secret: "This is a story about a ship called Titanic",
    resave: false,
    saveUninitialized: false

}));

app.locals.moment = require('moment');

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// use following instead of adding {currentUser: req.user} to every route manually
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");    
    next();
});

// app.use(indexRoutes);
// app.use(campgroundRoutes);
// app.use(commentRoutes);

app.use("/", indexRoutes);
app.use("/campgrounds/", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);


// var campgroundSchema = new mongoose.Schema({
//     name: String,
//     image: String,
//     description: String
// });

// var Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create(
//     {
//         name: "Salmon Creek",
//         image: "https://farm4.staticflickr.com/3872/14435096036_39db8f04bc.jpg",
//         description: "This is a huge granie hill.."
//     }, function(err, campground){
//         if(err){
//             console.log(err);
//         } else{
//             console.log("Added a new campground:");
//             console.log(campground);
//         }
//     }
// );


// var campgrounds = [
//     {name: "Salmon Creek", image: "https://farm4.staticflickr.com/3872/14435096036_39db8f04bc.jpg"},
//     {name: "Granite Hill", image: "https://farm8.staticflickr.com/7259/7121858075_7375241459.jpg"},
//     {name: "Mountain Goat's Rest", image: "https://farm2.staticflickr.com/1424/1430198323_c26451b047.jpg"},
//     {name: "Salmon Creek", image: "https://farm4.staticflickr.com/3872/14435096036_39db8f04bc.jpg"},
//     {name: "Granite Hill", image: "https://farm8.staticflickr.com/7259/7121858075_7375241459.jpg"},
//     {name: "Mountain Goat's Rest", image: "https://farm2.staticflickr.com/1424/1430198323_c26451b047.jpg"},
//     {name: "Salmon Creek", image: "https://farm4.staticflickr.com/3872/14435096036_39db8f04bc.jpg"},
//     {name: "Granite Hill", image: "https://farm8.staticflickr.com/7259/7121858075_7375241459.jpg"},
//     {name: "Mountain Goat's Rest", image: "https://farm2.staticflickr.com/1424/1430198323_c26451b047.jpg"}
// ];


// app.listen(3000, "localhost", function(){
//     console.log("YelpCamp Server Has Started!");
// });

// app.listen(process.env.PORT, process.env.IP, function(){
//     console.log("YelpCamp Server Has Started!");
// });

// console.log(process.env.PORT);
// console.log(process.env.IP);
// console.log(process.env.DATABASEURL);

// app.listen(process.env.PORT || 3000, process.env.IP || "localhost", function(){
//     console.log("YelpCamp Server Has Started!");
// });

app.listen(process.env.PORT || 3000, process.env.IP, function(){
    console.log("YelpCamp Server Has Started!");
});