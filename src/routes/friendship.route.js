const router = require("express").Router();
const { sendFriendsRequest, acceptFriendsRequest } = require("../controllers/friendship.controller");
const authMiddleWare = require("../middleware/auth.middleware");

router.get("/:friendToAddId", authMiddleWare, sendFriendsRequest);
router.get("/add/:userIdToAdd", authMiddleWare, acceptFriendsRequest);

module.exports = router;