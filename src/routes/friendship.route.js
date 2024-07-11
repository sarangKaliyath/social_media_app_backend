const router = require("express").Router();
const { sendFriendsRequest, acceptFriendsRequest, getPendingRequestList, getFriendsList, removeFriend, rejectRequest, rejectSentRequest } = require("../controllers/friendship.controller");
const authMiddleWare = require("../middleware/auth.middleware");

router.get("/send/:friendToAddId", authMiddleWare, sendFriendsRequest);
router.get("/add/:userIdToAdd", authMiddleWare, acceptFriendsRequest);
router.get("/pending", authMiddleWare, getPendingRequestList);
router.get("/accepted", authMiddleWare, getFriendsList);
router.delete("/remove/:userToRemoveId", authMiddleWare, removeFriend);
router.delete("/reject/:userIdToReject", authMiddleWare, rejectRequest);
router.delete("/cancel/:userIdToCancelReq", authMiddleWare, rejectSentRequest);

module.exports = router;