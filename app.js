var express = require("express")
var app = express()

app.set("view engine", "ejs")

app.get("/", (req, res) => {
    res.render("landing")
})
app.get("/campgrounds", (req, res) => {
    var campgrounds = [
        {name: "Turtle Pond", image: "https://images.unsplash.com/photo-1471115853179-bb1d604434e0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=959&q=80"},
        {name: "Walnut Hill", image: "https://images.unsplash.com/photo-1492648272180-61e45a8d98a7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80"},
        {name: "Mountine Pine", image: "https://images.unsplash.com/photo-1487730116645-74489c95b41b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80"}
    ]

    res.render("campgrounds", {campgrounds: campgrounds})
})


app.listen(3000, () => console.log("YelpCamp has started"))