var http = require('./http')
  , io = require('socket.io').listen(http)
  , StyleTime = require('./styletime')


var styletime = StyleTime.create();

styletime.on('newcontent', function(content) {
    console.log('El contenido cambio', content);
    io.sockets.emit('newcontent', content);
})

styletime.on('error', function(descr, uno, dos) {
    console.log(arguments);
    io.sockets.emit('error', arguments);
})

styletime.on('download', function(file) {
    console.log('downloaded finished!!', file);
})

//styletime.downloadContent('http://sofsis.cl/index.html');


io.sockets.on('connection', function(socket) {
    console.log('connection!!');
    socket.emit('newcontent', styletime.contents);
})


