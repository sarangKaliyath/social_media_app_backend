const router = require("express").Router();
const { sendFriendsRequest, acceptFriendsRequest, getPendingRequestList } = require("../controllers/friendship.controller");
const authMiddleWare = require("../middleware/auth.middleware");

router.get("/send/:friendToAddId", authMiddleWare, sendFriendsRequest);
router.get("/add/:userIdToAdd", authMiddleWare, acceptFriendsRequest);
router.get("/pending", authMiddleWare, getPendingRequestList);

module.exports = router;