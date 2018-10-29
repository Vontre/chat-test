const services = require('./../../framework/services');

const chatController = services.get('chatController');

exports.routeMessage = routeMessage;

const map =
{
		'setName' : chatController.setName,
		'enterMessage': chatController.enterMessage,
		'enterCommand': chatController.enterCommand
};

function routeMessage(userId, route, data)
{
	if (map[route])
	{
		map[route](userId, data);
	}
	else
	{
		console.log("INVALID ROUTE " + route);
	}
}