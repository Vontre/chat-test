var services = require('./../../framework/services');

// interface
exports.setName = setName;
exports.enterMessage = enterMessage;


// impl
var usernames = {};
var messages = [];


function setName(userId, data)
{
	usernames[userId] = data.name;
	
	console.log(usernames);
}

function enterMessage(userId, data)
{
	var message = {userId: userId, message: data.message};
	
	messages.push(message);
	
	console.log(messages);
}