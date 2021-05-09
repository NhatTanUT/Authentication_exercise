//jshint esversion:6
require('dotenv').config()
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const saltRounds = 10;

// Use hashing password
// const md5 = require("md5");

// Use mongoose encryption
// const encrypt = require("mongoose-encryption"); 

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

//===== mongoose encryption plugin ======
// const secret = process.env.SECRET;

// userSchema.plugin(encrypt, {
//     secret: secret,
//     encryptedFields: ['password']
// });

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

        //Hashing password md5
        // const password = md5(req.body.password);

        const password = req.body.password;

        // console.log(password);
        User.findOne({
            email: username
        }, function (err, foundUser) {
            if (!err) {
                if (foundUser) {

                    // if (foundUser.password === password) {
                    //     res.render("secrets");
                    // }
                    // else {
                    //     console.log("Error pass");
                    // }

                    //Bcrypt
                    bcrypt.compare(password, foundUser.password, function (err, result) {
                        if (result === true)
                            res.render("secrets");
                    });

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
        // let newUser = new User({
        //     email: req.body.username,
        //     password: md5(req.body.password)
        // });
        // newUser.save(function (err) {
        //     if (!err) {
        //         res.render("secrets");
        //     } else {
        //         res.send(err);
        //     }
        // });

        //Bcrypt
        bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
            let newUser = new User({
                email: req.body.username,
                password: hash
            });
            newUser.save(function (err) {
                if (!err) {
                    res.render("secrets");
                } else {
                    res.send(err);
                }
            });
        });
    });

app.route("/submit")
    .get(function (req, res) {
        res.render("submit");
    });


app.listen(3000, function (req, res) {
    console.log("Server is starting at port 3000");
});