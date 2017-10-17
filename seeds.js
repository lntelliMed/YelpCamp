var mongoose    = require("mongoose");
var Campground  = require("./models/campground");
var Comment     = require("./models/comment");


var data = [
    {
        name: "Cloud's Rest",
        image: "https://farm4.staticflickr.com/3872/14435096036_39db8f04bc.jpg",
        description: "blah blah blah"
    },
    {
        name: "Desert Mesa",
        image: "https://farm8.staticflickr.com/7259/7121858075_7375241459.jpg",
        description: "blah blah blah"
    },
    {
        name: "Canyon Floor",
        image: "https://farm2.staticflickr.com/1424/1430198323_c26451b047.jpg",
        description: "blah blah blah"
    }
];



function seedDB(){
    Campground.remove({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("Removed campgrounds");
        data.forEach(function(seed){
            Campground.create(seed, function(err, campground){
                if(err){
                    console.log(err);
                } else {
                    console.log("Campground added!");
                    Comment.create({
                        text: "This place is wonderful!",
                        author: "Homer"
                    }, function(err, comment){
                        if(err){
                            console.log(err);
                        } else {
                            campground.comments.push(comment);
                            campground.save();
                            console.log("Added a new comment!");
                        }
                    });
                }
            });    
        });
    });
}


module.exports = seedDB;