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
router.post("/", isLoggedIn, function(req, res){        
    // res.send("You hit the post route!");
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description; 
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampground = {name: name, image: image, description: desc, author: author};
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
router.get("/new", isLoggedIn, function(req, res){        
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

router.get("/:id/edit", checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        res.render("campgrounds/edit", {campground: foundCampground});                                
    });

});

router.put("/:id", checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/" + req.params.id);            
        }
    });
});

router.delete("/:id", checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/");            
        }
    });
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

function checkCampgroundOwnership(req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err){
                res.redirect("back");
            } else {
                if(foundCampground.author.id.equals(req.user._id)){
                    next();
                } else {
                    // res.send("Youd don't have the permission to do that!");
                    res.redirect("back");
                }
            }
        });
    } else {
        // console.log("You need to be logged in to do that!");
        res.redirect("back");
    }
}

module.exports = router;