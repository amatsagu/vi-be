"use strict";

const RADIUS = 256;
const BAR_COUNT = 180;

/** @returns {MediaStream} */
async function getStream(url) {
    let res;
    const mutex = new Promise((resolve) => (res = resolve));

    const speaker = new Audio();
    speaker.crossOrigin = "anonymous";
    speaker.src = url;
    speaker.oncanplay = () => res();

    await mutex;

    speaker.play();
    return speaker;
}

function resizeCanvas() {
    const canvas = document.getElementById("visualizer");
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "rgb(128, 128, 128)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, RADIUS, 0, 2 * Math.PI);
    ctx.stroke();
}

async function play() {
    /** @type {AudioContext} */
    const context = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = context.createAnalyser();

    const stream = await getStream("https://raw.githubusercontent.com/Amatsagu/Yaikava/master/dist/tracks/T_Gux-qXQV8.ogg");
    stream.volume = 0.3;
    const source = context.createMediaElementSource(stream);

    source.connect(analyser);
    analyser.connect(context.destination);

    resizeCanvas();

    const canvas = document.getElementById("visualizer");
    const ctx = canvas.getContext("2d");
    ctx.imageSmoothingEnabled = true;
    const freqs = new Uint8Array(analyser.frequencyBinCount);

    function render() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = "rgb(64, 180, 128)";
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, RADIUS, 0, 2 * Math.PI);
        ctx.stroke();
        analyser.getByteFrequencyData(freqs);

        for (var i = 0; i < BAR_COUNT; i++) {
            const radians = (Math.PI * 2) / BAR_COUNT;
            const bar_height = freqs[i] * 0.5;

            const x = canvas.width / 2 + Math.cos(radians * i) * RADIUS;
            const y = canvas.height / 2 + Math.sin(radians * i) * RADIUS;
            const limitX = canvas.width / 2 + Math.cos(radians * i) * (RADIUS + bar_height);
            const limitY = canvas.height / 2 + Math.sin(radians * i) * (RADIUS + bar_height);
            ctx.strokeStyle = `rgb(64, ${freqs[i] + 48}, 128)`;
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(limitX, limitY);
            ctx.stroke();
        }

        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
    window.onclick = null;
}

// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
window.onload = () => resizeCanvas();
window.onclick = () => play();
window.onresize = () => resizeCanvas();
