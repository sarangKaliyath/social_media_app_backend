const router = require("express").Router();
const authMiddleWare = require("../middleware/auth.middleware");
const {createPost, getPosts} = require("../controllers/post.controller");

router.post("/create", authMiddleWare, createPost);

router.get("/get", authMiddleWare, getPosts);

module.exports = router;