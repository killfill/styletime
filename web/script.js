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
        console.log(opt.value);
    }
}

var socket = io.connect();
socket.on('newcontent', function(list) {

    sel.options.length = 0;
    list.forEach(function(i) {
        sel.options[sel.options.length] = new Option(i, i);
    })
    //selectedIndex

})

