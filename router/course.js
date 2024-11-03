const router = require("express").Router();
const courseC = require("../controller/courseController");
const { authenticateToken } = require("../services/jwtService");

router
  .route("/courses")
  .post(authenticateToken, courseC.createCourse)
  .get(authenticateToken, courseC.getCourses)
  .patch(authenticateToken, courseC.updateCourse)
  .delete(authenticateToken, courseC.deleteCourses);

router
  .route("/lessions")
  .post(authenticateToken, courseC.addLessons)
  .delete(authenticateToken, courseC.deleteLessons);

module.exports = router;
