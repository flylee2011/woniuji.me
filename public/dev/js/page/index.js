/**
 * @fileoverview 入口
 * @author liyifei<yifei@zoocer.com>
 * @date 2017/06
 */

require('../../css/page/index.css');

var audioObj = document.getElementById('audio');
var imgBox = $('#img-box');

function onClickSong() {
    var elIcon = imgBox.find('i');
    var elImg = imgBox.find('img');
    if (elIcon.hasClass('fa-play-circle')) {
        elIcon.attr('class', 'fa fa-pause-circle');
        elImg.addClass('ani-rotate');
        $('#lrc-box').css('display', 'block');
        audioObj.play();
    } else {
        elIcon.attr('class', 'fa fa-play-circle');
        elImg.removeClass('ani-rotate');
        audioObj.pause();
    }
}

// function initPlay() {
//     onClickSong();
// }

imgBox.on('click', function(e) {
    onClickSong();
});

var intervalObj = setInterval(function() {
    var currentTime = audioObj.currentTime;
    if (currentTime > 32) {
        $('#coming').css('display', 'block');
        $('#tips').css('display', 'none');
        clearInterval(intervalObj);
    }
}, 1000);

// initPlay();
