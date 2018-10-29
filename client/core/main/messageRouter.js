var services = require('./../../framework/services');

var chatController = services.get('chatController');

// interface
exports.routeMessage = routeMessage;

// impl
const map =
{
	"recentMessages": chatController.recentMessages
};

function routeMessage(route, data)
{
	if (map[route])
	{
		map[route](data);
	}
	else
	{
		console.log("INVALID ROUTE " + route);
	}
}