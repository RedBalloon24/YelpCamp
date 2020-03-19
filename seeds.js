var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

var data = [
    {
        name: "Turtle Pond", 
        image: "https://images.unsplash.com/photo-1471115853179-bb1d604434e0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=959&q=80", 
        description: "This is an open campground surrounding a large pond filled with turtles"
    },
    { 
        name: "Tree Pine", 
        image: "https://images.unsplash.com/photo-1492648272180-61e45a8d98a7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80", 
        description: "Come here and sleep among the trees"
    },
    { 
        name: "Glow Falls",
        image: "https://images.unsplash.com/photo-1487730116645-74489c95b41b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80", 
        description: "This place is full of glow in the dark insects and tents"
    },
    { 
        name: "Snow Creek", 
        image: "https://images.unsplash.com/photo-1455496231601-e6195da1f841?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1395&q=80", 
        description: "Come pitch a tent in the snow"
    }
]

function seedDB(){
    //Remove all campgrounds
    Campground.deleteMany({}, function(err){
        if(err){
            console.log(err)
        }
        console.log("Removed campgrounds!!")
        //Remove all comments
        Comment.deleteMany({}, function(err){
            if(err){
                console.log(err)
            }
            console.log("Removed comments!!")
            //Add a few campgrounds
            data.forEach(function(seed){
                Campground.create(seed, function(err, campground){
                    if(err){
                        console.log(err)
                    } else {
                        console.log("Added a Campground")
                        //Create a comment
                        Comment.create(
                            {
                                text: "This place is great, but I wish there was internet",
                                author: "Homer"
                            }
                        ), function(err, comment){
                            if(err){
                                console.log(err)
                            } else {
                                campground.comments.push(comment);
                                campground.save();
                            }
                        }
                        console.log("Created new comment")
                    }
                })
            })
        })
    });
    
    //Add comments
}

module.exports = seedDB;