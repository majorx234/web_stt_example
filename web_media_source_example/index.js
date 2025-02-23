
$( function() {
  $( "#slider-vertical1" ).slider({
    orientation: "vertical",
    range: "min",
    min: 0,
    max: 127,
    value: 0,
    slide: function( event, ui ) {
      $( "#amount1" ).val( ui.value );
      midi.slide(1,ui.value);
    }
  });
  $( "#amount1" ).val( $( "#slider-vertical1" ).slider( "value" ) );

$( function() {
  $( "#slider-vertical1" ).slider({
    orientation: "vertical",
    range: "min",
    min: 0,
    max: 127,
    value: 0,
    slide: function( event, ui ) {
      $( "#amount1" ).val( ui.value );
      midi.slide(1,ui.value);
    }
  });
  $( "#amount1" ).val( $( "#slider-vertical1" ).slider( "value" ) );
  }
);

let audioCtx;
const audioElement = document.querySelector("audio");
const canvas = document.querySelector(".visualizer");

if (navigator.mediaDevices.getUserMedia) {
  console.log("The mediaDevices.getUserMedia() method is supported.");

  const constraints = { audio: true };
  let chunks = [];

  let onSuccess = function (stream) {
    const mediaRecorder = new MediaRecorder(stream);

    visualize(stream);
  };
  let onError = function (err) {
    console.log("The following error occured: " + err);
  };
  navigator.mediaDevices.getUserMedia(constraints).then(onSuccess, onError);
} else {
  console.log("MediaDevices.getUserMedia() not supported on your browser!");
}

function visualize(stream) {
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }

  const source = audioCtx.createMediaStreamSource(stream);

  const analyser = audioCtx.createAnalyser();
  analyser.fftSize = 2048;
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  source.connect(analyser);

  draw();

  function draw() {
    const WIDTH = canvas.width;
    const HEIGHT = canvas.height;

    requestAnimationFrame(draw);

    analyser.getByteTimeDomainData(dataArray);

    canvasCtx.fillStyle = "rgb(200, 200, 200)";
    canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

    canvasCtx.lineWidth = 2;
    canvasCtx.strokeStyle = "rgb(0, 0, 0)";

    canvasCtx.beginPath();

    let sliceWidth = (WIDTH * 1.0) / bufferLength;
    let x = 0;

    for (let i = 0; i < bufferLength; i++) {
      let v = dataArray[i] / 128.0;
      let y = (v * HEIGHT) / 2;

      if (i === 0) {
        canvasCtx.moveTo(x, y);
      } else {
        canvasCtx.lineTo(x, y);
      }

      x += sliceWidth;
    }

    canvasCtx.lineTo(canvas.width, canvas.height / 2);
    canvasCtx.stroke();
  }
}

window.onresize = function () {
  canvas.width = mainSection.offsetWidth;
};

window.onresize();
