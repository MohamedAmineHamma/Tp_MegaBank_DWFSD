const router = require("express").Router();
const ctrl = require("../controllers/compte.controller");
const { protect, adminOnly } = require("../middleware/auth");

router.use(protect);
router.get("/",  ctrl.list);
router.get("/:id", ctrl.getOne);
router.post("/", adminOnly, ctrl.create);

module.exports = router;