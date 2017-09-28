var mclient = require('mongodb').MongoClient;
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.json());

mclient.connect('mongodb://localhost:27017/blockbuster', function(err, dbconn){
   if(!err) { //sucessful mongo connect
    console.log('We connected to our mongo server. Yay!....');
    //process express api request
    var movies = dbconn.collection("movies");
    
    app.get('/api/movies/:moviename', function(request, response) {
      var movieName = request.params.moviename;
      movies.find({'details.title': movieName}).toArray(function(err, results) { 
        // in here you have a results variable [array] with your results
        if(!err){
          response.write(JSON.stringify({data: results}));
        }else{
          response.write(err);
        }
        response.end();
      }); // ends movies find toArray
    }); // end app get handler
    
    app.post('/api/movies/:moviename', function (request, response) {
      var movieName = request.params.moviename;
      response.writeHead(200, {"Content-type": "application/json"});
      var postData = request.body;
      if(!err){
      movies.insert(postData, function(err, results){
        response.write(JSON.stringify({data: postData}));
        response.end();
      });
      }else{
        console.log(err);
      }
    });

    app.put('/api/movies/:moviename', function(request, response){
      var movieName = request.params.moviename;
      var upData = request.body;
     
      response.writeHead(200, {"Content-type": "application/json"});
      movies.update({'details.title': movieName}, upData, {}, function(err, results){
        movies.find({'details.title': movieName}).toArray(function(err, results) {
            response.write(JSON.stringify({results}));
            response.end();
        });
      });
    }); // end post req handler
    
    app.delete('/api/movies/', function (request, response) {
      var movieName = request.params.moviename;
      response.writeHead(200, {"Content-type": "application/json"});
      var delData = request.body;
      movies.remove(delData);
      response.end();
    });
    
    app.listen(process.env.PORT);
    
  } else { //mongo connect error
    console.log(err);
  } //program stops here waiting for connect to end
});