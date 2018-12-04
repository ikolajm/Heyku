// Require all npm installs
var express = require("express");
var app = express();
var mongoose = require("mongoose");
var bodyParser = require("body-parser");

// Connect mongoose to new db


// Set view engine to seek for .ejs files
app.set("view engine", "ejs");

// Let app use bodyParser
app.use(bodyParser.urlencoded({extended: true}));

// Set public directory for style and script files
app.use(express.static(__dirname + "/public"));

// ==========
// ROUTES
// ==========

// Render the landing page
app.get("/", function(req, res) {
    res.render("landing");
});

// Render main page (facebook timeline clone)
app.get("/timeline", function(req, res) {
   res.render("timeline"); 
});


// ==========

// Listen for server to begin and notify console
app.listen(process.env.PORT, process.env.IP, function() {
   console.log("The app has started successfully..."); 
});