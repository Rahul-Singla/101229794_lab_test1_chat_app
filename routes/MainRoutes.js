require("dotenv").config();
const router = require("express").Router();
const UserModel = require("../models/UserModel");

router.get("/", async (req, res) => {
    if (!req.cookies || !req.cookies.username) {
        return res.redirect("/login");
    }

    try {
        let user = await UserModel.findOne({ username: req.cookies.username });
        if (!user) {
            return res.redirect("/login");
        } else {
            res.render("index", { user });
        }
    } catch (err) {
        return res.redirect("/login");
    }
});

router.get("/login", (req, res) => {
    res.render("login");
});

router.get("/sign_up", (req, res) => {
    res.render("sign_up");
});

router.get("/signout", async (req, res) => {
    return res.clearCookie("username").redirect("/login");
});

router.get("/chat_room", (req, res) => {
    if (!req.cookies || !req.cookies.username) {
        return res.redirect("/login");
    }

    res.render("chat_room");
});

module.exports = router;
