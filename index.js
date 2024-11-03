const express = require('express');
const app = express();
const cors = require('cors')


app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const mongo = require('mongoose');

async function connectDB() {
    try {
        await mongo.connect('mongodb://localhost:27017/lms');
        console.log("MongoDB connected successfully!");
    } catch (error) {
        console.error("Connection failed:", error);
    }
}

app.use(cors());

const authRouter = require('./router/auth');
app.use(authRouter);

connectDB();


app.listen(5000, () => {
    console.log('server is running on port 5000');
})