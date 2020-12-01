const http = require('http');
const fs = require('fs');
const processing = require('./processing');
const particles = require('./particles');


const port = 3000;

fs.readFile('./index.html', function (err, html) {

  if (err) throw err;    

  http.createServer(function(request, response) {  
      response.writeHeader(200, {"Content-Type": "text/html"});  
      response.write(html);  
      response.end();  
  }).listen(port);
}); 