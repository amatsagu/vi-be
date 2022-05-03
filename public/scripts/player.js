class Player {
    static #isPlaying = false;
    static #linkedVisualizer = false;
    static #volume = parseFloat(localStorage.getItem("volume") ?? "0.5");
    static #playlistUrl = "https://raw.githubusercontent.com/Amatsagu/Vi-be/master/public/playlist";
    static #playback = localStorage.getItem("playback") && JSON.parse(localStorage.getItem("playback"));
    static #tracks = [];
    static #lastPlayedIds = [];
    static #loopLimit = 5;
    static #switch = document.getElementById("switch-btn");
    static #speaker = (() => {
        const audio = new Audio();
        audio.crossOrigin = "anonymous";
        audio.volume = Player.#volume;
        return audio;
    })();

    static async _init() {
        const res = await (await fetch(`${Player.#playlistUrl}/details.json`)).json();
        Player.#tracks = res;
        Player.#loopLimit = Math.round(res.length * 0.15);
        Player.#switch.onclick = Player.play;
        Visualizer._init();
    }

    static #getTrack() {
        const now = Date.now();
        if (Player.#playback && now < Player.#playback.endTimestamp) {
            const track = Player.#tracks.find((track) => track.id == Player.#playback.trackId);
            if (!track) {
                localStorage.removeItem("playback");
                Player.#playback = undefined;
                return Player.#getTrack();
            }

            Player.#lastPlayedIds.push(track.id);
            return { ...track, offset: track.duration - (Player.#playback.endTimestamp - now) };
        }

        while (true) {
            const track = Player.#tracks[getRandomInt(0, Player.#tracks.length)];
            if (Player.#lastPlayedIds.includes(track.id)) continue;

            Player.#playback = { trackId: track.id, endTimestamp: now + track.duration };
            Player.#lastPlayedIds.push(track.id);
            localStorage.setItem("playback", JSON.stringify(Player.#playback));

            while (Player.#lastPlayedIds.length > Player.#loopLimit) Player.#lastPlayedIds.shift();
            return { ...track, offset: 0 };
        }
    }

    static #setTrackDetails(title, author) {
        const titleNode = document.getElementById("track-title");
        const authorNode = document.getElementById("track-author");

        title = title.replace(/\(.+\)/gi, "").substr(0, 24);

        titleNode.innerText = title;
        authorNode.innerText = (author && author.substr(0, 32)) ?? "";
        document.title = `${title} - Vi~be`;
    }

    static async play() {
        if (Player.#isPlaying) return console.log("[Player] [Warn] Stream is already playing!");
        Player.#switch.style.fill = "rgb(64, 180, 128)";
        Player.#switch.onclick = Player.pause;

        if (!Player.#linkedVisualizer) {
            Player.#linkedVisualizer = true;
            Visualizer._link(Player.#speaker);
        }

        const res = Player.#getTrack();
        Player.#setTrackDetails(res.title, res.author);
        Player.#speaker.src = `${Player.#playlistUrl}/tracks/${res.id}.ogg`;

        Player.#speaker.oncanplay = () => {
            Player.#speaker.oncanplay = null;
            Player.#speaker.currentTime = Math.floor(res.offset / 1000);
            if (Player.#speaker.paused) Player.#speaker.play();
            Player.#isPlaying = true;
            requestAnimationFrame(Visualizer.render);
        };

        Player.#speaker.onended = () => {
            Player.#speaker.onended = null;
            Player.#isPlaying = false;
            Player.play();
        }
    }

    static pause() {
        if (!Player.#isPlaying) return console.log("[Player] [Warn] Stream is already paused!");
        Player.#switch.style.fill = "#e2e2e2";
        Player.#switch.onclick = Player.play;
        Player.#isPlaying = false;
        Player.#speaker.pause();
    }

    static setVolume(value) {
        if (typeof value != "number" || value > 100 || value < 0) return console.log("[Player] [Warn] Provided value is invalid! Please use a number from 1 to 100 (%).");
        Player.#speaker.volume = Math.floor(value) / 100;
        localStorage.setItem("volume", Player.#speaker.volume);
        console.log(`[Player] [Info] Successfully set volume to ${Math.floor(value)}%`);
    }
}
