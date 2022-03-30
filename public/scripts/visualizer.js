class Visualizer {
    static #RADIUS = 256;
    static #BAR_COUNT = 180;
    static #SCALE = 0.5;
    static #canvas = document.getElementById("visualizer");
    static #ctx = Visualizer.#canvas.getContext("2d");
    static #audioContext;
    static #analyser;
    static #analyserSource;
    static #freqs;
    static baseColor = "rgb(128, 128, 128)";

    static _init() {
        Visualizer.#ctx.imageSmoothingEnabled = true;
        window.onresize = () => Visualizer.update();
        Visualizer.update();
    }

    static _link(speaker) {
        Visualizer.#audioContext = new (window.AudioContext || window.webkitAudioContext)();
        Visualizer.#analyser = Visualizer.#audioContext.createAnalyser();
        Visualizer.#analyserSource = Visualizer.#audioContext.createMediaElementSource(speaker);
        Visualizer.#analyserSource.connect(Visualizer.#analyser);
        Visualizer.#analyser.connect(Visualizer.#audioContext.destination);
        Visualizer.#freqs = new Uint8Array(Visualizer.#analyser.frequencyBinCount);
    }

    static update() {
        const width = window.innerWidth;
        const height = window.innerHeight;

        // Manually try to scale canvas cause CSS commonly fails.
        if (width > 780) {
            Visualizer.#RADIUS = 256;
            Visualizer.#BAR_COUNT = 180;
            Visualizer.#SCALE = 0.5;
        }
        else if (width <= 300) {
            Visualizer.#RADIUS = 96;
            Visualizer.#BAR_COUNT = 64;
            Visualizer.#SCALE = 0.2;
        }
        else if (width <= 440) {
            Visualizer.#RADIUS = 128;
            Visualizer.#BAR_COUNT = 96;
            Visualizer.#SCALE = 0.25;
        }
        else if (width <= 560) {
            Visualizer.#SCALE = 0.3;
        }
        else if (width <= 780) {
            Visualizer.#RADIUS = 192;
            Visualizer.#BAR_COUNT = 128;
            Visualizer.#SCALE = 0.4;
        }

        Visualizer.#canvas.width = width;
        Visualizer.#canvas.height = height;
        Visualizer.#ctx.canvas.width = width;
        Visualizer.#ctx.canvas.height = height;
        Visualizer.#ctx.clearRect(0, 0, width, height);
        Visualizer.#ctx.strokeStyle = Visualizer.baseColor;
        Visualizer.#ctx.lineWidth = 3;
        Visualizer.#ctx.beginPath();
        Visualizer.#ctx.arc(width / 2, height / 2, Visualizer.#RADIUS, 0, 2 * Math.PI);
        Visualizer.#ctx.stroke();
    }

    static render() {
        const width = Visualizer.#canvas.width;
        const height = Visualizer.#canvas.height;

        Visualizer.#ctx.clearRect(0, 0, width, height);
        Visualizer.#ctx.strokeStyle = "rgb(64, 180, 128)";
        Visualizer.#ctx.beginPath();
        Visualizer.#ctx.arc(width / 2, height / 2, Visualizer.#RADIUS, 0, 2 * Math.PI);
        Visualizer.#ctx.stroke();
        Visualizer.#analyser.getByteFrequencyData(Visualizer.#freqs);

        for (var i = 0; i < Visualizer.#BAR_COUNT; i++) {
            const radians = (Math.PI * 2) / Visualizer.#BAR_COUNT;
            const size = Visualizer.#freqs[i] * Visualizer.#SCALE;

            const x = width / 2 + Math.cos(radians * i) * Visualizer.#RADIUS;
            const y = height / 2 + Math.sin(radians * i) * Visualizer.#RADIUS;
            const limitX = width / 2 + Math.cos(radians * i) * (Visualizer.#RADIUS + size);
            const limitY = height / 2 + Math.sin(radians * i) * (Visualizer.#RADIUS + size);
            Visualizer.#ctx.strokeStyle = `rgb(64, ${Visualizer.#freqs[i] + 48}, 128)`;
            Visualizer.#ctx.lineWidth = 3;
            Visualizer.#ctx.beginPath();
            Visualizer.#ctx.moveTo(x, y);
            Visualizer.#ctx.lineTo(limitX, limitY);
            Visualizer.#ctx.stroke();
        }

        requestAnimationFrame(Visualizer.render);
    }
}
