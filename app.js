//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/userDB", {
    useNewUrlParser: true
});

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

const secret = "hellohelloafasgasgasgasgsaasfasdasgas.";

userSchema.plugin(encrypt, {
    secret: secret,
    encryptedFields: ['password']
});

const User = new mongoose.model("User", userSchema);

app.route("/")
    .get(function (req, res) {
        res.redirect("/home");
    });

app.route("/home")
    .get(function (req, res) {
        res.render('home');
    });

app.route("/login")
    .get(function (req, res) {
        res.render("login");
    })
    .post(function (req, res) {
        const username = req.body.username;
        const password = req.body.password;
        
        // console.log(password);
        User.findOne({
            email: username
        }, function (err, foundUser) {
            // console.log(foundUser.password);
            if (!err) {
                if (foundUser) {
                    // res.send(foundUser)
                    // console.log(foundUser[0].password);
                    if (foundUser.password === password) {
                        // console.log(foundUser.password);
                        res.render("secrets");
                    }
                    else {
                        console.log("Error pass");
                    }
                }
            } else {
                console.log("Error");
            }
        });
    });

app.route("/register")
    .get(function (req, res) {
        res.render("register");
    })
    .post(function (req, res) {
        let newUser = new User({
            email: req.body.username,
            password: req.body.password
        });
        newUser.save(function (err) {
            if (!err) {
                res.render("secrets");
            } else {
                res.send(err);
            }
        });
    });

app.route("/submit")
    .get(function (req, res) {
        res.render("submit");
    });


app.listen(3000, function (req, res) {
    console.log("Server is starting at port 3000");
});