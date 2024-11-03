const router = require("express").Router();
const courseC = require("../controller/courseController");
const { authenticateToken } = require("../services/jwtService");

router.route("/createCourse").post(authenticateToken, courseC.createCourse);

module.exports = router;
