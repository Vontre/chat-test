const services = require('./../../framework/services');

const tcp = services.get('tcp');
const util = services.get('util');

// interface
exports.setName = setName;
exports.enterMessage = enterMessage;
exports.enterCommand = enterCommand;
exports.connectionClosed = connectionClosed;


// impl
const recentMessageCount = 50;
const popularTime = 30;

var users = {};
var userNameIndex = {};
var messages = [];

function setName(userId, data)
{
	if (data.name)
	{
		users[userId] = {name: data.name, time: util.time()};
		
		userNameIndex[data.name.toLowerCase()] = userId;
		
		sendRecentMessages(userId);
	}
}

function connectionClosed(userId, unused)
{
	if (users[userId])
	{
		var user = users[userId];
		
		delete userNameIndex[user.name.toLowerCase()];
		delete users[userId];
	}
}

function enterMessage(userId, data)
{
	if (!users[userId])
	{
		console.log("ERROR tried to enter message with no name.");
		return;
	}
	
	var message = {userId: userId, name: users[userId].name, message: data.message, time: util.time()};
	
	messages.push(message);
	
	prune();
	
	tcp.sendToAll("messageReceived", {message: message});
}

function prune()
{
	if (messages.length > recentMessageCount)
	{
		messages.splice(0, 1);
	}
}

function enterCommand(userId, data)
{
	if (data.command)
	{
		if (data.command == 'popular')
		{
			var word = getPopularWord();
			
			tcp.send(userId, "popularResult", {word: word});
		}
		else if (data.command.indexOf('stats') == 0)
		{
			statsCommand(userId, data.command);
		}
	}
}

function statsCommand(userId, command)
{
	var split = command.split(' ');
	
	var username = split[1];
	if (username)
	{
		username = username.toLowerCase();
	}
	
	var result = {};
	
	if (!username || !userNameIndex[username])
	{
		result.exists = false;
	}
	else
	{
		result.exists = true;
		
		var time = util.time() - users[userNameIndex[username]].time;
		
		result.time = time;
	}
	
	tcp.send(userId, "statsResult", result);
}

function getPopularWord()
{
	var minTime = util.time() - popularTime;
	
	var counts = {};
	var bestCount = 0;
	var bestWord = null;
	
	for (var i in messages)
	{
		var message = messages[i];
		
		if (message.time > minTime)
		{
			var split = message.message.split(' ');
			
			for (var a in split)
			{
				var word = split[a];
				
				if (counts[word])
				{
					counts[word]++;
				}
				else
				{
					counts[word] = 1;
				}
				
				if (counts[word] >= bestCount)
				{
					bestCount = counts[word];
					bestWord = word;
				}
			}
		}
	}
	
	return bestWord;
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