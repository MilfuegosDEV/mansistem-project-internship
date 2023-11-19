import { Strategy as LocalStrategy } from "passport-local";
import bcryptjs from "bcryptjs";
import UserModel from "../app/models/UserModel.mjs";

export default function initialize(passport) {
  passport.use(
    new LocalStrategy(
      { usernameField: "username", passwordField: "password" },
      async (username, password, done) => {
        try {
          const foundUser = await UserModel.findByUsername(username);
          // Si no encuentra algún usuario
          if (!foundUser) {
            return done(null, false, { msg: "El usuario no está registrado." });
          }
          // Compara el hash de la contraseña con la contraseña ingresada.
          if (foundUser.status_id) {
            const passwordMatch = await bcryptjs.compare(
              password.trim(),
              foundUser.password.trim()
            );
            if (passwordMatch) {
              return done(null, foundUser); // devuelve el usuario
            } else {
              return done(null, false, { msg: "La contraseña es incorrecta." }); // Sino indica que no es la contraseña
            }
          } else {
            return done(null, false, {
              msg: "El usuario ha sido inhabilitado.",
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

  passport.deserializeUser(async (id, done) => {
    await UserModel.findById(id)
      .then((user) => {
        return done(null, user);
      })
      .catch((err) => {
        return done(err);
      });
  });
}
