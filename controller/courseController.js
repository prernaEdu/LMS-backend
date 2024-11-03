const users = require("../model/users");
const courses = require("../model/course");
const { generateToken, decodeToken } = require("../services/jwtService");
const counter = require("../model/counter");

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