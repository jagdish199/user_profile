const { Router } = require("express");
const bcrypt = require("bcrypt");
const User = require("../module/user");
const JWT = require("jsonwebtoken");
const fetchUser = require('../middlewares/user');
const multer = require("multer")
const path = require("path")

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

router.post("/login/edit", fetchUser, async (req, res) => {
    const user = req.user;
    const { name, password, location } = req.body;

    try {
        const updateData = {};
        if (name) updateData.name = name;
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            updateData.password = hashedPassword;
        }
        if (location) updateData.location = location;

        const updatedUser = await User.findByIdAndUpdate(user.userId, updateData, { new: true });

        return res.json({ user: updatedUser });
    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error");
    }
});


router.delete("/login/delete", fetchUser, async (req, res) => {
    const user = req.user;

    try {
        const existingUser = await User.findById(user.userId);
        if (!existingUser) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        await User.findByIdAndDelete(user.userId);

        return res.json({ success: true, message: "User deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve(`./public/uploads/`))
    },
    filename: function (req, file, cb) {
        const fileName = `${Date.now()}-${file.originalname}`;
        cb(null, fileName)
    }
})

const upload = multer({ storage: storage })

router.post("/login/upload", fetchUser, upload.single("profileImage"), async (req, res) => {
    const user = req.user;

    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: "No file uploaded" });
        }

        const updateData = { coverImageURL: `uploads/${req.file.filename}` };

        const updatedUser = await User.findByIdAndUpdate(user.userId, updateData, { new: true });

        return res.json({ success: true, message: "Profile image updated successfully", user: updatedUser });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});


module.exports = router;
