// This file is not connected to database

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");

const app = express();

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));
var headingArray=[], contentArray=[];

app.get("/",function(req,res) {
    res.render("index",{
        headings : headingArray,
        contents : contentArray
    });
});

app.post("/",function(req,res) {
    if(req.body.blogHeading.toLowerCase() === "clear") {
        headingArray = [];
        contentArray = [];
    }
    else {
        headingArray.push(req.body.blogHeading);
        contentArray.push(req.body.blogContent);
    }
    res.redirect("/");
});

app.listen(3000,function() {
    console.log("Server is running at port 3000.");
});