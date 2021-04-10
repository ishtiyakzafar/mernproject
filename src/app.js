require("dotenv").config();
const express = require("express");
const path = require("path");
const hbs = require("hbs");
const app = express();
const bcrypt = require("bcryptjs");
require("./db/conn");

const Register = require("./models/registers");

const port = process.env.PORT || 3000;

const static_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(static_path));
app.set("view engine", "hbs");
app.set("views", template_path);
hbs.registerPartials(partials_path);

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/register", (req, res) => {
  res.render("register");
});
app.get("/login", (req, res) => {
  res.render("login");
});

//create new user in db
app.post("/register", async (req, res) => {
  try {
    const password = req.body.password;
    const cpassword = req.body.confirmPassword;
    if (password === cpassword) {
      const registerEmployee = new Register({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        gender: req.body.gender,
        phone: req.body.phone,
        age: req.body.age,
        password: password,
        confirmPassword: cpassword,
      });
      console.log("the success part " + registerEmployee);

      const token = await registerEmployee.generateAuthToken();
      console.log("the token part " + token);

      const registered = await registerEmployee.save();
      console.log("the page part " + registered);
      res.status(201).render("index");
    } else {
      res.send("password not match");
    }
  } catch (error) {
    res.status(400).send(error);
    console.log("the error part page");
  }
});

// handle user login
app.post("/login", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const useremail = await Register.findOne({ email: email });

    const isMatch = await bcrypt.compare(password, useremail.password);

    const token = await useremail.generateAuthToken();
    console.log("login token " + token);

    if (isMatch) {
      res.status(201).render("index");
    } else {
      res.send("invalid details");
    }
  } catch (error) {
    res.status(400).send("invalid login detail");
  }
});

// const bcrypt = require("bcryptjs");

// const securePassword = async (password) => {
//   const passwordHash = await bcrypt.hash(password, 10);
//   console.log(passwordHash);

//   const passwordMatch = await bcrypt.compare("zafar@125hjh", passwordHash);
//   console.log(passwordMatch);
// };

// securePassword("zafar@125hjhj");

// const jwt = require("jsonwebtoken");

// const createToken = async () => {
//   const token = await jwt.sign(
//     { _id: "6071d0ac4b8387115091cc82" },
//     "mynameisishtiyakzafarimfromranchijharkahnd",
//     {
//       expiresIn: "2 seconds",
//     }
//   );
//   console.log(token);

//   const userVeri = await jwt.verify(
//     token,
//     "mynameisishtiyakzafarimfromranchijharkahnd"
//   );

//   console.log(userVeri);
// };

// createToken();

app.listen(port, () => {
  console.log(`server is running at port no ${port}`);
});
