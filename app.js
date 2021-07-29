const express = require("express");
const app = express();
const connectDB = require("../achapet-server/mongoDB/bd");

const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");

app.use(express.json());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());

app.use("/", (req, res) => {
  return res.json({
    message: "boa meu garoto !",
  });
});

// var usersRouter = require('./routes/users');

require("../achapet-server/routes/users")(app);
require("dotenv").config();

// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(express.static(path.join(__dirname, 'public')));

// app.use('/users', usersRouter);

connectDB();
server = app.listen(process.env.PORT || 3030, () => {
  console.log("Servidor online!");
});

module.exports = app;
