//reprsentation of data
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const employeeSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: Number,
    required: true,
    unique: true,
  },
  gender: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  confirmPassword: {
    type: String,
    required: true,
  },
  tokens : [{
    token : {
      type : String,
      required : true
    }
  }]
});

// jwt
// methodds call when we are working with instance  (like registeremp)
employeeSchema.methods.generateToken   = async function () {
  try {
    const yashToken = jwt.sign(
      { _id: this._id.toString() },
      process.env.SECRET_KEY
    );
    this.tokens = this.tokens.concat({token:yashToken})
    await this.save()
    // console.log(yashToken);
    return yashToken
  } catch (err) {
    res.send(`the erro part ${err}`);
  }
};

// pre method is kind of middleware use for checking the password
// take the two parameter
// save method ke pehle muje password ko hash karna hai esliye
employeeSchema.pre("save", async function (next) {
  // if user goes on password field 0
  if (this.isModified("password")) {

    this.password = await bcrypt.hash(this.password, 10); // two parameter : password , 10 is round

    this.confirmPassword = await bcrypt.hash(this.password, 10);
  }

  next(); // aage jaao or aage jaane ke lie
});

//create a collections

const Register = new mongoose.model("Register", employeeSchema);
module.exports = Register;
