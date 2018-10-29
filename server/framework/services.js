var map = {};

map['startup'] = './../core/startup.js';

map['tcp'] = './../core/main/tcp.js';

exports.get = function(name)
{
	if (!map[name])
		console.log("Service not found:" + name);
	
	return require(map[name]);
};