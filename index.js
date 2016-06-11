var express = require('express');
var bodyParser = require('body-parser');
var critical = require('critical');
var _ = require("lodash");

var app = express();
var port = 8080;

app.use(bodyParser.text({type: 'text/html'}));
app.use(bodyParser.json({type: 'application/json'}));

app.post('/api/critical', (req, res) => {
  var options = req.body;
  if(req.headers["content-type"] == "text/html")
    options = {html: req.body};

  options = _.chain({})
    .extend(options, req.query)
    .pick(["html", "url"])
    .value();

  critical.generate(_.extend({
    width: 1300,
    height: 900,
    minify: true
  }, options)).then((criticalCss) => {
    res.send(criticalCss);
  });
});

app.listen(port, () => {
  console.log("Listening on port 8080!");
});
