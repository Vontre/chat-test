var map = {};

map['startup'] = './../core/startup.js';

map['serverComm'] = './../core/main/serverComm.js';
map['messageRouter'] = './../core/main/messageRouter.js';
map['ui'] = './../core/main/ui.js';
map['chatController'] = './../core/main/chatController.js';

exports.get = get;

function get(name)
{
	if (!map[name])
		console.log("Service not found:" + name);
	
	return require(map[name]);
};