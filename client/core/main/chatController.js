var services = require('./../../framework/services');

// interface
exports.recentMessages = recentMessages;

// impl
function recentMessages(data)
{
	console.log(data.messageList);
}