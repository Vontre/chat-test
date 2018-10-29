var services = require('./../../framework/services');

const WebSocket = require('ws');

const messageRouter = services.get('messageRouter');

var ws;

// interface
exports.connect = connect;
exports.send = send;

// impl
function connect(callback)
{
	ws = new WebSocket('ws://localhost:8080');
	
	ws.on('open', function open()
	{
		callback();
	});
	
	ws.on('message', incoming);
}

function incoming(text)
{
	console.log("Received data");
	console.log(text);
	
	var data;
	
	try
	{
		data = JSON.parse(text);
	} catch(err) {
	}
	
	if (data && data.__route)
	{
		messageRouter.routeMessage(data.__route, data);
	}
}

function send(route, data)
{
	console.log("Send route " + route);
	data.__route = route;
	
	var text = JSON.stringify(data);
	
	ws.send(text);
}