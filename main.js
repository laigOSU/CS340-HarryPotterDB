/*  
    Uses express, dbcon for database connection, body parser to parse form data 
    handlebars for HTML templates  
*/

var express = require('express');
var mysql = require('./dbcon.js');
var bodyParser = require('body-parser');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});

app.engine('handlebars', handlebars.engine);
app.use(bodyParser.urlencoded({extended:true}));
app.use('/static', express.static('public'));
app.set('view engine', 'handlebars');
app.set('port', process.argv[2]);
app.set('mysql', mysql);

//app.use('/students', require('./students.js'));

app.get('/',function(req,res){
  var context = {};
  mysql.pool.query('SELECT * FROM Students', function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
    context.results = JSON.stringify(rows);

    res.render('home', context);
  })

});

app.get('/students',function(req,res){
  var context = {};
  mysql.pool.query('SELECT Students.fname, Students.lname, Houses.name AS house, Classes.name AS class FROM Enrolled INNER JOIN Students ON Enrolled.sid = Students.id INNER JOIN Classes ON Enrolled.cid = Classes.id INNER JOIN Houses ON Students.house = Houses.id', function(err, rows, fields){
    if(err){
      next(err);
      return;
    }
    context.students = rows;
    console.log(context);

    //res.render('students', {students: rows});
    res.render('students', context);
  })

});

app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
