var services = require('./../../framework/services');

// interface
exports.recentMessages = recentMessages;
exports.messageReceived = messageReceived;

// impl
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

function displayMessage(data)
{
	console.log(data.name + " says:     " + data.message);
}