var fs = require('fs')
  , path = require('path')
  , url = require('url')
  , http = require('http')
  , mkdirp = require('mkdirp')
  , watch = require('watch')
  , events = require('events')
  , util = require('util')


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

    //Build the list the first time
    this.contents = fs.readdirSync(this.contentDir);

    var me = this;
    //Build watching the content dir.
    //Ok this has bugs
    watch.createMonitor(this.contentDir, function(monitor) {
        monitor.on("created", function(f, fstat) {
            var name = f.split(me.contentDir+'/')[1];
            if (me.contents.indexOf(name)>-1) return;
            me.contents.push(name);
            me.emit('newcontent', me.contents);
        })
        monitor.on('removed', function(f, fstat) {
            var name = f.split(me.contentDir+'/')[1];
            var idx = me.contents.indexOf(name);
            if (idx<0) return;
            delete me.contents[idx];
            me.emit('newcontent', me.contents);
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