module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getStudent(res, mysql, context, complete){
        mysql.pool.query("SELECT id, fname, lname, house FROM Students", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.people = results;
            complete();
        });
    }

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deletestudent.js"];
        var mysql = req.app.get('mysql');
        getStudent(res, mysql, context, complete);

        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('students', context);
            }

        }
    });

    return router;
}();