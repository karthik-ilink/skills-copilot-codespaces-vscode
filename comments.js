// Create web server that listens on port 3000
// This server will serve static files from the public directory
// This server will also have a route for POSTing new comments
// This server will also have a route for GETing all comments

// Load the http module to create an http server.
var http = require('http');
var fs = require('fs');
var qs = require('querystring');

// Configure our HTTP server to respond with Hello World to all requests.
var server = http.createServer(function (request, response) {
  // console.log(request.url);
  if (request.url == '/new-comment' && request.method == 'POST') {
    var body = '';
    request.on('data', function(data) {
      body += data;
    });
    request.on('end', function() {
      var comment = qs.parse(body);
      fs.readFile('comments.json', function(err, data) {
        if (err) {
          console.log(err);
        } else {
          var comments = JSON.parse(data);
          comments.push(comment);
          fs.writeFile('comments.json', JSON.stringify(comments), function(err) {
            if (err) {
              console.log(err);
            } else {
              response.writeHead(302, {
                'Location': '/'
              });
              response.end();
            }
          });
        }
      });
    });
  } else if (request.url == '/comments' && request.method == 'GET') {
    fs.readFile('comments.json', function(err, data) {
      if (err) {
        console.log(err);
      } else {
        response.writeHead(200, {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        });
        response.write(data);
        response.end();
      }
    });
  } else {
    fs.readFile('public' + request.url, function(err, data) {
      if (err) {
        response.writeHead(404, {
          'Content-Type': 'text/plain'
        });
        response.write('Not Found');
        response.end();
      } else {
        response.writeHead(200, {
          'Content-Type': 'text/html'
        });
        response.write(data);
        response.end();
      }
    });
  }
});

// Listen on port 3000, IP defaults to
