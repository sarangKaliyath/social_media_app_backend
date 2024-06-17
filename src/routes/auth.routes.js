const router = require("express").Router();
const {userLogin} = require("../controllers/auth.controller");



router.post("/reg", userLogin);


module.exports = router;