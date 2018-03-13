const passport = require('passport');
const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;
const UserModel = require('../models/user-model');

passport.serializeUser((userFromDb, next) => {
    next(null, userFromDb._id);
});

passport.deserializeUser((userId,next) => {
    UserModel.findById(userId, (err, userFromDb) => {
        if(err) {
            next(err);
            return;
        }

        next(null, userFromDb);
    });
});

passport.use(
    new LocalStrategy(
        {
            usernameField: 'loginUsername',
            passwordField: 'loginPassword'
        },
        (theUsername, thePassword, next) => {
            UserModel.findOne({username: theUsername}, (err, userFromDb) => {
                if (err) {
                    next(err);
                    return;
                }

                if(userFromDb === null) {
                    next(null, false, { message: "Incorrect username"});
                    return;
                }

                if (
                    bcrypt.compareSync(thePassword, userFromDb.password) ===
                    false
                ) {
                    next(null, false, {message: "Incorrect password"});
                    return;
                }

                next(null, userFromDb);
            });
        }
    )
);