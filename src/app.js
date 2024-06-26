require("dotenv").config();

const express = require("express");
const app = express();
require("./db/conn");
const path = require("path");
const hbs = require("hbs");
const PORT = process.env.PORT || 3000;
const Register = require("./models/registers");
const bcrypt = require("bcrypt");
// const { ChildProcess } = require("child_process");
const Filepath = path.join(__dirname, "./public");
const template_path = path.join(__dirname, "../tempaltes/views");
const partial_path = path.join(__dirname, "../tempaltes/partial");
const cookieParser = require("cookie-parser");
const auth = require("./middleware/auth");

console.log(Filepath);
// to set the hbs
app.use(express.static(Filepath));
// view engine
app.set("view engine", "hbs");
//to set the template file
app.set("views", template_path);

app.use(express.json());
//for form
app.use(express.urlencoded({ extended: false }));
//cookie parser

app.use(cookieParser());

// to register the partial file of the path
hbs.registerPartials(partial_path);

console.log(process.env.SECRET_KEY);

// app.get("/", (req, res) => {
//   res.render("index"); // its the file name of the views folder
// });
app.get("/", (req, res) => {
  res.render("index"); // its the file name of the views folder
});

app.get("/secret", auth, (req, res) => {
  // console.log(`this is cookie ${req.cookies.jwt}`);
  res.render("secret");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", async (req, res) => {
  try {
    const password = req.body.password;
    const cpassword = req.body.confirmPassword;

    if (password === cpassword) {
      const registerEmp = new Register({
        firstname: req.body.first_name,
        lastname: req.body.lastname,
        email: req.body.email,
        phone: req.body.phone,
        gender: req.body.gender,
        age: req.body.age,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
      });

      const token = await registerEmp.generateToken();
      // console.log(token)

      // now get token to store on the cookies
      // res.cookie() function used to  set cookie name to value
      // the value may be string or object converted To JSON
      //syntax : res.cookie(name , value , [Option])

      res.cookie("jwt", token, {
        expires: new Date(Date.now() + 600000),
        httpOnly: true,
      });
      console.log(cookie);

      // password hash : its called middlewarwe means concept of the two bwtween entities

      const registered = await registerEmp.save();
      // console.log(registered);
      res.status(201).render("index");
    } else {
      res.send("password not match");
    }
  } catch (err) {
    res.status(400).send(err);
  }
});

// login check

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    console.log(`${email} ${password}`);

    const loginData = await Register.findOne({ email: email });

    // login time password match
    const ismatch = await bcrypt.compare(password, loginData.password); //first argument password is enter during login by the user and second password is store in db in form of bcrypt

    // jwt
    const token = await loginData.generateToken();
    // console.log(token);

    // cookie :  jwt is name of cookie

    res.cookie("jwt", token, {
      expires: new Date(Date.now() + 600000),
      httpOnly: true,
    });

    if (ismatch) {
      res.status(201).render("index");
    } else {
      res.send("invalid login details");
    }
  } catch (err) {
    res.status(400).send("invalid login details ");
  }
});

app.get("/logout", auth, async (req, res) => {
  try {
    // to clear cookie
    console.log(req.user);

    //for the single logout
    // req.user.tokens = req.user.tokens.filter((currToken)=>{
    //   return currToken.token  !== req.token
    // })

    // now logout from all device

    req.user.tokens = []

    res.clearCookie("jwt");
    console.log("logout here ");
    await req.user.save();
    res.render("login");
  } catch (err) {
    res.status(401).send(err);
  }
});

// uses of the hashinf aloritha
// const bcrypt = require('bcrypt');
// const securepass = async(password)=>{ // parameter

//   const data = await bcrypt.hash(password , 10)
//   console.log(data);   // $2b$10$nh.oo3N2s86Tse/Q96r8nOWDJjPILIKXjqXLuY./S6KtnAvATBEFO  (hashing password )

//   const ToOriginal = await bcrypt.compare(password ,data ) // if password is not/wrong then false
//   console.log(ToOriginal);
// }
// securepass('yash@123') //argument

// work of the jwt

// const jwt = require("jsonwebtoken");

// const createToken = async () => {
//   // first payload : it can unique value idis unique
//   // secrerkey can have 32 charcter
//   const token = await jwt.sign(
//     { _id: "6662e6ccc83f47642e1559a7" },
//     "sadbvrewfdffesdfdsdhgffgfggffgfgfgfas"
//   );
//   console.log(token);

//   const userVerify = await jwt.verify(token  ,"sadbvrewfdffesdfdsdhgffgfggffgfgfgfas")
//   console.log(userVerify);
// };
// createToken();

app.listen(PORT, () => {
  console.log(`server connected on the port number ${PORT}`);
});
