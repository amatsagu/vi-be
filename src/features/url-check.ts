function CheckSpotifyPlatlistInput(): boolean {
    const node = document.getElementById("creator-input") as unknown as (EventTarget & HTMLInputElement) | null;
    if (!node) return false;

    const value = node.value;
    if (value.length == 0) {
        node.classList.add("invalid");
        return false;
    }
    
    let url!: URL;
    try {
        url = new URL(value);
    } catch {
        node.classList.add("invalid");
        return false;
    }

    if (url.origin != "https://open.spotify.com" || !url.pathname.startsWith("/playlist/") || !url.searchParams.has("si")) {
        node.classList.add("invalid");
        return false;
    }

    return true;
}

export { CheckSpotifyPlatlistInput };