const users = require("../model/users");
const courses = require("../model/course");
const { generateToken, decodeToken } = require("../services/jwtService");
const counter = require("../model/counter");
const courses = require("../model/course");
const courses = require("../model/course");

exports.createCourse = async (req, res) => {
  try {
    const token = await decodeToken(req);
    if (token && token.accountType === "Admin") {
      let payload = req.body;
      if (!payload) return res.send({ message: "Empty Payload" });
      let newCourse = new courses(payload);
      let courseCounter = await counter.findOne({ key: "courseId" });
      newCourse["courseId"] = `courseId_${
        courseCounter && courseCounter.value
      }`;
      let savedCourse = await newCourse.save();

      if (savedCourse) {
        await counter.updateOne({ key: "userId" }, { $inc: { value: 1 } });
        return res.send({
          createdCourse: savedCourse,
          message: "Coures created successfully",
        });
      } else return res.send({ message: "Could not create course" });
    } else {
      return res.send({
        message:
          "Unauthorised to create course, Only Admin can create courses.",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

exports.getCourses = async (req, res) => {
  try {
    let query = req.query;
    let queryPayload = {};
    if (query.courseId) {
      queryPayload["courseId"] = query.courseId;
    }
    let courses = await courses.find(queryPayload).sort({ created_date: 1 });
    if (courses) return res.send(courses);
    else return res.send("No courses found");
  } catch (error) {
    console.log(error);
  }
};

exports.deleteCourses = async (req, res) => {
  try {
    let query = req.query;
    if (!query.courseId) {
      return res.send({ message: "courseId is required" });
    }
    let deletedCourse = await courses.deleteOne({ courseId: query.courseId });
    if (deletedCourse)
      return res.send({ message: "course deleted successfully" });
    else return res.send("Could not delete course");
  } catch (error) {
    console.log(error);
  }
};

exports.updateCourse = async (req, res) => {
  try {
    let payload = req.body;
    if (!payload.courseId) {
      return res.send({ message: "courseId is required" });
    }
    let updatedCourse = await courses.updateOne(
      { courseId: payload.courseId },
      payload
    );
    if (updatedCourse)
      return res.send({ message: "course deleted successfully" });
    else return res.send("Could not delete course");
  } catch (error) {
    console.log(error);
  }
};

exports.addLessons = async (req, res) => {
  try {
    let payload = req.body;
    if (payload.courseId && payload.lessons.length) {
      const newLessons = req.body.lessons;
      let addedLessions = await courses.updateOne(
        { courseId: payload.courseId },
        { $push: { lessons: { $each: newLessons } } }
      );
      if (addedLessions)
        return res.send({ message: "lessons added successfully" });
      else return res.send("Could not add lesson");
    } else return res.send({ message: "Invalid Payload" });
  } catch (error) {
    console.log(error);
  }
};

exports.deleteLessons = async (req, res) => {
  try {
    let payload = req.query;
    if (payload.courseId && payload.lessonId) {
      let deletedLesson = await courses.updateOne(
        { courseId: payload.courseId },
        { $pull: { lessons: { _id: payload.lessonId } } }
      );
      if (deletedLesson)
        return res.send({ message: "lesson deleted successfully" });
      else return res.send("Could not delete lesson");
    } else return res.send({ message: "Invalid Payload" });
  } catch (error) {
    console.log(error);
  }
};

exports.enroll = async (req, res) => {
  try {
    const token = await decodeToken(req);
    const payload = req.body;
    if (!payload.courseId || !token.userName)
      return res.send({ message: "Course ID is required" });
    let enrolledCourse = await users.updateOne(
      { userName: token.userName },
      { $addToSet: { enrolledCourses: payload.courseId } }
    );
    if (enrolledCourse)
      return res.send({
        message: "You have enrolled to this course successfully",
      });
    else return res.send("Could not enroll, Please try again");
  } catch (error) {
    console.log(error);
  }
};

exports.withdraw = async (req, res) => {
  try {
    const token = await decodeToken(req);
    const payload = req.body;
    if (!payload.courseId || !token.userName)
      return res.send({ message: "Course ID is required" });
    let enrolledCourse = await users.updateOne(
      { userName: token.userName },
      { $pull: { enrolledCourses: payload.courseId } }
    );
    if (enrolledCourse)
      return res.send({
        message: "You have withdrawal to this course successfully",
      });
    else return res.send("Could not withdraw, Please try again");
  } catch (error) {
    console.log(error);
  }
};

exports.enrolledCourses = async (req, res) => {
  try {
    const token = await decodeToken(req);
    const user = await users.findOne({ userName: token.userName });
    const enrolledCourseIds = user.enrolledCourses;
    const allCourses = await courses.find({
      courseId: { $in: enrolledCourseIds },
    });
    if (allCourses) return res.send(allCourses);
    else return res.send("No course found");
  } catch (error) {
    console.log(error);
  }
};
