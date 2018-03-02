var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs340_scimonea',
  password        : 'XXXX',
  database        : 'cs340_scimonea'
});
module.exports.pool = pool;
