const router = require("express").Router();
const { body } = require("express-validator");
const { protect } = require("../middleware/auth");
const authController = require("../controllers/auth.controller");


router.post("/register", [
    body("nom").notEmpty().isLength({ min: 2, max: 50 }),
    body("email").isEmail(),
    body("password").isLength({ min: 6 }),
], authController.register);

router.post("/login", authController.login);

router.get("/me", protect, authController.me);

module.exports = router;