var StyleTime = require('./styletime')
  , express = require('express')


var styletime = StyleTime.create();

styletime.on('newcontent', function(content) {
    console.log('El contenido cambio', content);
})

styletime.on('error', function(descr, uno, dos) {
    console.log(arguments);
})

styletime.on('download', function(file) {
    console.log('downloaded finished!!', file);
})


styletime.downloadContent('http://sofsis.cl/index.html');

var app = express.createServer();


app.configure(function() {
    app.use(express.static(__dirname+'/web'))
    app.use(express.errorHandler({dumpException: true, showStack: true}))
})


app.listen(3000);
console.log('Ready @3000')