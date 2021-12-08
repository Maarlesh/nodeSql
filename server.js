var con;
var http = require('http');
var url = require('url');
var queryString = require('querystring');
var mysql = require('mysql');
function makeConnection(){
    con = mysql.createConnection({
        host:"localhost",
        user:"root",
        password:"maarlesh",
        database:"nodebackend"
    });
    console.log("connection established");
}
var server = http.createServer(function(req,res){
    res.setHeader("content-type","text/html");
    if(req.url == "/display"){
        makeConnection();
        con.connect(function(err) {
            if (err) throw err;
            con.query("SELECT * FROM student", function (err, result, fields) {
              if (err) throw err;
              for(i=0;i<result.length;i++){
                  var row = result[i];
                  console.log(row.name);
                  res.write(row.name+"");
              }
              res.end();
              console.log(result);
            });
          });  
    }
    if(req.url.includes("/insert")){
        makeConnection();
        con.connect(function(err) {
            if (err) throw err;
            console.log("Connected!");
            var purl = url.parse(req.url);
            var qs = queryString.parse(purl.query);
            var sql = "INSERT INTO student VALUES ('"+qs.name+"', '"+qs.age+"')";
            console.log(sql);
            con.query(sql, function (err, result) {
              if (err) throw err;
              console.log("1 record inserted");
              res.end();
            });
          });

    }
    if(req.url.includes("/update")){
        makeConnection();
        con.connect(function(err) {
            if (err) throw err;
            var purl = url.parse(req.url);
            var qs = queryString.parse(purl.query);
            var sql = "UPDATE student SET age = '"+qs.newage+"' WHERE name = '"+qs.name+"'";
            console.log(sql);
            con.query(sql, function (err, result) {
              if (err) throw err;
              console.log(result.affectedRows + " record(s) updated");
            });
          });  
         // res.end();
        
    }
    if(req.url.includes("/delete")){
        makeConnection();
        con.connect(function(err){
            console.log("Connected!");
            var purl = url.parse(req.url);
            var qs = queryString.parse(purl.query);
            var q = "DELETE FROM student where name = '"+qs.name+"';";
            console.log(q);
            con.query(q,function(err,result){
                console.log("no of rows deleted:"+result.affectedRows);
            })
            res.write("delete successful");
           // res.end();
        });
    }
   // res.end();
})
server.listen(5000);
console.log("server running on port 5000");