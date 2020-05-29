const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/keys");
const requireLogin = require("../middleware/requireLogin");

router.get("/protected", requireLogin, (req, res) => {
    res.send("hello user");
});

router.post("/signup", (req, res) => {
    const { name, email, password, pic } = req.body;
    if (!email || !password || !name) {
        res.status(422).json({ error: "please add all the fields" });
    } else {
        User.findOne({ email: email })
            .then((saveUser) => {
                if (saveUser) {
                    return res
                        .status(422)
                        .json({ error: "user already exits with that email" });
                }
                bcrypt.hash(password, 12).then((hashedPassword) => {
                    const user = new User({
                        email,
                        password: hashedPassword,
                        name,
                        pic,
                    });

                    user.save()
                        .then((user) => {
                            res.json({ message: "saved sucessfuly" });
                            // const token = jwt.sign(
                            //     { _id: user._id },
                            //     JWT_SECRET
                            // );
                            // res.json({ token });
                        })
                        .catch((err) => {
                            console.log(err);
                        });
                });
            })
            .catch((err) => {
                console.log(err);
            });
    }
});

router.post("/signin", (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(422).json({ error: "please add email or password" });
    } else {
        User.findOne({ email: email }).then((saveUser) => {
            if (!saveUser) {
                return res
                    .status(422)
                    .json({ error: "invalid Email or Password" });
            }
            bcrypt
                .compare(password, saveUser.password)
                .then((doMatch) => {
                    if (doMatch) {
                        //res.json({ message: "successfuly signed in" });
                        const token = jwt.sign(
                            { _id: saveUser._id },
                            JWT_SECRET
                        );
                        const {
                            _id,
                            name,
                            email,
                            followers,
                            following,
                            pic,
                        } = saveUser;
                        res.json({
                            token,
                            user: {
                                _id,
                                name,
                                email,
                                followers,
                                following,
                                pic,
                            },
                        });
                    } else {
                        return res
                            .status(422)
                            .json({ error: "Invalid email or password" });
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        });
    }
});

module.exports = router;
