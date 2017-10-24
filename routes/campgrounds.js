var express = require("express");
var router = express.Router();
var Campground= require("../models/campground");

// var middleware = require("../middleware/index.js");
var middleware = require("../middleware");

var geocoder = require('geocoder');

// router.get("/campgrounds", function(req, res){
router.get("/", function(req, res){        
    // res.render("campgrounds", {campgrounds, campgrounds});
    Campground.find({}, function(err, campgrounds){
        if(err){
            console.log(err);
        } else {
            // res.render("campgrounds/index", {campgrounds: campgrounds, currentUser: req.user});
            res.render("campgrounds/index", {campgrounds: campgrounds, page: 'campgrounds'});            
        }
    });

});

// // router.post("/campgrounds", function(req, res){
// router.post("/", middleware.isLoggedIn, function(req, res){        
//     // res.send("You hit the post route!");
//     var name = req.body.name;
//     var price = req.body.price;    
//     var image = req.body.image;
//     var desc = req.body.description; 
//     var author = {
//         id: req.user._id,
//         username: req.user.username
//     };
//     var newCampground = {name: name, price: price, image: image, description: desc, author: author};
//     // campgrounds.push(newCampground);

//     Campground.create(newCampground, function(err, newlyAdded){
//         if(err){
//             console.log(err);
//         } else{
//             res.redirect("/campgrounds");
//         }
//     });

//     // res.redirect("/campgrounds");
// });


router.post("/", middleware.isLoggedIn, function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var cost = req.body.cost;
    geocoder.geocode(req.body.location, function (err, data) {
      var lat = data.results[0].geometry.location.lat;
      var lng = data.results[0].geometry.location.lng;
      var location = data.results[0].formatted_address;
      var newCampground = {name: name, image: image, description: desc, cost: cost, author:author, location: location, lat: lat, lng: lng};
      Campground.create(newCampground, function(err, newlyCreated){
          if(err){
              console.log(err);
          } else {
              console.log(newlyCreated);
              res.redirect("/campgrounds");
          }
      });
    });
  });


// router.get("/campgrounds/new", function(req, res){
router.get("/new", middleware.isLoggedIn, function(req, res){        
    res.render("campgrounds/new");
});

// router.get("/campgrounds/:id", function(req, res){
router.get("/:id", function(req, res){        
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err || !foundCampground){
            // console.log(err);
            req.flash("error", "Campground not found");
            res.redirect("back");
        } else {
            // if (!foundCampground) {
            //     return res.status(400).send("Item not found.");
            // }
            console.log(foundCampground);
            res.render("campgrounds/show", {campground: foundCampground});                
        }
    });
});

router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        // if (!foundCampground) {
        //     return res.status(400).send("Item not found.");
        // }
        res.render("campgrounds/edit", {campground: foundCampground});                                
    });

});

// router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
//     Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
//         if(err){
//             res.redirect("/campgrounds");
//         } else {
//             res.redirect("/campgrounds/" + req.params.id);            
//         }
//     });
// });

router.put("/:id", function(req, res){
    geocoder.geocode(req.body.location, function (err, data) {
      var lat = data.results[0].geometry.location.lat;
      var lng = data.results[0].geometry.location.lng;
      var location = data.results[0].formatted_address;
      var newData = {name: req.body.name, image: req.body.image, description: req.body.description, cost: req.body.cost, location: location, lat: lat, lng: lng};
      Campground.findByIdAndUpdate(req.params.id, {$set: newData}, function(err, campground){
          if(err){
              req.flash("error", err.message);
              res.redirect("back");
          } else {
              req.flash("success","Successfully Updated!");
              res.redirect("/campgrounds/" + campground._id);
          }
      });
    });
  });
  
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/");            
        }
    });
});

// function isLoggedIn(req, res, next){
//     if(req.isAuthenticated()){
//         return next();
//     }
//     res.redirect("/login");
// }

// function checkCampgroundOwnership(req, res, next){
//     if(req.isAuthenticated()){
//         Campground.findById(req.params.id, function(err, foundCampground){
//             if(err){
//                 res.redirect("back");
//             } else {
//                 if(foundCampground.author.id.equals(req.user._id)){
//                     next();
//                 } else {
//                     // res.send("Youd don't have the permission to do that!");
//                     res.redirect("back");
//                 }
//             }
//         });
//     } else {
//         // console.log("You need to be logged in to do that!");
//         res.redirect("back");
//     }
// }

module.exports = router;