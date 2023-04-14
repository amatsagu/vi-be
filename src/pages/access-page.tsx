import { useState } from "react";
import '../styles/access-page.css'

function AccessPage() {
	return (
        <div id="access-container" className="center">
            <div id="logo-container">
                <img id="logo" src="logo.svg" alt="Vi-be logo" />
            </div>
            <div id="content-container">
                <h2>App requires access to directory with your music files.</h2>
                <button id="directory-selector">Select playlist folder</button>
            </div>
        </div>
    );
}

export default AccessPage;
