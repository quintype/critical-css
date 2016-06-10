var express = require('express');
var bodyParser = require('body-parser');
var critical = require('critical');
var app = express();
var port = 8080;

app.use(bodyParser.text({type: 'text/html'}));

app.post('/api/critical', (req, res) => {
	var options = JSON.parse(req.body);
	console.log("the options are", options);
	if(options.url) {
			critical.generate({
	   	src: options['url'],
	    width: 1300,
	    height: 900,
	    minify: true
		}).then((criticalCss) => {
			res.send(criticalCss);
		});
	}
	else if (options.html) {
	critical.generate({
	   	html: options['html'],
	    width: 1300,
	    height: 900,
	    minify: true
		}).then((criticalCss) => {
			res.send(criticalCss);
		});
	}
});

app.listen(port, () => {
	console.log("Listening on port 8080!");
});
