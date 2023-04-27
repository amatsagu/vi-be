import "../styles/home-page.css"
import { CheckSpotifyPlatlistInput } from "../features/url-check"

function HomePage() {
	return (
        <div id="home-container" className="center">
            <div id="logo-container">
                <img id="logo" className="no-touch" src="logo.svg" alt="Vi-be logo" decoding="async" draggable="false" />
            </div>
            <div id="creator-container">
                <p>Enter a Spotify link to playlist you would like to listen.</p>
                <p>Artist & podcast links are not supported.</p>
                <input type="search" name="creator-input" id="creator-input" onChange={event => event.target.classList.remove("invalid")} placeholder="Example: https://open.spotify.com/playlist/6sDHVoBPxFCgZW2k6c1bgn" />
                <br />
                <button id="creator-submit" onClick={CheckSpotifyPlatlistInput}>Add to list</button>
            </div>
            <hr id="playlist-splitter" />
            <div id="playlist-container">
                
            </div>
        </div>
    );
}

export default HomePage;
