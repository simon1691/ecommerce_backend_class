import passport from "passport";

export const authenticateJWT = (req, res, next) => {
    passport.authenticate("jwt", { session: false }, (err, user, info) => {
      console.log('authenticateJWT middleware executed');
      if (err || !user) {
        return res.redirect('/');
    }
      req.user = user;
      return next();
    })(req, res, next);
  };