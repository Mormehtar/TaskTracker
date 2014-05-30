var express = require('express');
var debug = require("debug")("app:index");
var router = express.Router();

function result(app){
    router.all("*", function(req, res, next) {
        req.isAuthenticated()?
            next():
            res.redirect('/login?url=' + req.url);
    });

    router.get("/", function (req, res) {
        res.render(
            "index.html",
            {"name": req.user.username}
        );
    });

    return router;
}

module.exports = result;
