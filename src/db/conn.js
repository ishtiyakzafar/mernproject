const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/resgistraionForm", {
    useCreateIndex: true,
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("connection successfull");
  })
  .catch((e) => {
    console.log("connection unsuccessfull");
  });
