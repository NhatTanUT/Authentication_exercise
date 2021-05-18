const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

module.exports = {
    findUser: function(username, password) {
        const username = req.body.username;

        //Hashing password md5
        // const password = md5(req.body.password);

        

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
    }
};