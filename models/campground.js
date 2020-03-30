var mongoose = require("mongoose");

var campgroundSchema = new mongoose.Schema({
    name: String,
    price: String,
    image: String,
    description: String,
    location: String,
    lat: Number,
    lng: Number,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});


var Comment = require('./comment');

campgroundSchema.pre("remove", async function() {
   await Comment.deleteMany({
      _id:{
         $in:this.comments
      }
   })
}); 


module.exports = mongoose.model("Campground", campgroundSchema);