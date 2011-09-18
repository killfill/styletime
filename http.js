var express = require('express')


var app = module.exports = express.createServer();

app.configure(function() {
    app.use(express.static(__dirname+'/web'))
    app.use(express.errorHandler({dumpException: true, showStack: true}))
})

app.listen(3000);
console.log('Ready @3000')