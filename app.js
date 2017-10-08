var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

var campgrounds = [
    {name: "Salmon Creek", image: "https://farm4.staticflickr.com/3872/14435096036_39db8f04bc.jpg"},
    {name: "Granite Hill", image: "https://farm8.staticflickr.com/7259/7121858075_7375241459.jpg"},
    {name: "Mountain Goat's Rest", image: "https://farm2.staticflickr.com/1424/1430198323_c26451b047.jpg"}
];

app.get("/", function(req, res){
    // res.send("This will be the landing page");
    res. render("landing");
});

app.get("/campgrounds", function(req, res){
    res.render("campgrounds", {campgrounds, campgrounds});
    
});

app.post("/campgrounds", function(req, res){
    // res.send("You hit the post route!");
    var name = req.body.name;
    var image = req.body.image;
    var newCampground = {name: name, image: image};
    campgrounds.push(newCampground);
    res.redirect("/campgrounds");
});

app.get("/campgrounds/new", function(req, res){
    res.render("new.ejs");
});

app.listen(3000, "localhost", function(){
    console.log("YelpCamp Server Has Started!");
});