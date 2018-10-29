var services = require('./../../framework/services');

var chatHandler = services.get('chatHandler');

exports.routeMessage = routeMessage;

const map =
{
	"testroute": chatHandler.test
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