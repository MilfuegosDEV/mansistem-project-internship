import { Strategy as LocalStrategy } from "passport-local";
import bycriptjs from "bcryptjs";

export default function initialize(passport) {
  passport.use(
    new LocalStrategy(
      { usernameField: "username", passwordField: "password" },
      async (username, password, done) => {
        try {
          const foundUser = await userModel.findOne(username);
          // Si no encuentra algún usuario
          if (!foundUser) {
            return done(null, false, "El usuario no está registrado.");
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
              return done(null, false, "La contraseña es incorrecta."); // Sino indica que no es la contraseña
            }
          } else {
            return done(null, false, "El usuario ha sido inhabilitado.");
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
    userModel
      .findById(id)
      .then((user) => {
        return done(null, user[0]);
      })
      .catch((err) => {
        return done(err);
      });
  });
}
