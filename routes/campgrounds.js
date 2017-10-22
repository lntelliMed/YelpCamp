var express = require("express");
var router = express.Router();
var Campground= require("../models/campground");

// router.get("/campgrounds", function(req, res){
router.get("/", function(req, res){        
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

// router.post("/campgrounds", function(req, res){
router.post("/", function(req, res){        
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

// router.get("/campgrounds/new", function(req, res){
router.get("/new", function(req, res){        
    res.render("campgrounds/new");
});

// router.get("/campgrounds/:id", function(req, res){
router.get("/:id", function(req, res){        
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            console.log(foundCampground);
            res.render("campgrounds/show", {campground: foundCampground});                
        }
    });
});

module.exports = router;