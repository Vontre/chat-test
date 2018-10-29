const services = require('./../../framework/services');

const fs = require('fs');

const serverComm = services.get('serverComm');

// interface
exports.startup = startup;
exports.recentMessages = recentMessages;
exports.messageReceived = messageReceived;

exports.popularResult = popularResult;
exports.statsResult = statsResult;

exports.enteredText = enteredText;


// impl
var profanity = [];

function startup()
{
	profanity = fs.readFileSync('./config/profanity.txt').toString().split("\n");
}

function recentMessages(data)
{
	if (data.messageList)
	{
		for (var i = 0; i < data.messageList.length; i++)
		{
			displayMessage(data.messageList[i]);
		}
	}
}

function messageReceived(data)
{
	displayMessage(data.message);
}

function popularResult(data)
{
	console.log("The most popular word is: " + data.word + ".");
}

function statsResult(data)
{
	if (data.exists)
	{
		console.log("User online for " + data.time);
	}
	else
	{
		console.log("User not found.");
	}
}

function profanityFilter(text)
{
	var words = text.split(' ');
	
	for (var i in words)
	{
		var word = words[i];
		
		if (profanity.indexOf(word) != -1)
		{
			var len = word.length;
			
			// maybe replace this with a const table for performance
			var replace = '';
			for (var a = 0; a < len; a++)
			{
				replace += '*';
			}
			
			words[i] = replace;
		}
	}
	
	return words.join(' ');
}

function displayMessage(data)
{
	console.log(data.name + " says:     " + profanityFilter(data.message));
}

function enteredText(text)
{
	if (text[0] == '/')
	{
		var command = text.substring(1, text.length);
		
		sendCommand(command);
	}
	else
	{
		sendMessage(text);
	}
}

function sendMessage(message)
{
	serverComm.send("enterMessage", {message: message});
}

function sendCommand(command)
{
	serverComm.send("enterCommand", {command: command});
}