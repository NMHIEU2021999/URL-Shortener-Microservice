'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var dns = require('dns');
var cors = require('cors');
var crypto = require('crypto');
var app = express();
let tempDB = [];
// Basic Configuration 
var port = process.env.PORT || 3000;

/** this project needs a db !! **/ 
// mongoose.connect(process.env.DB_URI);

app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

  
// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});
app.post("/api/shorturl/new", (req,res)=>{
  var originURL = req.query.url;
  dns.lookup(originURL, (err)=>{
    if(err){
      res.json({
        error: "invalid URL"
      });
      return;
    }else{
      var sha256 = crypto.createHash('sha256').update(originURL, 'utf8').digest('base64');
      tempDB.push({
        original_url : originURL,
        short_url : sha256.substring(0,6)
      });
      res.json({
        original_url : originURL,
        short_url : sha256.substring(0,6)
      });
    }
  })
});
app.get("/api/shorturl/:shorturl", (req,res)=>{
  var longURL;
  var found = false;
  var shortURL = req.params.shorturl;
  tempDB.forEach((element)=>{
    if(element.short_url === shortURL){
      found = true;
      longURL = element.original_url;
    }
  });
  if(found){
    res.redirect(longURL);
    return;
  }else{
    res.json({
        error: "Not Found URL"
    });
  }
})

app.listen(port, function () {
  console.log('Node.js listening ...');
});