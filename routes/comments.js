var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");

var middleware = require("../middleware");

// router.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res){
router.get("/new", middleware.isLoggedIn, function(req, res){        
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {campground: campground});            
        }
    });
});

// router.post("/campgrounds/:id/comments", isLoggedIn, function(req, res){
router.post("/", middleware.isLoggedIn, function(req, res){        
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    // console.log(err);                    
                    req.flash("error", "Something went wrong");                    
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username; 
                    comment.save();                   
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success", "Successfully added comment");                                        
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
});

router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err || !foundCampground){
            req.flash("error", "Campground not found");
            return res.redirect("back");
        }
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                res.redirect("back");
            } else {
                res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});            
            }
        });
    });
});

router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        } else {
            req.flash("success", "Comment deleted");                                
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// function isLoggedIn(req, res, next){
//     if(req.isAuthenticated()){
//         return next();
//     }
//     res.redirect("/login");
// }

// function checkCommentOwnership(req, res, next){
//     if(req.isAuthenticated()){
//         Comment.findById(req.params.comment_id, function(err, foundComment){
//             if(err){
//                 res.redirect("back");
//             } else {
//                 if(foundComment.author.id.equals(req.user._id)){
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