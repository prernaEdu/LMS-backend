const users = require('../model/users');
const { generateToken, decodeToken } = require('../services/jwtService');
exports.signup = async (req, res) => {
    try {
        let payload = req.body;
        if (!payload.userName || !payload.password) {
            return res.send('invalid request');
        }
        const user = await users.findOne({ userName: payload.userName });
        if (user) return res.send(`${user.userName} already exist`);

        const newUser = new users(payload);
        const savedUser = await newUser.save();

        if (savedUser) return res.send('user created successfully');
        else return res.send('could not create user, please try again');
    } catch (error) {
        console.log(error);
    }
}

exports.login = async (req, res) => {
    try {
        let payload = req.body;
        if (!payload.userName || !payload.password) {
            return res.send('invalid request');
        }
        const user = await users.findOne({ userName: payload.userName });
        if (!user) return res.send(`user doesn't exist with username "${user.userName}"`);
        const tokenPayload = {
            userName: user.userName,
            accountType: user.accountType
        }
        const token = await generateToken(tokenPayload);
        if (token) return res.send({ token: token, message: 'login successfully' });
        else return res.send('could not generate token, Please try again');
    } catch (error) {
        console.log(error);
    }
}

exports.test = async (req, res) => {
    const token = await decodeToken(req);
    console.log();
    res.send(token)

}