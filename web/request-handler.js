var path = require('path');
var archive = require('../helpers/archive-helpers');
var fs = require('fs');
var url = require('url');


// require more modules/folders here!
var returnFile = function(path, responseCode,res){
 fs.readFile(path, function(err, html){
   if(err){
     res.writeHeader(404);
     res.end();
   }else {
     res.writeHeader(responseCode, {"Content-Type": "text/html"});
     res.write(html);
     res.end();
   } 
 }); 
}

exports.handleRequest = function (req, res) {
  var requestURL = url.parse(req.url);
  var path = "";
  var responseCode = 0;
  
  if(req.method === 'GET'){
    if(requestURL.pathname==='/'){
      path = archive.paths.siteAssets+ '/index.html';
    }

    if(requestURL.pathname=== '/styles.css'){
      path = archive.paths.siteAssets+requestURL.pathname;
    }

    if(requestURL.pathname.slice(0,4)==='/www'){
      path = archive.paths.archivedSites+requestURL.pathname;
    }

    if(path!=="") {
      responseCode=200;
    }
    returnFile(path,responseCode,res);
  } else if(req.method === 'POST'){
    var postString = "";
    req.on('data', function(data){
      postString+=data; 
    });

    req.on('end', function(){
      // var post = JSON.parse(postString);
      var post = postString.slice(4);

      archive.addUrlToList(post, function(){
        archive.isUrlArchived(post, function(check){
          if(check){
            path = archive.paths.archivedSites+'/'+post;
          }
          else {
            path = archive.paths.siteAssets+'/loading.html';
          }
          console.log(path);
          responseCode=302;
          returnFile(path, responseCode,res);
        });
      });
    });
  }
};
