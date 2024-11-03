const router = require('express').Router();
const authC = require('../controller/authController')
const { authenticateToken } = require('../services/jwtService');

router.route('/login')
    .post(authC.login);

router.route('/signup')
    .post(authC.signup);

router.route('/test')
    .get(authenticateToken, authC.test);

module.exports = router;