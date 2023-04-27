import { useState } from "react"

function Playlist() {
    return (
        <div className="playlist">
            <div className="icon-container">
                <img src="" alt="" id="playlist-icon" />
            </div>
            <div className="details-container">
                <h4 className="playlist-title">Title</h4>
                <p className="playlist-track-counter">41 songs</p>
            </div>
            <div className="controls-container">
                <button className="playlist-launch"></button>
                <button className="playlist-delete"></button>
            </div>
        </div>
    );
}