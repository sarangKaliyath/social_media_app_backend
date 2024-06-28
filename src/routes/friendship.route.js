const router = require("express").Router();
const { sendFriendsRequest } = require("../controllers/friendship.controller");
const authMiddleWare = require("../middleware/auth.middleware");

router.get("/:friendToAddId", authMiddleWare, sendFriendsRequest);

module.exports = router;