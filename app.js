var express = require("express");
var app = express();

app.set("view engine", "ejs");

app.get("/", function(req, res){
    // res.send("This will be the landing page");
    res. render("landing");
});

app.get("/campgrounds", function(req, res){
    var campgrounds = [
        {name: "Salmon Creek", image: "https://farm4.staticflickr.com/3872/14435096036_39db8f04bc.jpg"},
        {name: "Granite Hill", image: "https://farm8.staticflickr.com/7259/7121858075_7375241459.jpg"},
        {name: "Mountain Goat's Rest", image: "https://farm2.staticflickr.com/1424/1430198323_c26451b047.jpg"}
    ];
    res.render("campgrounds", {campgrounds, campgrounds});
    
});

app.listen(3000, "localhost", function(){
    console.log("YelpCamp Server Has Started!");
});