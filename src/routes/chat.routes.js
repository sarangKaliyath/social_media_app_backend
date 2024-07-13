const { getAllRecentChats } = require("../controllers/chat.controller");
const authMiddleWare = require("../middleware/auth.middleware");
const router = require("express").Router();


router.get("/all",authMiddleWare, getAllRecentChats);


module.exports = router;