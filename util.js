var http	= require('http')
  , https	= require('https')
  , fs		= require('fs')
  , logs	= "";

process.on('uncaughtException', function(err) {
  exports.log('Uncaught Exception: ' + err);
});

setInterval(function(){
	exports.save();
}, 3600000);

exports.save = function(data, callback) {
	try {
		var stream = fs.createWriteStream("db.json", {
			flags: 'w'
		});
		stream.end(JSON.stringify(data));
		stream.on('finish', function() {
			exports.log("Saved database to file.");
			if (typeof callback === 'function') callback();
		});
	} catch(err) {
		exports.log("Error whilst saving database to file: " + err);
	}
}

exports.getReq = function(url, json, func, secure) {
	protocol = secure ? https : http;
	protocol.get(url, function(res) {
		var body = '';
		res.on('data', function(chunk) {
			body += chunk;
		});
		res.on('end', function() {
			var resp = body;
			if (json == true) {
				try {
					var resp = JSON.parse(body);
				} catch (err) {
					resp = null;
				}
			}
			func(resp);
		});
	}).on('error', function(e) {
		exports.log("Got error: " + e);
	});
}

exports.log = function(msg) {
	time = new Date().toISOString().replace("T", " ").slice(0, 16);
	console.log(time + " " + msg);
	logs += time + " " + msg + "<br />";
}

exports.getLog = function() {
	return logs;
}