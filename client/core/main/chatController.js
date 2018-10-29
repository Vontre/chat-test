const services = require('./../../framework/services');

const fs = require('fs');

// interface
exports.startup = startup;
exports.recentMessages = recentMessages;
exports.messageReceived = messageReceived;


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