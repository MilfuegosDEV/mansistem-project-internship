const LocalStrategy = require("passport-local").Strategy;

const bcrypt = require("bcryptjs");

const userModel = require("../models/userModel");
const user = new userModel();

function initialize(passport) {
  passport.use(
    new LocalStrategy(
      { usernameField: "username", passwordField: "password" },
      async (username, password, done) => {
        try {
          const foundUser = await user.findOne(username);
          if (!foundUser) {
            return done(null, false, {
              message: "El usuario no está registrado.",
            });
          }

          const passwordMatch = await bcrypt.compare(
            password,
            foundUser[0].password
          );
          if (passwordMatch) {
            return done(null, foundUser[0]);
          } else {
            return done(null, false, {
              message: "La contraseña es incorrecta.",
            });
          }
        } catch (err) {
          console.error(err);
          return done(err);
        }
      }
    )
  );
  passport.serializeUser((user, done) => {
    return done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    user
      .findById(id)
      .then((user) => {
        return done(null, user[0]);
      })
      .catch((err) => {
        return done(err);
      });
  });
}

module.exports = initialize;
