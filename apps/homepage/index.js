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

    router.post("/task", function(req, res){
         app.settings.mysql.query(
            "SELECT * " +
            "FROM tasks " +
            "WHERE user_id=? and id=?;",
            [req.user.id, req.body.id],
            function (err, result){
                if(err) throw err;
                res.render(
                    "task.html",
                    result[0]
                )
            }
         );
    });

    router.post("/finishtask", function(req, res){
        app.settings.mysql.query(
            "DELETE FROM tasks " +
            "WHERE id=? AND user_id=?;",
            [req.body.id, req.user.id],
            function(err, result){
                if(err) throw err;
                res.send("Done!");
            }
        );
    });

    router.get("/tasklist", function(req, res){
        app.settings.mysql.query(
            "SELECT * " +
            "FROM tasks " +
            "WHERE user_id=? " +
            "ORDER BY priority DESC;",
            [req.user.id],
            function(err, result){
                if(err) throw err;
                res.render(
                    "tasklist.html",
                    {tasklist: result}
                );
            }
        );
    });

    router.post("/savetask", function(req, res){
        function result(err, result){
            if (err) throw err;
            res.render(
            "task.html",
            {
                "id": result.insertId || req.body.id,
                "priority": req.body.priority,
                "task": req.body.task,
                "description": req.body.description
            }
        );
        }
        if (req.body.id){
            app.settings.mysql.query(
                "UPDATE tasks " +
                "SET priority = ?, task = ?, description = ? " +
                "WHERE id = ? AND user_id = ?;",
                [req.body.priority, req.body.task, req.body.description, req.body.id, req.user.id],
                result
            );
        } else {
            app.settings.mysql.query(
                "INSERT INTO tasks (user_id, task, description, priority) " +
                "VALUES (?, ?, ?, ?);",
                [req.user.id, req.body.task, req.body.description, req.body.priority],
                result
            );
        }
    });

    return router;
}

module.exports = result;
