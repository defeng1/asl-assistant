const http = require('http');
const express = require('express');
const fs = require('fs');
const processing = require('./static/js/processing');
const particles = require('./static/js/particles');


app = express();
const PORT = 3000;

app.get('/home', function(req, res) {
    request('http://127.0.0.1:5000/flask', function (error, response, body) {
        console.error('error:', error); // Print the error
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        console.log('body:', body); // Print the data received
        res.send(body); //Display the response on the website
      });      
});

app.listen(PORT, function (){ 
    console.log('Listening on Port 3000');
});  
