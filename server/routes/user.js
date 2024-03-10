const {Router} = require("express");
const bcrypt = require("bcrypt")
const User = require("../module/user")
const router = Router();

router.get("/", async (req,res)=>{

    const allUsers = await User.find({});

    return res.send(allUsers);
})

router.post("/signup", async (req,res)=>{
    const {name,email,password,location} = req.body;
    const user = await User.create({
        name,
        email,
        password,
        location
    })
    return res.send(user);
})

router.post("/login", async (req,res)=>{
    const {email,password} = req.body;
    const user = await User.findOne({email});

    if(!user){
        return res.status(400).send({msg : "invalid email"});
    }
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
        return res.status(401).send("Invalid password");
    }
    return res.send(user);
})


module.exports = router;