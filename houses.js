/*****************************************************************************
  EXPORT SET UP FOR HOUSES.JS
*****************************************************************************/
module.exports = function(){
  var express = require('express');
	var router = express.Router();
	var mysql = require('./dbcon.js');
  var methodOverride = require("method-override");

  /*****************************************************************************
    HELPER QUERY FUNCTIONS
  *****************************************************************************/
  function getHouses(res, mysql, context, complete){
    mysql.pool.query('SELECT Houses.id AS id, Houses.name, Professors.fname AS head_prof_fname, Professors.lname AS head_prof_lname FROM Houses INNER JOIN Professors ON Houses.head_prof = Professors.id',
      function(error, results, fields){
        if(error){
            res.write(JSON.stringify(error));
            res.end();
        }
        context.houses = results;
        complete();

    });
  }

  function getHouse(res, mysql, context, req, complete){
    mysql.pool.query('SELECT Houses.id AS id, Houses.name, Professors.fname AS head_prof_fname, Professors.lname AS head_prof_lname FROM Houses INNER JOIN Professors ON Houses.head_prof = Professors.id WHERE Houses.id ='+req.params.id,
    function(error, results, fields){
         if(error){
             res.write(JSON.stringify(error));
             res.end();
         }
         context.house = results[0];
         complete();
     });
  }

  function getProfessors(res, mysql, context, complete){
    mysql.pool.query('SELECT Professors.id, Professors.fname, Professors.lname FROM Professors',
    function(error, results, fields){
      if(error){
          res.write(JSON.stringify(error));
          res.end();
      }
      context.professors = results;
      complete();
  });

  }


  /*****************************************************************************
    DISPLAY ALL HOUSES
  *****************************************************************************/
  router.get('/',function(req,res){
    var context = {};
    callbackCount = 0;
    var mysql = req.app.get('mysql');
    getHouses(res, mysql, context, complete)
    getProfessors(res, mysql, context, complete)
    function complete(){
            callbackCount++;
            if(callbackCount >= 2){
              console.log(context)
              res.render('houses', context);
            }
    }
  });



  /*****************************************************************************
    DISPLAY ONE HOUSE (for UPDATE only)
  *****************************************************************************/
  router.get('/:id',function(req,res){
		var context = {};
		callbackCount = 0;
		var mysql = req.app.get('mysql');
    getHouse(res, mysql, context, req, complete)
    getProfessors(res, mysql, context, complete)
		function complete(){
      callbackCount++;
      if(callbackCount >= 2){
        console.log(context)
        res.render('update-house', context);
      }
		}
	});

  /*****************************************************************************
    INSERT HOUSE
  *****************************************************************************/
    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Houses (name, head_prof) VALUES (?,?)";
        var inserts = [req.body.name, req.body.head_prof];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/houses');
            }
        });
  });
  /*****************************************************************************
    DELETE HOUSE
  *****************************************************************************/
    router.put('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "UPDATE Houses SET name=?, head_prof=? WHERE id=?";
        var inserts = [req.body.name, req.body.head_prof, req.params.id];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }else{
        res.redirect('/houses');
            }
        });
});
    router.delete('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM Houses WHERE id = ?";
        var inserts = [req.params.id];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.status(400);
                res.end();
            }else{
                res.redirect('/houses');
            }
        })
})

/*****************************************************************************
  CLOSE THE EXPORT SET UP FOR HOUSES.JS: RETURN ROUTER
*****************************************************************************/
  return router;
}();