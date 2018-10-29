var map = {};

map['startup'] = './../core/startup.js';
map['util'] = './../framework/util.js';

map['tcp'] = './../core/main/tcp.js';
map['messageRouter'] = './../core/main/messageRouter.js';
map['chatController'] = './../core/main/chatController.js';

exports.get = get;

function get(name)
{
	if (!map[name])
		console.log("Service not found:" + name);
	
	return require(map[name]);
};