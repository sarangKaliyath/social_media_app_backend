const router = require("express").Router();
const {registerNewUser} = require("../controllers/signup.controller");


router.post("/new-user", registerNewUser);

module.exports = router;