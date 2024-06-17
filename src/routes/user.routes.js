const router = require("express").Router();
const {registerNewUser, isUsernameRegistered} = require("../controllers/signup.controller");


router.post("/new-user", registerNewUser);
router.post("/username", isUsernameRegistered);

module.exports = router;