/**
 * @fileoverview 入口
 * @author liyifei<yifei@zoocer.com>
 * @date 2017/06
 */

require('../../css/page/index.css');

var audioObj = document.getElementById('audio');
audioObj.play();

var intervalObj = setInterval(function() {
    var currentTime = audioObj.currentTime;
    if (currentTime > 32) {
        $('#coming').css('display', 'block');
        clearInterval(intervalObj);
    }
}, 1000);
