const services = require('./../../framework/services');

const tcp = services.get('tcp');
const util = services.get('util');

// interface
exports.setName = setName;
exports.enterMessage = enterMessage;
exports.enterCommand = enterCommand;


// impl
const recentMessageCount = 50;
const popularTime = 30;

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
	
	var message = {userId: userId, name: usernames[userId], message: data.message, time: util.time()};
	
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
	if (data.command == 'popular')
	{
		var word = getPopularWord();
		
		tcp.send(userId, "popularResult", {word: word});
	}
	else
	{
	}
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