const router = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");
// search for different users
router.get("/", (req, res) => {
  res.sendStatus("Hey its user Route");
});

//updating user profile
router.put("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (err) {
        return res.status(500).json(err);
      }
    }
    try {
      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      res.status(200).json("Profile Updated");
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    return res.sendStatus(403).json("You can Update only your profile");
  }
});

//Delete user profile
router.delete("/:id", async (req, res) => {
  if (req.body.userId === req.params.id || req.body.isAdmin) {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      res.status(200).json("Purged Your Only Cool Virtual Existence !!");
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    return res.sendStatus(403).json("You can PURGE! only your profile !!");
  }
});

//Get a user profile
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, updatedAt, ...other } = user._doc;
    res.status(200).json(other);
  } catch (err) {
    res.status(500).json(err);
  }
});

// follow a user
router.put("/:id/follow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      // me
      const user = await User.findById(req.params.id);
      // user i am trying to follow
      const currentUser = await User.findById(req.body.userId);
      if (!user.followers.includes(req.body.userId)) {
        await user.updateOne({
          $push: { followers: req.body.userId },
        });
        await currentUser.updateOne({
          $push: { following: req.params.id },
        });
        res.status(200).json("You Started Following this Person");
      } else {
        res.status(403).json("You Cannot FOLLOW someone more than ONCEE");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    return res
      .status(403)
      .json("You can admire yourself but NOT FOLLOW yourself");
  }
});

// unfollow a user
router.put("/:id/unfollow", async (req, res) => {
  if (req.body.userId !== req.params.id) {
    try {
      // me
      const user = await User.findById(req.params.id);
      // user i am trying to follow
      const currentUser = await User.findById(req.body.userId);
      if (user.followers.includes(req.body.userId)) {
        await user.updateOne({
          $pull: { followers: req.body.userId },
        });
        await currentUser.updateOne({
          $pull: { following: req.params.id },
        });
        res
          .status(200)
          .json("You UnFollowed this Person and Broke their Heart");
      } else {
        res
          .status(403)
          .json("You Cannot UNFOLLOW someone who you dont actually FOLLOW");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    return res
      .status(403)
      .json("You can admire yourself but NOT FOLLOW yourself");
  }
});

module.exports = router;
