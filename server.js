var express = require('express');
var path = require('path');
var compress = require('compression');
var app = express();

app.use(compress());

app.use(express.static(__dirname + '/static'));

app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, 'static/index.html'));
});

app.listen(process.env.PORT || 8080, function (err) {
    if (err) {
        console.error(err);
    }
    console.log('xword-frontend server started at port: ' + (process.env.PORT || 8080));
});