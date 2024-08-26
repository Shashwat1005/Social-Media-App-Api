const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
// registration and login will be part of this

//user registration/ sign up
router.get("/", (req, res) => {
  res.sendStatus("Hey its auth Route");
});

router.post("/register", async (req, res) => {
  try {
    // to generate new hashed passwords
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // store the account credentials in the user schema
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    //saves the data and serves a response
    const user = await newUser.save();
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
  }
});

//Login

router.post("/login", async (req, res) => {
  try {
    //check email
    const user = await User.findOne({ email: req.body.email });
    !user && res.status(404).json("User does not exist");
    //check password
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    !validPassword && res.status(400).json("Wrong Password");
    // if both correct then login
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
