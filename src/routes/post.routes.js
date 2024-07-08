const router = require("express").Router();
const authMiddleWare = require("../middleware/auth.middleware");
const {createPost, getPosts, deleteMyPost, getPostById, addComment, deleteComment} = require("../controllers/post.controller");

router.post("/create", authMiddleWare, createPost);

router.get("/get", authMiddleWare, getPosts);

router.delete("/delete", authMiddleWare, deleteMyPost);

router.get("/get/:postId", authMiddleWare, getPostById);

router.post("/comment/:postId", authMiddleWare, addComment);

router.delete("/comment/:postId/:commentId", authMiddleWare, deleteComment);

module.exports = router;