var fs = require('fs')
  , path = require('path')
  , url = require('url')
  , http = require('http')
  , mkdirp = require('mkdirp')
  , watch = require('watch')
  , events = require('events')
  , util = require('util')


//TODO: Dont use an external process!!...
var exec = require('child_process').exec;
function findFiles(dir, cb) {
    exec("/usr/bin/find " + dir + ' -type file', function(err, stdout, stderr) {
        if (err) throw err;

        var arr = []
        stdout.split('\n').forEach(function(item) {
            var x = item.split(dir+'/')[1];
            if (x) arr.push(x);
        })
        cb && cb(arr);

    })
}


function StyleTime(opts) {
    this.contents = []
    this.init(opts)
    events.EventEmitter.call(this)
}
util.inherits(StyleTime, events.EventEmitter);


StyleTime.prototype.init = function(opts) {
    this.opts = opts || {};
    this.contentDir = this.opts.contentDir || path.join(__dirname, 'content');

    if (!path.existsSync(this.contentDir))
        fs.mkdirSync(this.contentDir, 0775);

    var me = this;

    //Build the list the first time
    findFiles(me.contentDir, function(arr) {
        me.contents = arr;
        me.emit('newcontent', me.contents);
    });

    //Build watching the content dir.
    //Ok this has bugs
    watch.createMonitor(this.contentDir, function(monitor) {
        monitor.on("created", function(f, fstat) {
            /*var name = f.split(me.contentDir+'/')[1];
            if (me.contents.indexOf(name)>-1) return;
            me.contents.push(name);
            */
            findFiles(me.contentDir, function(arr) {
                me.contents = arr;
                me.emit('newcontent', me.contents);
            });
        })
        monitor.on('removed', function(f, fstat) {
            findFiles(me.contentDir, function(arr) {
                me.contents = arr;
                me.emit('newcontent', me.contents);
            });
        })
    })
}


StyleTime.prototype.downloadContent = function(uri) {

    var me = this;

    var _uri = url.parse(uri);
    var endpoint = _uri.href;

    if (!endpoint) return false;

    var dir = path.join(
          this.contentDir
        , _uri.host
        , path.dirname(_uri.pathname).substr(1)
    );

    mkdirp(dir, 0775, function() {


        var opts = {
              host: _uri.host
            , port: _uri.port || 80
            , path: _uri.pathname
            , method: 'GET'
        };

        http.request(opts, function(res) {

            if (res.statusCode != 200)
                return me.emit('error', 'downloading file', res.statusCode, res.readers);

            var file = path.basename(_uri.pathname);
            var stream = fs.createWriteStream(path.join(dir, file));
            util.pump(res, stream);

            res.on('end', function() {
                me.emit('download', path.join(_uri.host, file), opts);
            })

        }).end();

    })
}

exports._class = StyleTime;
exports.create = function(opts) {
    return new StyleTime(opts);
}