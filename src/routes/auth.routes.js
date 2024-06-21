const router = require("express").Router();
const {userLogin, generateLoginOtp, loginWithOtp, validateToken} = require("../controllers/auth.controller");



router.post("/reg", userLogin);
router.post("/generate-otp", generateLoginOtp);
router.post("/otp-login", loginWithOtp);
router.post("/validate-token", validateToken);


module.exports = router;