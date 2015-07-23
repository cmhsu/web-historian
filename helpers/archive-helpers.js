var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var http = require('http-request');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

//  var paths = {
//   siteAssets: path.join(__dirname, '../web/public'),
//   archivedSites: path.join(__dirname, '../archives/sites'),
//   list: path.join(__dirname, '../archives/sites.txt'),
//   index: path.join(__dirname, '../web/public/index.html')
// };

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt'),
  index: path.join(__dirname, '../web/public/index.html')
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj){
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!


var readListOfUrls = function(callback){
  var messages;
  fs.readFile(exports.paths.list, 'utf8', function(err, data) {
    if (err) {
      throw error;
    }
    messages = data.split('\n').map(function(urlString) {
      if (urlString !== '') {
        return urlString;
      }
    });  
  callback(messages);

  });
};

exports.isUrlInList = function(url, callback){
  readListOfUrls(function(messages){
    var check = false;
    for(var i = 0; i < messages.length; i ++){
      if(messages[i]===url) {
        callback(true);
        check = true;
      }
    }
    if(!check)callback(false);
  });
};

exports.addUrlToList = function(url, callback){
  fs.appendFile(exports.paths.list, url+ '\n', 'utf8', function(err) {
    if (err) {
      throw err;
    }
    callback();
  })
};  

exports.isUrlArchived = function(url, callback){
  fs.readdir(exports.paths.archivedSites, function(err, files){
    var check = false;
    for(var i = 0 ; i < files.length ; i++){
      if(files[i]===url) check = true; 
    }
    callback(check);
  });
};

exports.downloadUrls = function(urlArray){
  var newPath;
  for(var i = 0 ; i < urlArray.length ; i ++){

    newPath = exports.paths.archivedSites+'/'+urlArray[i];
    exports.isUrlArchived(urlArray[i], function(result){
      if(!result && newPath){
        fs.writeFile(newPath, "", function(err){
          if(err) throw err;
        });
      }
    });
  }

  http.get({url:'www.google.com', 
            progress: function(current, total){
              console.log(current, total);
            }
      }, newPath, function(err,res){
        if(err) throw err;
      console.log(res);

      // fs.writeFileSync(newPath, res.body);
  });
};

exports.readListOfUrls = readListOfUrls;