const record = document.querySelector("#record");
const stop = document.querySelector("#stop");

// create web audio api context
let audioCtx;
let chunks = [];

// check for users audio input
if (navigator.mediaDevices.getUserMedia) {
    console.log("The mediaDevices.getUserMedia() method is supported.");
    const constraints = { audio: true };

    let onSuccess = function (stream) {
        const mediaRecorder = new MediaRecorder(stream);
        record.onclick = function () {
            mediaRecorder.start();
            console.log(mediaRecorder.state);
            console.log("Recorder started.");
            record.style.background = "red";

            stop.disabled = false;
            record.disabled = true;
        };

        stop.onclick = function () {
            mediaRecorder.stop();
            console.log(mediaRecorder.state);
            console.log("Recorder stopped.");
            record.style.background = "";
            record.style.color = "";

            stop.disabled = true;
            record.disabled = false;
        };

        mediaRecorder.onstop = function (e) {
            // chunks = [];
            // const blob = new Blob(chunks, { type: mediaRecorder.mimeType });
            console.log("recorder stopped");
            mediaRecorder.ondataavailable = function (e) {
                chunks.push(e.data);
            };
        };
    };
    let onError = function (err) {
        console.log("The following error occured: " + err);
    };
    navigator.mediaDevices.getUserMedia(constraints).then(onSuccess, onError);
} else {
    console.log("The mediaDevices.getUserMedia() method is not supported.");
}

