var http = require('./http')
  , io = require('socket.io').listen(http)
  , StyleTime = require('./styletime')

var styletime = StyleTime.create();

styletime.on('newcontent', function(content) {
    io.sockets.emit('newcontent', content);
})

styletime.on('error', function(descr, uno, dos) {
    console.log('ERROR', arguments);
    io.sockets.emit('error', arguments);
})

styletime.on('download', function(file) {
    console.log('downloaded finished!!', file);
})

//styletime.downloadContent('http://sofsis.cl/index.html');

io.sockets.on('connection', function(socket) {
    socket.emit('newcontent', styletime.contents);
})

//Vogue
var exec = require('child_process').exec;
exec('PATH=$PATH:/usr/local/bin; cd web; ../node_modules/vogue/vogue.js', function(err, stdout, stderr) {
    //if (err) throw err;

    console.log('VOGUE: ', stdout);
    console.log('VOGUE ERR: ', stderr);
    console.log('ERR', err);
});


