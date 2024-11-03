const router = require("express").Router();
const courseC = require("../controller/courseController");
const { authenticateToken } = require("../services/jwtService");

router
  .route("/courses")
  .post(authenticateToken, courseC.createCourse)
  .get(authenticateToken, courseC.getCourses)
  .patch(authenticateToken, courseC.updateCourse)
  .delete(authenticateToken, courseC.deleteCourses)

module.exports = router;
