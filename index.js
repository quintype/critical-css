var express = require('express');
var bodyParser = require('body-parser');
var critical = require('critical');
var app = express();
var port = 8080;

app.use(bodyParser.text({type: 'text/html'}));

app.post('/api/critical', (req, res) => {
	console.log(req.body);
	critical.generate({
   	src: req.body,
    width: 1300,
    height: 900,
    minify: true
	}).then((criticalCss) => {
		res.send(criticalCss);
	});
});

app.listen(port, () => {
	console.log("Listening on port 8080!");
});
