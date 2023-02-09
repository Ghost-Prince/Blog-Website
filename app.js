const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/blog_website");

const app = express();

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));

var headingArray=[], contentArray=[];

const headingSchema = new mongoose.Schema({
    _id : Number,
    heading : String
});
const HEADING = mongoose.model("heading",headingSchema);
HEADING.createCollection().then(function(collection) {
    console.log("HEADING clooection created.");
});

const contentSchema = new mongoose.Schema({
    _id : Number,
    content : String
});
const CONTENT = mongoose.model("content",contentSchema);
CONTENT.createCollection().then(function(collection) {
    console.log("CONTENT collection created.");
});

var size = 0;
HEADING.find().count(function(err,count) {
    if(err) {
        console.log(err);
    }
    else {
        size = count;
        console.log("Number of records in collection: ",count);
    }
});

HEADING.find(function(err,values) {
    values.forEach(function(value) {
        headingArray.push(value.heading);
    });
});

CONTENT.find(function(err,values) {
    values.forEach(function(value) {
        contentArray.push(value.content);
    });
});

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
        HEADING.deleteMany({_id : {$gte : 1}},function(err) {
            if(err) {
                console.log(err);
            }
            else {
                console.log("HEADINGS deleted.");
            }
        });
        CONTENT.deleteMany({_id : {$gte : 1}},function(err) {
            if(err) {
                console.log(err);
            }
            else {
                console.log("CONTENTS deleted.");
            }
        });
        size = 0;
    }
    else {
        const temp_heading = new HEADING({
            _id : size + 1,
            heading : req.body.blogHeading
        });
        temp_heading.save();

        const temp_content = new CONTENT({
            _id : size + 1,
            content : req.body.blogContent
        });
        temp_content.save();

        headingArray.push(req.body.blogHeading);
        contentArray.push(req.body.blogContent);
        size++;
    }
    res.redirect("/");
});

app.listen(3000,function() {
    console.log("Server is running at port 3000.");
});