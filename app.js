var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose");

mongoose.connect("mongodb://localhost/yelp_camp")

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String
});

var Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create(
//     {
//         name: "Salmon Creek",
//         image: "https://farm4.staticflickr.com/3872/14435096036_39db8f04bc.jpg"
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
            res.render("campgrounds", {campgrounds, campgrounds});
        }
    });

});

app.post("/campgrounds", function(req, res){
    // res.send("You hit the post route!");
    var name = req.body.name;
    var image = req.body.image;
    var newCampground = {name: name, image: image};
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
    res.render("new.ejs");
});

app.listen(3000, "localhost", function(){
    console.log("YelpCamp Server Has Started!");
});