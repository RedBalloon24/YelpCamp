var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var secure = require("../middlewares/secure.mid");
var NodeGeocoder = require('node-geocoder');
 
var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};
 
var geocoder = NodeGeocoder(options);


router.get("/", (req, res) => {
    var noMatch = null
    var perPage = 8;
    var pageQuery = parseInt(req.query.page);
    var pageNumber = pageQuery ? pageQuery : 1;
    if(req.query.search){
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');

        Campground.find({name: regex}).skip((perPage * pageNumber) - perPage).limit(perPage).exec((err, allCampgrounds) => {
            Campground.countDocuments({ name: regex }).exec((err, count) => {
                if(err){
                    console.log(err);
                } else {
                    if(allCampgrounds.length < 1) {
                        noMatch = "No campgrounds match that query, please try again.";
                    }
                    res.render("campgrounds/index",{ 
                        campgrounds: allCampgrounds, 
                        noMatch: noMatch, 
                        current: pageNumber, 
                        pages: Math.ceil(count / perPage),
                        search: req.query.search
                    });
                }
            })
        })
    } else {
        Campground.find({}).skip((perPage * pageNumber) - perPage).limit(perPage).exec((err, allCampgrounds) => {
            Campground.estimatedDocumentCount().exec((err, count) => {
                if(err){
                    console.log(err)
                } else {
                    res.render("campgrounds/index", { 
                        campgrounds: allCampgrounds, 
                        noMatch: noMatch, 
                        current: pageNumber, 
                        pages: Math.ceil(count / perPage)
                    })    
                }
            })
        })
    }

})

router.get("/new", secure.isLoggedIn, (req, res) => {
    res.render("campgrounds/new")
})

router.post("/", secure.isLoggedIn, (req, res) => {
    var name = req.body.name
    var price = req.body.price
    var image = req.body.image
    var description = req.body.description
    var author = {id: req.user._id, username: req.user.username}

    geocoder.geocode(req.body.location, (err, data) => {
        if (err || !data.length){
            req.flash("error", "Invalid address")
            return res.redirect("back")
        }
        var lat = data[0].latitude;
        var lng = data[0].longitude;
        var location = data[0].formattedAddress;
        var newCampground = {name: name, price: price, image: image, description: description, author: author, lat: lat, lng: lng, location: location};
    
        Campground.create(newCampground, (err, newlyCreated) => {
            if(err){
                console.log(err)
            } else {
                console.log(newlyCreated)
                res.redirect("/campgrounds")       
            }
        })
    })
})

router.get("/:id", (req, res) => {
    Campground.findById(req.params.id).populate("comments likes").exec((err, foundCampground) => {
        if(err){
            console.log(err)
        } else {
            res.render("campgrounds/show", {campground: foundCampground})
        }
    })
})

router.get("/:id/edit", secure.checkCampgroundOwnership, (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) => {
        res.render("campgrounds/edit", {campground: foundCampground})
    })
})

router.put("/:id", secure.checkCampgroundOwnership, (req, res) => {
    geocoder.geocode(req.body.location, (err, data) => {
        if(err || !data.length){
            req.flash('error', 'Invalid address');
            return res.redirect('back');
        }
        req.body.campground.lat = data[0].latitude;
        req.body.campground.lng = data[0].longitude;
        req.body.campground.location = data[0].formattedAddress;
        
        Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {
            if(err){
                req.flash("error", err.message)
                res.redirect("/campgrounds")
            } else {
                req.flash("success", "Successfully Updated!")
                res.redirect("/campgrounds/" + req.params.id)
            }
        })
    })
})

router.delete("/:id", secure.checkCampgroundOwnership, async(req,res) => {
    try {
        let foundCampground = await Campground.findById(req.params.id);
        await foundCampground.remove();
        res.redirect("/campgrounds");
    } catch (error) {
        req.flash("success", "Campground Deleted")
        res.redirect("/campgrounds");
    }
})

router.post("/:id/like", secure.isLoggedIn, (req, res) => {
    Campground.findById(req.params.id,  (err, foundCampground) => {
        if(err) {
            console.log(err);
            return res.redirect("/campgrounds");
        }

        var foundUserLike = foundCampground.likes.some(like => {
            return like.equals(req.user._id);
        });

        if(foundUserLike) {
            foundCampground.likes.pull(req.user._id);
        }else{
            foundCampground.likes.push(req.user);
        }

        foundCampground.save(err => {
            if(err){
                console.log(err);
                return res.redirect("/campgrounds");
            }
            return res.redirect("/campgrounds/" + foundCampground._id);
        });
    });
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};


module.exports = router;