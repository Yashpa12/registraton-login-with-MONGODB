const jwt = require("jsonwebtoken");
const Register = require("../models/registers");

const auth = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    const userVerify = jwt.verify(token, process.env.SECRET_KEY);

    console.log(userVerify);

    const user = await Register.findOne({ _id: userVerify._id });
    console.log(user);

    // to get the token and user (all data)
    req.token = token ;
    req.user = user;
    next();     
  } catch (err) {
    res.status(401).send(err);
  }
};

module.exports = auth;
