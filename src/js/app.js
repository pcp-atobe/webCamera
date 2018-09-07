$(function() {

  var contentInfo = getWindowMovieInfo();
  var video = document.getElementById("video");
  var media = navigator.mediaDevices.getUserMedia({
      video: true,//ビデオを取得する
      audio: false,//音声が必要な場合はtrue
  });

  media.then((stream) => {
    video.srcObject = stream;
    video.width = contentInfo[0];
    video.height = contentInfo[1];
  });

  $('.Capture-scan').on('click',function(){
    $('#video').hide();
    $(this).hide();
    var canvas = document.getElementById("canvas");
    canvas.width = contentInfo[0];
    canvas.height = contentInfo[1];
    console.log(contentInfo[0], (contentInfo[0] / 16) * 9)

    var context = canvas.getContext("2d");
    context.drawImage(video, 0, 0, video.width, video.height);
  });



  function getWindowMovieInfo() {
    var windowSizeHeight = $(window).outerHeight();
    var windowSizeWidth = $(window).outerWidth();
    return [windowSizeWidth,windowSizeHeight];
  };
});
