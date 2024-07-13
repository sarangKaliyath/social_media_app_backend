const router = require("express").Router();
const {searchUsers, searchFriends}  = require("../controllers/search.controller");
const authMiddleWare = require("../middleware/auth.middleware");


router.get("/:username", authMiddleWare, searchUsers);

router.get("/friends/:username", authMiddleWare, searchFriends);

module.exports = router;