require("dotenv").config();
const path = require("path");

const express = require("express");
const layout = require("express-ejs-layouts");
const session = require("express-session");
const flash = require("express-flash");

const cookie = require("cookie-parser");

const router = require("./routes/router");
const authRouter = require("./routes/auth");

const app = express();

// express configuration.
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(cookie("secret"));
app.use(flash());
app.use(
  session({
    secret: "secret",
    saveUninitialized: true,
    resave: true,
  })
);

// Views configuration
// EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// layout's configuration.
app.set("layout", "layouts/layout"); // Searches layouts/layout instead layout.
app.use(layout);

// routes
app.use("/", router);
app.use("/", authRouter);

// Static folder
app.use("/static", express.static(path.join(__dirname, "static")));

app.listen(PORT, () => {
  console.log(`localhost:${PORT}`);
});
