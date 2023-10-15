require("dotenv").config();
const path = require("path");

const express = require("express");
const session = require("express-session");
const flash = require("express-flash");

const app = express();

// express configuration.
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(flash());
app.use(
  session({
    secret: "secret",
    saveUninitialized: true,
    resave: true,
  })
);

app.listen(PORT, () => {
  console.log(`localhost:${PORT}`);
});
