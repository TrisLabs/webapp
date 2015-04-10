
/*
 * GET home page.
 */

var circuitSchema = require('../schemas/circuit');
var dir = require('node-dir');
module.exports = function () {
	var order =require('../circuit');
	var functions = {};

	functions.main = function(req, res) {
		if (isLoggedIn(req)) {
			res.redirect('/login');
		} else {
			getAvailableComponentList('./public/Components',function(list){
					res.render('virtualPage', {
						title: 'virtualPage',
						availableComponentList: list
						});
			});
		}
	};

	
	functions.login = function(req, res) {
		if (isLoggedIn(req)) {
			res.render('login', {title: 'Log in'});
		} else {
			res.redirect('/');
		}
	};

	function isLoggedIn(req){
		if (req.session.passport.user === undefined) {
			//change to true when require login
			return true;
		}else{
			return false;
		}
	};

	function timeStamp() {
		// Create a date object with the current time
		var now = new Date();
		 
		// Create an array with the current month, day and time
		var date = [ now.getMonth() + 1, now.getDate(), now.getFullYear() ];
		 
		// Create an array with the current hour, minute and second
		var time = [ now.getHours(), now.getMinutes(), now.getSeconds() ];
		 
		date[1] = (date[1]<10)? '0'+date[1] : date[1];

		date[0] = (date[0]<10)? '0'+date[0] : date[0];

		// Convert hour from military time
		time[0] = ( time[0] < 12 ) ? time[0] : time[0] - 12;
		 
		// If hour is 0, set it to 12
		time[0] = time[0] || 12;
		 
		// If seconds and minutes are less than 10, add a zero
		for ( var i = 1; i < 3; i++ ) {
			if ( time[i] < 10 ) {
				time[i] = "0" + time[i];
			}
		}
			 
			// Return the formatted string
		return "TRIS"+date.join("") + time.join("");
	};

	function getAvailableComponentList(dirname, callback){
		dir.paths(dirname, function(err, paths) {
		    if (err) throw err;
		    var fileNames = {};
		    for (var i = 0 ; i < paths.files.length ; i++ ){
		    	paths.files[i]=paths.files[i].substring((paths.files[i].indexOf('/')+1));
		    	var breakPath = paths.files[i].split('/');
		    	var fileName = breakPath[breakPath.length-1].split('.')[0];
		    	fileNames[paths.files[i]]=fileName;
		    }
		    //console.log('files:\n',paths.files);
		    //console.log('subdirs:\n', paths.dirs);
		    callback(fileNames);
		});
	}
	return functions;
};
