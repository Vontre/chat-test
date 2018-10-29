var services = require('./../../framework/services');

const WebSocket = require('ws');

const messageRouter = services.get('messageRouter'); 

// interface
exports.startup = startup;
exports.send = send;

// impl
var ws;
var userIdTick = 0;

var sendFns = {};

function startup()
{
	ws = new WebSocket.Server({ port: 8080 });
	
	ws.on('connection', function connection(conn)
	{
		userIdTick++;
		
		var userId = userIdTick;
		
		conn.on('message', function incoming(text)
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
				messageRouter.routeMessage(userId, data.__route, data);
			}
		});
		
		function rawSend(text)
		{
			conn.send(text);
		}
		
		sendFns[userId] = rawSend;
	});
}

function send(userId, route, data)
{
	data.__route = route;
	
	var text = JSON.stringify(data);
	
	sendFns[userId](text);
}