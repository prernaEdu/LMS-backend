const mongo = require("mongoose");
const schema = mongo.Schema;

const courseSchema = new schema({
  courseId: string,
  courseTitle: string,
  courseType: string,
  lessons: [
    {
      title: string,
      description: string,
      duration: number,
    },
  ],
  description: string,
  duration: number,
  created_date: { default: new Date() },
});

const courses = mongo.model("courses", courseSchema, "courses");
module.exports = courses;
