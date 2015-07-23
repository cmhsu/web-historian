var path = require('path');
var archive = require('../helpers/archive-helpers');
var fs = require('fs');
var url = require('url');


// require more modules/folders here!

exports.handleRequest = function (req, res) {
  var requestURL = url.parse(req.url);
  
  if(req.method === 'GET'){
    var path = "";
    if(requestURL.pathname==='/'){
      path = archive.paths.siteAssets+ '/index.html';
    }

    if(requestURL.pathname.slice(0,4)==='/www'){
      path = archive.paths.archivedSites+requestURL.pathname;
    }




    fs.readFile(path, function(err, html){
      if(err){
        res.writeHeader(404);
        res.end();
      }else {
        res.writeHeader(200, {"Content-Type": "text/html"});
        res.write(html);
        res.end();
      } 
    });
  } else if(req.method === 'POST'){
    var postString = "";
    req.on('data', function(data){
      postString+=data; 
    });

    req.on('end', function(){
      var post = JSON.parse(postString);
      archive.addUrlToList(post.url, function(){
        res.writeHeader(302);
        res.end();
      });
    });
  }

};
