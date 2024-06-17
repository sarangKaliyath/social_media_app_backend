const router = require("express").Router();
const {userLogin, generateLoginOtp, loginWithOtp} = require("../controllers/auth.controller");



router.post("/reg", userLogin);
router.post("/generate-otp", generateLoginOtp);
router.post("/otp-login", loginWithOtp);


module.exports = router;