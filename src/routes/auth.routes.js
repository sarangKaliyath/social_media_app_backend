const router = require("express").Router();
const {userLogin, generateLoginOtp} = require("../controllers/auth.controller");



router.post("/reg", userLogin);
router.post("/generate-otp", generateLoginOtp);


module.exports = router;