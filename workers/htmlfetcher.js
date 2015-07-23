// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.
var archive = require('../helpers/archive-helpers');

exports.update = function(callback){
	archive.readListOfUrls(function(results){
		console.log(results);
		archive.downloadUrls(results);
	});
};