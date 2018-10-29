exports.time = time;

function time()
{
	var d = new Date();
	var n = d.getTime() / 1000;
	
	return n;
};