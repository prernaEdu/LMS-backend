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

router.route("/enroll").patch(authenticateToken, courseC.enroll);

router.route("/withdraw").patch(authenticateToken, courseC.enroll);

router.route("/enrolledCourses").patch(authenticateToken, courseC.enrolledCourses);


module.exports = router;
