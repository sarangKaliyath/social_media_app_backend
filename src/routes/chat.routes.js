const { getAllRecentChats, getUserInfo } = require("../controllers/chat.controller");
const authMiddleWare = require("../middleware/auth.middleware");
const router = require("express").Router();


router.get("/all",authMiddleWare, getAllRecentChats);

router.get("/:userToFind", authMiddleWare, getUserInfo)


module.exports = router;