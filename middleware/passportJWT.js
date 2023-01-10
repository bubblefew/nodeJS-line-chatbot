

const passport = require('passport');
require('dotenv').config()
const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
const secretOrKey = process.env.JWT_SECRET;
const jwt_token_opts = {};
jwt_token_opts.jwtFromRequest =  ExtractJwt.fromAuthHeaderAsBearerToken();
jwt_token_opts.secretOrKey = secretOrKey;
passport.use('jwt-token',new JwtStrategy(jwt_token_opts, async (jwt_payload, done) => {
    try {

        const { expiration } = jwt_payload

        if (Date.now() > expiration) {
            done(new Error('หมดอายุ'), null)
        }

       return done(null, jwt_payload);

    } catch (error) {
        done(error);
    }
}));

module.exports.isToken = (req, res, next) => {
    passport.authenticate('jwt-token', function(err, user, info) {
      if (err) return next(err);
      if (!user){
        const error = new Error('Unauthenticate');
        error.statusCode = 401;
        throw error
      } 
      req.user = user;
      next();
    })(req, res, next);
}

