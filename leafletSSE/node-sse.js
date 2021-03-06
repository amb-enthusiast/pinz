var http = require('http');
var sys = require('sys');
var fs = require('fs');

console.log('Creating HTTP server for SSE')

http.createServer(function(req, res) {
  debugHeaders(req);

  if (req.headers.accept && req.headers.accept == 'text/event-stream') {
  	console.log('Generating event...');
    if (req.url == '/events') {
      sendSSE(req, res);
    } else {
      res.writeHead(404);
      res.end();
    }
  } else {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(fs.readFileSync(__dirname + '/sse-node.html'));
    res.end();
  }
}).listen(8000);

function sendSSE(req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  });

  var count = 0.0;
  
  var id = (new Date()).toLocaleTimeString();

  setInterval(function() {
    constructSSE(res, id, count++);
  }, 5000);

  constructSSE(res, id, count++);
  //res.end();
}

function constructSSE(res, id, data) {
  res.write('id: ' + id + '\n');
  res.write("data: " + data + '\n\n');
}

function debugHeaders(req) {
  console.log('Error: ' + req.url);
  sys.puts('URL: ' + req.url);
  for (var key in req.headers) {
    sys.puts(key + ': ' + req.headers[key]);
  }
  sys.puts('\n\n');
}