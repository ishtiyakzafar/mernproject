const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
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
  gender: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
    unique: true,
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
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

// generating token

employeeSchema.methods.generateAuthToken = async function () {
  try {
    const token = await jwt.sign({ _id: this._id.toString() }, process.env.SECRET_KEY);
    this.tokens = this.tokens.concat({ token: token });
    await this.save();

    return token;
  } catch (error) {
    res.send("the error is " + error);
    console.log("the error is " + error);
  }
};

//converting password into hash
employeeSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
    this.confirmPassword = await bcrypt.hash(this.password, 10);
  }
  next();
});

//create  a collection

const Register = new mongoose.model("Register", employeeSchema);

module.exports = Register;
