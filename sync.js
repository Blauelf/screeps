"use strict";
var https = require('https');
var fs = require('fs');

// This function gets uploaded to Screeps as main.js
var main = String(function() {
	"use strict";
	Game.sim = !!Game.rooms.sim;
	if (Game.sim) {
		require('sim/main');
	} else {
		require('master/main');
	}
});

// Request current code from Screeps
var req = https.request({
	hostname: 'screeps.com',
	port: 443,
	path: '/api/user/code',
	auth: process.argv[2],
});
req.end();
req.on('response', function(res) {
	var payload = '';
	res.on('data', function(data) {
		payload += data;
	});
	res.on('end', function() {
		var files = JSON.parse(payload).modules;
		var modules = {
			master: {},
			sim: {},
		};
		for (var file in files) {
			var path = /(.+)\/(.+)/.exec(file);
			if (path && (path[1] in modules)) {
				modules[path[1]][path[2]] = files[file];
			}
		}
		init(modules);
	});
});

// Enter watch loop
function init(modules) {

	// Watch git
	function parseBranch(HEAD) {
		return HEAD === 'ref: refs/heads/master\n' ? 'master' : 'sim';
	}
	var branch = parseBranch(fs.readFileSync('.git/HEAD', 'utf8'));
	fs.watch('.git', function(ev, file) {
		if (file === 'HEAD') {
			var tmp = parseBranch(fs.readFileSync('.git/HEAD', 'utf8'));
			if (tmp !== branch) {
				branch = tmp;
				console.log('Switching to: '+ branch);
				refreshLocalBranch();
			}
		}
	});

	// Read local code from disk
	var seenBranch = {};
	function refreshLocalBranch() {
		if (seenBranch[branch]) {
			return;
		}
		seenBranch[branch] = true;
		modules[branch] = {};
		fs.readdirSync('.').forEach(function(file) {
			if (file !== 'sync.js' && /\.js$/.test(file)) {
				modules[branch][file.replace( /\.js$/, '')] = fs.readFileSync(file, 'utf8');
			}
		});
		schedulePush();
	}
	refreshLocalBranch();

	// Watch for local changes
	var pushTimeout;
	fs.watch('.', function(ev, file) {
		if (file !== 'sync.js' && /\.js$/.test(file)) {
			try {
				modules[branch][file.replace(/\.js$/, '')] = fs.readFileSync(file, 'utf8');
			} catch (err) {
				delete modules[branch][file.replace(/\.js$/, '')];
			}
			schedulePush();
		}
	});

	// Push changes to screeps.com
	function schedulePush() {
		if (pushTimeout) {
			clearTimeout(pushTimeout);
		}
		pushTimeout = setTimeout(function() {
			pushTimeout = undefined;
			var remoteModules = {
				'main': main.substring(main.indexOf('{') + 1, main.lastIndexOf('}')),
			};
			for (var branch in modules) {
				for (var file in modules[branch]) {
					remoteModules[branch+ '/'+ file] = modules[branch][file];
					if (file !== 'main') {
						remoteModules[file] = 'module.exports = Game.sim ? require(\'sim/'+ file+ '\') : require(\'master/'+ file+ '\');';
					}
				}
			}
			var req = https.request({
				hostname: 'screeps.com',
				port: 443,
				path: '/api/user/code',
				method: 'POST',
				auth: process.argv[2],
				headers: {
					'Content-Type': 'application/json; charset=utf-8'
				},
			});
			req.end(JSON.stringify({ modules: remoteModules }));
			req.on('response', function(res) {
				console.log('HTTP Status '+ res.statusCode);
			});
		}, 50);
	}
}