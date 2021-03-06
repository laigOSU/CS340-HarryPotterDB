module.exports = function(){
    var express = require('express');
	var router = express.Router();
	var mysql = require('./dbcon.js');
	var methodOverride = require("method-override");

	function getStudents(res, mysql, context, complete){
	    mysql.pool.query('SELECT Students.id, Students.fname, Students.lname, FROM Students INNER JOIN Enrolled ON Enrolled.sid = Students.id', function(error, results, fields){
	        if(error){
	            res.write(JSON.stringify(error));
	            res.end();
	        }
	        context.students = results;
	        console.log(context)
	        complete();
	        
	    });
	}

	function getClass(res, mysql, context, req, complete){
	    mysql.pool.query('SELECT Students.id, Students.fname, Students.lname FROM Students WHERE Students.id ='+req.params.id, function(error, results, fields){
	        if(error){
	            res.write(JSON.stringify(error));
	            res.end();
	        }
	        context.student = results[0];
	        complete();
	    });
	}

	function getClasses(res, mysql, context, complete){
	    mysql.pool.query('SELECT Classes.id, Classes.name, Students.fname, Students.lname FROM Enrolled INNER JOIN Students ON Enrolled.sid = Students.id INNER JOIN Classes ON Enrolled.cid = Classes.id', function(error, results, fields){
	        if(error){
	            res.write(JSON.stringify(error));
	            res.end();
	        }
	        context.classes = results;
	        complete();
	    });
	}

	router.get('/',function(req,res){
		var context = {};
		callbackCount = 0;
		var mysql = req.app.get('mysql');
		//getStudents(res, mysql, context, complete)
		getClasses(res, mysql, context, complete)
		function complete(){
            callbackCount++;
            if(callbackCount >= 1){
            	console.log(context)
                res.render('enrollment', context);
            }
		}
	});

	router.get('/:id',function(req,res){
		var context = {};
		callbackCount = 0;
		context.jsscripts = ["selectedhouse.js", "updatestudent.js"];

		var mysql = req.app.get('mysql');
		getStudent(res, mysql, context, req, complete)
		getHouses(res, mysql, context, complete)
		function complete(){
            callbackCount++;
            if(callbackCount >= 2){
            	console.log(context)
                res.render('update-student', context);
            }
		}
	});

    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Students (fname, lname, house) VALUES (?,?,?)";
        var inserts = [req.body.fname, req.body.lname, req.body.house];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/students');
            }
        });
	});

    router.put('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "UPDATE Students SET fname=?, lname=?, house=? WHERE id=?";
        var inserts = [req.body.fname, req.body.lname, req.body.house, req.params.id];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }else{
				res.redirect('/students');
            }
        });
});
    router.delete('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM Students WHERE id = ?";
        var inserts = [req.params.id];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.status(400);
                res.end();
            }else{
                res.redirect('/students');
            }
        })
})

	return router;
}();