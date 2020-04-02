var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

var data = [
    {
        name: "Turtle Pond", 
        image: "https://images.unsplash.com/photo-1471115853179-bb1d604434e0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=959&q=80", 
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Assumenda magnam nam odio numquam vel autem, maxime libero laudantium, ducimus maiores possimus praesentium animi, optio itaque. Dolorem qui voluptatem, aliquid facere pariatur ipsum. Odit consectetur ratione dignissimos, amet quae pariatur quidem tempore, facilis ipsam soluta alias non ipsum voluptatum vitae molestiae.",
        location: "Yosemite National Park",
        price: "25.99"
    },
    { 
        name: "Tree Pine", 
        image: "https://images.unsplash.com/photo-1492648272180-61e45a8d98a7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80", 
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Assumenda magnam nam odio numquam vel autem, maxime libero laudantium, ducimus maiores possimus praesentium animi, optio itaque. Dolorem qui voluptatem, aliquid facere pariatur ipsum. Odit consectetur ratione dignissimos, amet quae pariatur quidem tempore, facilis ipsam soluta alias non ipsum voluptatum vitae molestiae.",
        location: "Inverness, Scotland, UK",
        price: "57.99"
    },
    { 
        name: "Glow Falls",
        image: "https://images.unsplash.com/photo-1487730116645-74489c95b41b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80", 
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Assumenda magnam nam odio numquam vel autem, maxime libero laudantium, ducimus maiores possimus praesentium animi, optio itaque. Dolorem qui voluptatem, aliquid facere pariatur ipsum. Odit consectetur ratione dignissimos, amet quae pariatur quidem tempore, facilis ipsam soluta alias non ipsum voluptatum vitae molestiae.",
        location: "Toyko, Japan",
        price: "99.99"
    },
    { 
        name: "Snow Creek", 
        image: "https://images.unsplash.com/photo-1455496231601-e6195da1f841?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1395&q=80", 
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Assumenda magnam nam odio numquam vel autem, maxime libero laudantium, ducimus maiores possimus praesentium animi, optio itaque. Dolorem qui voluptatem, aliquid facere pariatur ipsum. Odit consectetur ratione dignissimos, amet quae pariatur quidem tempore, facilis ipsam soluta alias non ipsum voluptatum vitae molestiae.",
        location: "Anchorage, Alaska, USA",
        price: "120.99"
    },
    {
        name: "Mountain Oasis",
        image: "https://images.unsplash.com/photo-1476041800959-2f6bb412c8ce?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Assumenda magnam nam odio numquam vel autem, maxime libero laudantium, ducimus maiores possimus praesentium animi, optio itaque. Dolorem qui voluptatem, aliquid facere pariatur ipsum. Odit consectetur ratione dignissimos, amet quae pariatur quidem tempore, facilis ipsam soluta alias non ipsum voluptatum vitae molestiae.",
        location: "Oslo, Norway",
        price: "150"
    },
    {
        name: "Desert Lodge",
        image: "https://images.unsplash.com/photo-1522031153701-b3eba74004e8?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Assumenda magnam nam odio numquam vel autem, maxime libero laudantium, ducimus maiores possimus praesentium animi, optio itaque. Dolorem qui voluptatem, aliquid facere pariatur ipsum. Odit consectetur ratione dignissimos, amet quae pariatur quidem tempore, facilis ipsam soluta alias non ipsum voluptatum vitae molestiae.",
        location: "Atacama Desert, Antofagasta, Chile",
        price: "145.99"
    },
    {
        name: "Big Tent Valley",
        image: "https://images.unsplash.com/photo-1478827536114-da961b7f86d2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Assumenda magnam nam odio numquam vel autem, maxime libero laudantium, ducimus maiores possimus praesentium animi, optio itaque. Dolorem qui voluptatem, aliquid facere pariatur ipsum. Odit consectetur ratione dignissimos, amet quae pariatur quidem tempore, facilis ipsam soluta alias non ipsum voluptatum vitae molestiae.",
        location: "Cape Town, South Africa",
        price: "235.99"
    },
    {
        name: "Tranquil Pine",
        image: "https://images.unsplash.com/photo-1561387809-9117e4e5b52c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1267&q=80",
        description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Assumenda magnam nam odio numquam vel autem, maxime libero laudantium, ducimus maiores possimus praesentium animi, optio itaque. Dolorem qui voluptatem, aliquid facere pariatur ipsum. Odit consectetur ratione dignissimos, amet quae pariatur quidem tempore, facilis ipsam soluta alias non ipsum voluptatum vitae molestiae.",
        location: "Galicia, Spain",
        price: "53.99"
    }
]

function seedDB() {
    //Remove all campgrounds
    Campground.deleteMany({}, (err) => {
        if(err){
            console.log(err)
        }
        console.log("Removed campgrounds!!")
        //Remove all comments
        Comment.deleteMany({}, (err) => {
            if(err){
                console.log(err)
            }
            console.log("Removed comments!!")
            //Add campgrounds
            // data.forEach((seed) => {
            //     Campground.create(seed, (err, campground) => {
            //         if(err){
            //             console.log(err)
            //         } else {
            //             console.log("Added a Campground")
            //             //Create a comment
            //             Comment.create(
            //                 {
            //                     text: "This place is great, but I wish there was internet",
            //                     author: "Homer"
            //                 }, (err, comment) => {
            //                     if(err){
            //                         console.log(err)
            //                     } else {
            //                         campground.comments.push(comment);
            //                         campground.save();
            //                         console.log("Created new comment")
            //                     }
            //             })
            //         }
            //     })
            // })
        })
    });
}

module.exports = seedDB;