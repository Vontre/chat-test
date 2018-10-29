const services = require('./framework/services');

const chatController = services.get('chatController');
const messageRouter = services.get('messageRouter');

import test from 'ava';

test(function basic(t) {
    t.deepEqual([1, 2], [1, 2]);
});

test(function chatStart(t) {
	chatController.startup();
	
	t.pass();
});

test(function printTime(t) {
	chatController.statsResult({exists: true, time: 123456});
	
	t.pass();
});

test(function popularResult(t) {
	chatController.popularResult({word: "style"});
	
	t.pass();
});

test(function recentMessages(t) {
	chatController.recentMessages({word: "style"});
	
	t.pass();
});

test(function messageReceived(t) {
	chatController.messageReceived({message: {name: "john", message: "Hello world."}});
	
	t.pass();
});

test(function enteredText(t) {
	chatController.enteredText("/popular");
	chatController.enteredText("A message");
	
	t.pass();
});

test(function badMessage(t) {
	messageRouter.routeMessage("junkRoute", null);
	
	t.pass();
});