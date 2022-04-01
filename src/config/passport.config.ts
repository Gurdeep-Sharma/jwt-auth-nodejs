import Passport from "passport";
import { ExtractJwt, Strategy, StrategyOptions } from "passport-jwt";
import USER_MODEL from "../api/v1/models/user.model";
let jwtStrategyOptions: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  issuer: process.env.JWT_TOKEN_ISSUER ?? "http://localhost:5000",
  //expired tokens will not be ignored.
  ignoreExpiration: false,
  jsonWebTokenOptions: {
    complete: true,
    ignoreExpiration: false,
  },
  secretOrKey: process.env.JWT_TOKEN_SECRET ?? "YouCanChangeIt",
};

export const jwt_strategy = (passport: typeof Passport) =>
  passport.use(
    new Strategy(jwtStrategyOptions, async (jwt_payload, done) => {
      let foundUser = await USER_MODEL.findOne({
        _id: jwt_payload.payload._id,
      });

      if (foundUser) return done(null, foundUser, jwt_payload);
      else return done(null, false, false);
    })
  );
