var services = require('./../../framework/services');

var serverComm = services.get('serverComm');

exports.start = start;

const inquirer = require('inquirer');

const run = async () => {
	const { name } = await askName();
	
	serverComm.send("setName", {name: name});
	
	while (true)
	{
		const answers = await askChat();
		const { message } = answers;
		
		serverComm.send("enterMessage", {message: message});
	}
};

function askChat()
{
  const questions = [
    {
      name: "message",
      type: "input",
      message: "Enter chat message:"
    }
  ];
  return inquirer.prompt(questions);
};

function askName()
{
  const questions = [
    {
      name: "name",
      type: "input",
      message: "Enter your name:"
    }
  ];
  return inquirer.prompt(questions);
};

function start()
{
	serverComm.connect(function()
	{
		console.log("The callback");
		run();
	});
}