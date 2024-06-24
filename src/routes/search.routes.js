const router = require("express").Router();
const {searchUsers}  = require("../controllers/search.controller");


router.get("/:username", searchUsers);

module.exports = router;