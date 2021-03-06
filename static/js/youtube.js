 /////// YOUTUBE API HERE //////
let incr = 1;

let tag = document.createElement('script');
tag.src = "//www.youtube.com/player_api";
let firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

let player;
function onYouTubeIframeAPIReady() {
    // create the global player from the specific iframe (#video)
    player = new YT.Player('video', {
        'height': '315',
        'width': '560',
        'videoId': 'MjLsQNBBBd4',
        playerVars: { 'autoplay': 1, 'controls': 0 },
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerReady(event) {
    event.target.playVideo();

    window.setInterval(function () {
    document.getElementById('myRange').value =
        parseInt(document.getElementById('myRange').value) + incr;
    }, 100);

  // bind events
    document.getElementById('myRange').max = duration()*10;
    let playButton = document.getElementById("play-button");
    playButton.addEventListener("click", function() {
    player.playVideo();
  });
}

function onPlayerStateChange(event) {
    let state = event.target.getPlayerState();

    if(state === 3)
        incr = 0;
    else if(state === 2)
        incr = 0;
    else
        incr = 1;
}

function duration() {
    return player.getDuration();
    }
    /////// SOCKET HERE ///////

let href_array = window.location.href.split('/');
let room_number = href_array[href_array.length-1];
let videoSocket = new WebSocket('ws://' + window.location.host + '/ws/video/'
            +room_number+'/');



// send message when joining a room so roommate will send
// back you a seconds of video


let playButton  = document.getElementById("play-button");
let pauseButton = document.getElementById("pause-button");
let synchroButton = document.getElementById("rewind-button");
let slider = document.getElementById('myRange');

videoSocket.onopen = function(e){
        videoSocket.send(JSON.stringify({
        'pause':true,
        'seconds': -2
    }));
};

videoSocket.onmessage = function (e) {
    let data = JSON.parse(e.data);
    let pause = data['pause'];
    let seconds = data['seconds'];

    if(pause && seconds === -1 )
        player.pauseVideo();

    else if(!pause && seconds === -1)
        player.playVideo();

    else if(seconds >= 0){
        player.seekTo(parseFloat(seconds));
    }
    else if(seconds === -2){
        let scope = angular.element(document.querySelectorAll("#controller")).scope();
            scope.$apply(function () {
            scope.init();
        });
        console.log('dwojeczka');
    }
};

videoSocket.onclose =
    function (e) {
    videoSocket.send(JSON.stringify({
        'pause': true,
        'seconds': -2
    }));
};

pauseButton.addEventListener("click", function() {
    incr = 0;
    videoSocket.send(JSON.stringify({
        'pause': true,
        'seconds': -1
    }));
});

playButton.addEventListener("click", function () {
    incr = 1;
    videoSocket.send(JSON.stringify({
        'pause': false,
        'seconds': -1
    }));
});

synchroButton.addEventListener("click", function () {
   videoSocket.send(JSON.stringify({
       'pause': true,
       'seconds': player.getCurrentTime().toFixed(2)
   }));
});

slider.addEventListener("click", function () {
   videoSocket.send(JSON.stringify({
       'pause': true,
       'seconds': slider.value/10
   }));
});


 /////// DOCUMENT RESPONSES ///////


document.getElementById("url-submit").addEventListener(
    "click", function(){
        let url = document.getElementById("url-input").value;
        let videoId = url.split('=')[1];

        player.loadVideoById(videoId, 0, "large");

        let slider = document.getElementById("myRange");
        incr = 0;
        slider.max = duration() * 10;
        slider.value = 0;
        incr = 1;
    }
);

document.getElementById("share").value= window.location.href + '/join';


function copy() {
    let url = document.getElementById("share");
    url.select();
    document.execCommand("copy");

    $.notify("URL copied", {
        allow_dismiss: true,
        placement: {
            from: 'bottom',
            align: 'left'
        }
    });
}

