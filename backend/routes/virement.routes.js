const router = require("express").Router();
const ctrl  = require("../controllers/virement.controller");
const { protect } = require("../middleware/auth");

router.post("/", protect, ctrl.effectuer);

module.exports = router;



