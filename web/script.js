$ = function(id) {
     return document.getElementById(id);
}

function load(file) {
    $('content').src = file;
}

var sel;

function init() {

    sel = $('selector');

    sel.onchange = function() {
        var opt = this.options[this.selectedIndex];
        if (opt.value=='false') return;

        console.log('asd', opt.value);
    }
}

var socket = io.connect();
socket.on('newcontent', function(list) {

    var oldSelection = sel.options[sel.selectedIndex]&&sel.options[sel.selectedIndex].value;
    sel.options.length = 0;
    sel.options[0] = new Option("Select something", false);
    list.forEach(function(i) {
        var o = new Option(i, i);
        if (oldSelection==i)
            o.selected = true;
        sel.options[sel.options.length] = o
    })

})

