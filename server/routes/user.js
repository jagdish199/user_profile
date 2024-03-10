const { Router } = require("express");
const bcrypt = require("bcrypt");
const User = require("../module/user");
const JWT = require("jsonwebtoken");
const fetchUser = require('../middlewares/user');

const router = Router();

router.get("/", async (req, res) => {
    try {
        const allUsers = await User.find({});
        return res.send(allUsers);
    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error");
    }
});

router.post("/signup", async (req, res) => {
    const { name, email, password, location } = req.body;
    try {
        const user = await User.create({
            name,
            email,
            password,
            location
        });
        const token = JWT.sign({ userId: user._id }, process.env.JWT_SECRET);
        return res.send({ user, token });
    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error");
    }
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send({ msg: "Invalid email" });
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).send("Invalid password");
        }
        const token = JWT.sign({ userId: user._id }, process.env.JWT_SECRET);
        return res.send({ user, token });
    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error");
    }
});

router.get('/profile', fetchUser, async (req, res) => {
    const user = req.user;

    // const data = user.userId;
    const data = await User.findById(user.userId);
    res.send(data);
});

module.exports = router;
