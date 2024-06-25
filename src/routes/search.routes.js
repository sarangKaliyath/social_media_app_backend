const router = require("express").Router();
const {searchUsers}  = require("../controllers/search.controller");
const authMiddleWare = require("../middleware/auth.middleware");


router.get("/:username", authMiddleWare, searchUsers);

module.exports = router;