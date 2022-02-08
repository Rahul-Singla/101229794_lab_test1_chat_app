require("dotenv").config();
const router = require("express").Router();
const UserModel = require("../models/UserModel");

// Signup
router.post("/sign_up", async (req, res) => {
    if (!req.body) {
        return res.status(500).json({ message: "First Name, Last Name, Username and Password required" }).send();
    }

    let user = new UserModel(req.body);
    try {
        await user.save();
        res.cookie("username", req.body.username, { expires: new Date(Date.now() + 900000) })
            .status(201)
            .json({ status: 1, message: "Done" })
            .send();
    } catch (err) {
        return res.status(500).json({ message: err.message }).send();
    }
});

// Login
router.post("/login", async (req, res) => {
    if (!req.body) {
        return res.status(500).json({ message: "Username and Password required" }).send();
    }

    let { username, password } = req.body;
    try {
        let user = await UserModel.findOne({ username: username });
        if (!user) {
            return res.status(500).json({ message: "Username does not found" }).send();
        }

        if (user.password != password) {
            return res.status(500).json({ message: "Password is incorrect" }).send();
        }

        return res
            .cookie("username", username, { expires: new Date(Date.now() + 9000000) })
            .status(201)
            .json({ status: 1, message: "Done" })
            .send();
    } catch (err) {
        return res.status(500).json({ message: err.message }).send();
    }
});

module.exports = router;
