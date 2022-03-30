class Player {
    static #isPlaying = false;
    static #volume = parseFloat(localStorage.getItem("volume") ?? "0.5");
    static #playlistUrl = localStorage.getItem("playlistUrl") ?? "https://raw.githubusercontent.com/Amatsagu/Vi-be/master/playlist";
    static #playback = localStorage.getItem("playback") ?? undefined;
    static #tracks = [];
    static #lastPlayedIds = [];
    static #loopLimit = 5; // How many songs should Player remember back to not repeat them. Take 20% of total playlist length.
    static #switch = document.getElementById("switch-btn");
    static #speaker = (() => {
        const audio = new Audio;
        audio.crossOrigin = "anonymous";
        audio.volume = Player.#volume;
        audio.muted = true;
        return audio;
    })();

    static async _init() {
        await Player.setPlaylist(Player.#playlistUrl);
        Player.#switch.onclick = Player.play;
    }

    static async setPlaylist(url, silent) {
        if (!silent) console.log(`[Player] [Info] Verifying ${url} as a new playlist source. Fetching "details.json" file from ${url}/details.json uri.`);

        let res;
        try {
            res = await (await fetch(`${url}/details.json`)).json();
        }
        catch {
            if (!silent) console.log("[Player] [Error] Failed to fetch. Provided playlist url is considered as invalid.");
        }

        // Make primitive, quick check
        let idx = 0;
        for (const { id, title, author, duration } of res) {
            if (typeof id != "string" || typeof title != "string" || (author && typeof author != "string") || typeof duration != "number") {
                if (!silent) console.log(`[Player] [Error] Failed to fetch. Track[${idx}] doesn't meet schema.`);
                return;
            }
            idx++;
        }

        localStorage.setItem("playlistUrl", url);
        Player.#playlistUrl = url;
        Player.#tracks = res;
        Player.#loopLimit = Math.round(res.length * 0.2);
        if (!silent) console.log(`[Player] [Info] Provided playlist url \"details.json\" file got accepted (tracks = ${Player.#tracks.length}, loopLimit = ${Player.#loopLimit}). Keep in mind it only checks data file, it won't check every single audio source.`);
    }

    static play() {
        if (Player.#isPlaying) return console.log("[Player] [Warn] Stream is already playing!");
        Player.#switch.style.fill = "rgb(64, 180, 128)";
        Player.#switch.onclick = Player.pause;
        Player.#isPlaying = true;
    }

    static pause() {
        if (!Player.#isPlaying) return console.log("[Player] [Warn] Stream is already paused!");
        Player.#switch.style.fill = "#e2e2e2";
        Player.#switch.onclick = Player.play;
        Player.#isPlaying = false;
    }
}

Player._init();