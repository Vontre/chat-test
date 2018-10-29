const services = require('./../../framework/services');

const WebSocket = require('ws');

const messageRouter = services.get('messageRouter'); 

// interface
exports.startup = startup;
exports.send = send;
exports.sendToAll = sendToAll;

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
		
		conn.on('close', function fn(text)
		{
			delete sendFns[userId];
			
			messageRouter.routeMessage(userId, "___connection_closed", null);
		});
		
		function rawSend(text)
		{
			conn.send(text, function ack(error)
			{
				  // If error is not defined, the send has been completed, otherwise the error
				  // object will indicate what failed.
				
				if (error)
				{
					console.log("Send error");
					console.log(error);
				}
			});
		}
		
		sendFns[userId] = rawSend;
	});
}

function send(userId, route, data)
{
	if (sendFns[userId])
	{
		var text = formatMessage(route, data);
		
		sendFns[userId](text);
	}
}

function sendToAll(route, data)
{
	var text = formatMessage(route, data);
	
	for (var userId in sendFns)
	{
		sendFns[userId](text);
	}
}

function formatMessage(route, data)
{
	data.__route = route;
	
	return JSON.stringify(data);
}