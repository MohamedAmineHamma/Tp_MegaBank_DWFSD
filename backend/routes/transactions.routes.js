const router = require("express").Router();
const ctrl  = require("../controllers/transaction.controller");
const { protect:p2 } = require("../middleware/auth");

router.get("/", p2, ctrl.history);
module.exports = router;

