var services = require('./../../framework/services');

const WebSocket = require('ws');

const messageRouter = services.get('messageRouter'); 

// interface
exports.startup = startup;

// impl
var ws;
var userIdTick = 0;

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
			
			if (data && data.route)
			{
				messageRouter.routeMessage(userId, data.route, data);
			}
		});
		
		//conn.send('something');
	});
}