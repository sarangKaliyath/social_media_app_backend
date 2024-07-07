const router = require("express").Router();
const authMiddleWare = require("../middleware/auth.middleware");
const {createPost, getPosts, deleteMyPost} = require("../controllers/post.controller");

router.post("/create", authMiddleWare, createPost);

router.get("/get", authMiddleWare, getPosts);

router.delete("/delete", authMiddleWare, deleteMyPost);

module.exports = router;