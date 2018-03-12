module.exports = function(){
    var express = require('express');
	var router = express.Router();
	var mysql = require('./dbcon.js');

	function getStudents(res, mysql, context, complete){
	    mysql.pool.query('SELECT Students.id AS id, Students.fname, Students.lname, Houses.name AS house, Classes.name AS class FROM Enrolled INNER JOIN Students ON Enrolled.sid = Students.id INNER JOIN Classes ON Enrolled.cid = Classes.id INNER JOIN Houses ON Students.house = Houses.id', function(error, results, fields){
	        if(error){
	            res.write(JSON.stringify(error));
	            res.end();
	        }
	        context.students = results;
	        console.log(context)
	        complete();
	        
	    });
	}


	function getProfessors(res, mysql, context, complete){
	    mysql.pool.query('SELECT Professors.id AS id, Professors.fname, Professors.lname, Professors.house FROM Professors', function(error, results, fields){
	        if(error){
	            res.write(JSON.stringify(error));
	            res.end();
	        }
	        context.professors = results;
	        console.log(context)
	        complete();
	        
	    });
	}

	function getStudent(res, mysql, context, req, complete){
	    mysql.pool.query('SELECT Students.id, Students.fname, Students.lname, Houses.name AS house, Classes.name AS class FROM Enrolled INNER JOIN Students ON Enrolled.sid = Students.id INNER JOIN Classes ON Enrolled.cid = Classes.id INNER JOIN Houses ON Students.house = Houses.id WHERE Students.id ='+req.params.id, function(error, results, fields){
	        if(error){
	            res.write(JSON.stringify(error));
	            res.end();
	        }
	        context.student = results[0];
	        complete();
	    });
	}

	function getClasses(res, mysql, context, complete){
	    mysql.pool.query('SELECT Classes.id, Classes.name, Professors.fname AS teacherfname, Professors.lname AS teacherlname FROM Classes INNER JOIN Professors ON Professors.id = Classes.teacher', function(error, results, fields){
	        if(error){
	            res.write(JSON.stringify(error));
	            res.end();
	        }
	        context.classes = results;
	        complete();
	    });
	}


	// router.get('/',function(req,res){
	// 	var context = {};
	// 	mysql.pool.query('SELECT Students.id, Students.fname, Students.lname, Houses.name AS house, Classes.name AS class FROM Enrolled INNER JOIN Students ON Enrolled.sid = Students.id INNER JOIN Classes ON Enrolled.cid = Classes.id INNER JOIN Houses ON Students.house = Houses.id', function(err, rows, fields){
	//     if(err){
	//       next(err);
	//       return;
	//     }
	//     context.students = rows;
	//     console.log(context);

	//     //res.render('students', {students: rows});
	//     res.render('students', context);
	// 	})
	// });

	// router.get('/:id',function(req,res){
	// 	var context = {};
	// 	mysql.pool.query('SELECT Students.id, Students.fname, Students.lname, Houses.name AS house, Classes.name AS class FROM Enrolled INNER JOIN Students ON Enrolled.sid = Students.id INNER JOIN Classes ON Enrolled.cid = Classes.id INNER JOIN Houses ON Students.house = Houses.id WHERE Students.id ='+req.params.id, function(err, rows, fields){
	//     if(err){
	//       next(err);
	//       return;
	//     }
	//     context.student = rows[0];

	//     console.log(context);

	//     //res.render('students', {students: rows});
	//     res.render('update-student', context);
	// 	})
	// });

	router.get('/',function(req,res){
		var context = {};
		callbackCount = 0;
		var mysql = req.app.get('mysql');
		getStudents(res, mysql, context, complete)
		getClasses(res, mysql, context, complete)
		getProfessors(res, mysql, context, complete)
		function complete(){
            callbackCount++;
            if(callbackCount >= 3){
                res.render('classes', context);
            }
		}
	});

	router.get('/:id',function(req,res){
		var context = {};
		callbackCount = 0;
		var mysql = req.app.get('mysql');
		getStudent(res, mysql, context, req, complete)
		getHouses(res, mysql, context, complete)
		function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('update-student', context);
            }
		}
	});

    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Classes (name, teacher) VALUES (?,?)";
        var inserts = [req.body.name, req.body.teacher];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/classes');
            }
        });
	});

	return router;
}();