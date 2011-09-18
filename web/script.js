$ = function(id) {
     return document.getElementById(id);
}

function load(file) {
    $('content').src = file;
}