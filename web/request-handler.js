var path = require('path');
var archive = require('../helpers/archive-helpers');
var fs = require('fs');
var url = require('url');


// require more modules/folders here!

exports.handleRequest = function (req, res) {
  var requestURL = url.parse(req.url);
  if(requestURL.pathname==='/'){
    requestURL.pathname = '/index.html';
  }
  fs.readFile(archive.paths.siteAssets+requestURL.pathname, function(err, html){
    if(err){
      throw err;
    }
    res.writeHeader(200, {"Content-Type": "text/html"});
    res.write(html);
    res.end();
  });
};
