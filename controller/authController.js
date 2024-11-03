const users = require("../model/users");
const counter = require("../model/counter");
const { generateToken, decodeToken } = require("../services/jwtService");
exports.signup = async (req, res) => {
  try {
    let payload = req.body;
    if (!payload.userName || !payload.password) {
      return res.send("invalid request");
    }
    const user = await users.findOne({ userName: payload.userName });
    if (user) return res.send(`${user.userName} already exist`);

    const newUser = new users(payload);
    const savedUser = await newUser.save();

    if (savedUser) return res.send("user created successfully");
    else return res.send("could not create user, please try again");
  } catch (error) {
    console.log(error);
  }
};

exports.login = async (req, res) => {
  try {
    let payload = req.body;
    if (!payload.userName || !payload.password) {
      return res.send("invalid request");
    }
    const user = await users.findOne({ userName: payload.userName });
    if (!user)
      return res.send(`user doesn't exist with username "${user.userName}"`);
    const tokenPayload = {
      userName: user.userName,
      accountType: user.accountType,
    };
    const token = await generateToken(tokenPayload);
    if (token) return res.send({ token: token, message: "login successfully" });
    else return res.send("could not generate token, Please try again");
  } catch (error) {
    console.log(error);
  }
};

exports.getLoggedInUser = async (req, res) => {
  try {
    const token = await decodeToken(req);
    if (token) {
      const userData = await users.findOne({ userName: token.userName });
      if (userData) return res.send(userData);
      else return res.send("No user found");
    } else {
      return res.send("something went wrong, Please try again later");
    }
  } catch (error) {
    console.log(error);
  }
};

exports.createCounter = async (req, res) => {
  try {
    const token = await decodeToken(req);
    let payload = req.body;
    if (token && payload.key) {
      const newCounter = new counter(payload);
      let savedCounter = await newCounter.save();
      if (savedCounter) return res.send("Counter created successfully");
      else return res.send("Could not create counter");
    } else {
      return res.send("something went wrong, Please try again later");
    }
  } catch (error) {
    console.log(error);
  }
};

exports.test = async (req, res) => {
  const token = await decodeToken(req);
  console.log();
  res.send(token);
};
