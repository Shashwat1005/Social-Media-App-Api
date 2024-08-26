const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");
//create a post

router.post("/", async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Edit/Update a Post url me object id posts model se and user id to wahi apni purani wali
router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.updateOne({
        $set: req.body,
      });
      res.status(200).json("Post Updated");
    } else {
      res.status(403).json("You Can Only update your post");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// deleting a post
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.deleteOne();
      res.status(200).json("Post Purged");
    } else {
      res.status(403).json("You Can Only delete your post");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// Like or Unlike a post
router.put("/:id/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({
        $push: { likes: req.body.userId },
      });
      res.status(200).json("Post is getting more LOVEEE");
    } else {
      await post.updateOne({
        $pull: { likes: req.body.userId },
      });
      res.status(200).json("You Unliked this Post, the author is Sad");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

// fetching time line posts
router.get("/timeline/all", async (req, res) => {
  try {
    const currentUser = await User.findById(req.body.userId);
    const userPosts = await Post.find({
      userId: currentUser._id,
    });
    const friendposts = await Promise.all(
      currentUser.following.map((friendId) => {
        return Post.find({
          userId: friendId,
        });
      })
    );
    res.status(200).json(userPosts.concat(friendposts));
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
