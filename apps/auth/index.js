var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var crypto = require("crypto");

function config (app) {

    var db = app.settings.mysql, config = app.settings.config;

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(user, done) {
        db.query(
            "SELECT * FROM users WHERE id = ?",
            [user],
            function(err, rows){
                if (err) {
                    return done(err);
                }
                if (rows.length){
                    return done(null, rows[0]);
                }
                return done(null, false);
            }
        );
    });

    passport.use(new LocalStrategy(function(username, password, done) {
        process.nextTick(function() {
            var hashed_password = crypto.createHash('md5').update(config.salt + password).digest("hex");
            db.query(
                "SELECT * FROM users WHERE username = ?",
                [username],
                function(err, rows){
                    if (err) {
                        return done(err);
                    }
                    if (rows.length) {
                        if (hashed_password == rows[0].password){
                            return done(null, rows[0]);
                        } else {
                            return done(null, false);
                        }
                    } else {
                        return db.query(
                                "INSERT INTO users (username, password)" +
                                "VALUES (?, ?)",
                            [username, hashed_password],
                            function(err, rows){
                                if (err){
                                    return done(err);
                                } else {
                                    return done(null, {"id": rows.insertId, "username":username});
                                }

                            }
                        );
                    }
                }
            )
        });
    }));

    app.use(passport.initialize());
    app.use(passport.session());
    app.set("passport", passport);

    return passport
}

module.exports = config;