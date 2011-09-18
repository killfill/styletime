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

    var _uri = url.parse(uri);
    var endpoint = _uri.href;
    
    if (!endpoint) return false;

    var dir = path.join(
          __dirname
        , _uri.host
        , path.dirname(_uri.pathname).substr(1)
    );

    mkdirp(dir, 0775, function() {

        var file = path.basename(_uri.pathname);
        var opts = {
              host: _uri.host
            , port: _uri.port || 80
            , path: _uri.pathname
            , method: 'GET'
        };
        console.log(opts);
        http.request(opts, function(res) {

        });

    })

}

var styletime = new StyleTime();

styletime.on('newcontent', function(content) {
    console.log('El contenido cambio', content);
})

/*
styletime.getContents(function(err, list) {
    console.log(list);
})*/

//styletime.downloadContent('http://www.host.cl:123/archivo.html');