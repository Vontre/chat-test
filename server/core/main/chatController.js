var services = require('./../../framework/services');

const tcp = services.get('tcp');

// interface
exports.setName = setName;
exports.enterMessage = enterMessage;


// impl
const recentMessageCount = 50;

var usernames = {};
var messages = [];

function setName(userId, data)
{
	usernames[userId] = data.name;
	
	sendRecentMessages(userId);
}

function enterMessage(userId, data)
{
	if (!usernames[userId])
	{
		console.log("ERROR tried to enter message with no name.");
		return;
	}
	
	var message = {userId: userId, name: usernames[userId], message: data.message};
	
	messages.push(message);
	
	tcp.sendToAll("messageReceived", {message: message});
}

function sendRecentMessages(userId)
{
	var data = {messageList: []};
	
	var start = messages.length - recentMessageCount;
	if (start < 0)
	{
		start = 0;
	}
	
	const k = messages.length;
	for (var i = start; i < k; i++)
	{
		data.messageList.push(messages[i]);
	}
	
	tcp.send(userId, "recentMessages", data);
}