var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    passport        = require("passport"),
    localStrategy   = require("passport-local"),    
    Campground      = require("./models/campground"),
    Comment         = require("./models/comment"),  
    User            = require("./models/user"),    
    seedDB          = require("./seeds");

    
mongoose.Promise = global.Promise;    
// mongoose.connect("mongodb://localhost/yelp_camp");
mongoose.connect("mongodb://localhost/yelp_camp", {useMongoClient: true});

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

app.use(express.static(__dirname + "/public"));

seedDB();

app.use(require("express-session")({
    secret: "This is a story about a ship called Titanic",
    resave: false,
    saveUninitialized: false

}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// use following instead of adding {currentUser: req.user} to every route manually
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});

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

app.get("/", function(req, res){
    // res.send("This will be the landing page");
    res. render("landing");
});

app.get("/campgrounds", function(req, res){
    // res.render("campgrounds", {campgrounds, campgrounds});
    Campground.find({}, function(err, campgrounds){
        if(err){
            console.log(err);
        } else {
            // res.render("campgrounds/index", {campgrounds: campgrounds, currentUser: req.user});
            res.render("campgrounds/index", {campgrounds: campgrounds});            
        }
    });

});

app.post("/campgrounds", function(req, res){
    // res.send("You hit the post route!");
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;    
    var newCampground = {name: name, image: image, description: desc};
    // campgrounds.push(newCampground);

    Campground.create(newCampground, function(err, newlyAdded){
        if(err){
            console.log(err);
        } else{
            res.redirect("/campgrounds");
        }
    });

    // res.redirect("/campgrounds");
});

app.get("/campgrounds/new", function(req, res){
    res.render("campgrounds/new");
});

app.get("/campgrounds/:id", function(req, res){
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            console.log(foundCampground);
            res.render("campgrounds/show", {campground: foundCampground});                
        }
    });
});

app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {campground: campground});            
        }
    });
});

app.post("/campgrounds/:id/comments", isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                } else {
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
});

app.get("/register", function(req, res){
    res.render("register");
});

app.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, User){
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/campgrounds")
        });
    });
});

app.get("/login", function(req, res){
    res.render("login");
});

app.post("/login", passport.authenticate("local",
{
    successRedirect: "/campgrounds",
    failureRedirect: "/login"

}),function(req, res){  
});

app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/campgrounds");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

app.listen(3000, "localhost", function(){
    console.log("YelpCamp Server Has Started!");
});