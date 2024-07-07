const router = require("express").Router();
const authMiddleWare = require("../middleware/auth.middleware");
const {createPost, getPosts, deleteMyPost, getPostById} = require("../controllers/post.controller");

router.post("/create", authMiddleWare, createPost);

router.get("/get", authMiddleWare, getPosts);

router.delete("/delete", authMiddleWare, deleteMyPost);

router.get("/get/:postId", authMiddleWare, getPostById);

module.exports = router;