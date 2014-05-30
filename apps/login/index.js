var express = require('express');
var debug = require("debug")("app:index");
var router = express.Router();

function result(app){
    router.get('/login', function(req, res) {
        var args;
        if (req.query.auth == "failed"){
            args = {"title": "Неверный пароль!"};
        } else {
            args = {"title": "Введите свои учетные данные!"};
        }
        res.render("login.html", args);
    });

    router.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/login');
    });

    router.post('/login', function(req, res){
            return app.settings.passport.authenticate('local', {
                successRedirect: req.query.url || "/",
                failureRedirect: '/login?auth=failed'
            })(req, res)
        }
    );

//    router.get('/loginFailure', function(req, res, next) {
//        res.send('Failed to authenticate');
//    });
//
//    router.get('/loginSuccess', function(req, res, next) {
//        res.send('Successfully authenticated');
//    });
    return router;
}
module.exports = result;
