const services = require('./../framework/services');

const ui = services.get('ui');
const chatController = services.get('chatController');

chatController.startup();
ui.start();