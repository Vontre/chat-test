const services = require('./framework/services');

const chatController = services.get('chatController');
const messageRouter = services.get('messageRouter');
const util = services.get('util');

import test from 'ava';

test(function basic(t) {
    t.deepEqual([1, 2], [1, 2]);
});

test(function time(t) {
    util.time();
    
    t.pass();
});

test(function setName(t) {
    chatController.setName(999, {name: "john"});
    
    t.pass();
});

test(function enterMessage(t) {
    chatController.enterMessage(999, {junkdata: true});
    chatController.enterMessage(999, {message: "I am a tree."});
    
    t.pass();
});

test(function enterCommand(t) {
    chatController.enterCommand(999, {junkcommand: true});
    chatController.enterCommand(999, {command: "popular"});
    chatController.enterCommand(999, {command: "stats matt"});
    chatController.enterCommand(999, {command: "stats john"});
    chatController.enterCommand(999, {command: "junkcommand"});
    
    t.pass();
});

test(function connectionClosed(t) {
    chatController.connectionClosed(999, null);
    
    t.pass();
});

test(function flood(t) {
	chatController.setName(999, {name: "john"});
	
    for (var i = 0; i < 10000; i++) {
    	chatController.enterMessage(999, {message: "I am a flood."});
    }
    
    t.pass();
});