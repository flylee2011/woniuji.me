webpackJsonp([1],[,function(a,c){},,function(a,c,n){(function(a){function c(){var a=i.find("i"),c=i.find("img");a.hasClass("fa-play-circle")?(a.attr("class","fa fa-pause-circle"),c.addClass("ani-rotate"),s.play()):(a.attr("class","fa fa-play-circle"),c.removeClass("ani-rotate"),s.pause())}n(1);var s=document.getElementById("audio"),i=a("#img-box");i.on("click",function(a){c()});var l=setInterval(function(){var c=s.currentTime;c>7&&a("#lrc-box").css("display","block"),c>32&&(a("#coming").css("display","block"),a("#tips").css("display","none"),clearInterval(l))},1e3)}).call(c,n(0))}],[3]);