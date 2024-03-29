var express = require('express');
var bodyParser = require('body-parser');
var critical = require('critical');
var _ = require("lodash");
var cluster = require("cluster");

var app = express();
var port = process.env.PORT || 8080;

app.use(bodyParser.text({type: 'text/html'}));
app.use(bodyParser.json({type: 'application/json'}));

app.get("/", (req, res) => {
  res.end("Hello");
});

app.post('/api/critical', (req, res) => {
  var options = req.body;
  if(req.headers["content-type"] == "text/html")
    options = {html: req.body};

  options = _.chain({})
    .extend(options, req.query)
    .pick(["html", "src"])
    .value();

  critical.generate(_.extend({
    dimensions: [{
      height: 568,
      width: 320
    }, {
      height: 1024,
      width: 768
    }, {
      height: 900,
      width: 1440
    }],
    minify: true
  }, options)).then((criticalCss) => {
    res.header("Content-Type", "text/css")
    res.end(criticalCss);
  }).catch((error) => {
    res.status(500);
    res.header("Content-Type", "application/json");
    res.end('{"error": {"message": "Something Went Wrong"}}');
  });
});

if (cluster.isMaster) {
  const numCPUs = require('os').cpus().length;

  for(var i = 0; i < numCPUs; i++)
    cluster.fork();

  cluster.on('exit', (worker, code, signal) => {
    cluster.fork();
  });
} else {
  app.listen(port, () => {
    console.log("Listening on port 8080!");
  });
}
