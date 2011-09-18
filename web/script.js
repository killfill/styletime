$ = function(id) {
     return document.getElementById(id);
}

function load(file) {
    content.src = file;
}

var sel;
var content;

function init() {

    sel = $('selector');
    content = $('content');

    sel.onchange = function() {

        var opt = this.options[this.selectedIndex];
        if (opt.value=='false') return;

        selectionChanged(opt.value);
    }

    content.onload = function() {
        var s = document.createElement("link");
        s.href = content.src + '.css';
        s.rel = "stylesheet";
        content.contentWindow.document.body.appendChild(s);

        var j = document.createElement("script");
        j.src = "http://localhost:8001/vogue-client.js";
        j.type = "text/javascript";
        content.contentWindow.document.body.appendChild(j);

    };
}

function selectionChanged(value) {
    load(value);
}

var socket = io.connect();
socket.on('newcontent', function(list) {

    var oldSelection = sel.options[sel.selectedIndex]&&sel.options[sel.selectedIndex].value;
    
    sel.options.length = 0;
    sel.options[0] = new Option("Select something", false);
    list.forEach(function(i) {
        var desc = i.substr(i.indexOf('/')+1);
        var o = new Option(desc, i);
        if (oldSelection==i)
            o.selected = true;
        sel.options[sel.options.length] = o
    })

})

