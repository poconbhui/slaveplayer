(function() {

function send_command(command) {
    $.ajax( {
        type: "POST",
        url: "/command",
        data: {command: command}
    });
}


// Helpers to show a play or pause button as appropriate
function show_play() {
    $('#play')
        .removeClass('paused')
        .addClass('playing')
        .children("i")
            .removeClass('icon-pause')
            .addClass('icon-play');
}
function show_pause() {
    $('#play')
        .removeClass('playing')
        .addClass('paused')
        .children("i")
            .removeClass('icon-play')
            .addClass('icon-pause');
}
function toggle_show_play() {
    if ($('#play').hasClass('playing')) {
        show_pause();
    } else {
        show_play();
    }
}


$(document).ready( function() {
    var timeout;
    // Play and stop buttons
    $("#play").click(function() {
        send_command('pause');
        toggle_show_play();
    });

    $("#stop").click(function() {
        send_command('stop');
    });


    // Fast forward and rewind
    $("#forward").mousedown(function() {
        timeout = setInterval(function() {
            send_command('seek +10');
        }, 100);
    });

    $("#backward").mousedown(function() {
        timeout = setInterval(function() {
            send_command('seek -10');
        }, 100);
    });

    $(document).mouseup(function() {
        clearInterval(timeout);
        return false;
    });


    // Playable videos
    $(".playme").click(function() {  
        send_command('loadfile "'+$(this).text()+'"');
        show_pause();
    });
});

})();
