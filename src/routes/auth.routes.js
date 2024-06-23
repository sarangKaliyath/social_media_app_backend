const router = require("express").Router();
const {userLogin, generateLoginOtp, loginWithOtp, validateToken, resetUserPassword} = require("../controllers/auth.controller");



router.post("/login", userLogin);
router.post("/generate-otp", generateLoginOtp);
router.post("/otp-login", loginWithOtp);
router.post("/validate-token", validateToken);
router.post("/reset-password", resetUserPassword);


module.exports = router;