// High availability public infrastructure endpoint instance for privacy routing
const API_BASE = "https://pipedapi.kavin.rocks"; 

const audioEngine = document.getElementById('audioEngine');
const playPauseBtn = document.getElementById('playPauseBtn');
const progressBar = document.getElementById('progressBar');
const currentTimeEl = document.getElementById('currentTime');
const durationTimeEl = document.getElementById('durationTime');

// Event listener triggered automatically when the audio track finishes downloading tracking metadata
audioEngine.addEventListener('timeupdate', () => {
    if (audioEngine.duration) {
        const percentage = (audioEngine.currentTime / audioEngine.duration) * 100;
        progressBar.value = percentage;
        currentTimeEl.textContent = formatTime(audioEngine.currentTime);
    }
});

audioEngine.addEventListener('loadedmetadata', () => {
    durationTimeEl.textContent = formatTime(audioEngine.duration);
});

// Handles unblocked raw video/audio queries natively 
async function searchTracks() {
    const query = document.getElementById('searchInput').value.trim();
    const resultsList = document.getElementById('resultsList');
    
    if (!query) return;
    resultsList.innerHTML = `<p class="empty-state">Searching securely...</p>`;

    try {
        // Enforces structural filter restrictions to extract clean audio records 
        const response = await fetch(`${API_BASE}/search?q=${encodeURIComponent(query)}&filter=music_songs`);
        const data = await response.json();

        resultsList.innerHTML = "";

        if (!data.items || data.items.length === 0) {
            resultsList.innerHTML = `<p class="empty-state">No matching full tracks found.</p>`;
            return;
        }

        data.items.forEach(item => {
            // Skips channel listings or broken item maps
            if (item.type !== 'video' && item.type !== 'stream') return; 

            const div = document.createElement('div');
            div.className = 'music-item';
            div.innerHTML = `
                <img class="item-thumb" src="${item.thumbnail}" alt="Thumbnail">
                <div class="item-info">
                    <h4>${item.title}</h4>
                    <p>${item.uploaderName || 'Unknown Artist'}</p>
                </div>
            `;
            
            // Interactive listener triggers server routing payload injection
            div.onclick = () => selectAndPlayTrack(item.url.split('v=')[1] || item.id, item.title, item.uploaderName, item.thumbnail);
            resultsList.appendChild(div);
        });

    } catch (err) {
        console.error("Fetch operational breakdown:", err);
        resultsList.innerHTML = `<p class="empty-state">Connection timeout. Please verify settings or try again.</p>`;
    }
}

// Fetches the active unblocked stream link via backend structural unpacking
async function selectAndPlayTrack(videoId, title, artist, artUrl) {
    playPauseBtn.disabled = true;
    playPauseBtn.textContent = "Loading...";
    
    // Updates UI visual layers immediately
    document.getElementById('albumArt').src = artUrl;
    document.getElementById('playerTitle').textContent = title;
    document.getElementById('playerArtist').textContent = artist || 'Unknown Artist';

    try {
        const response = await fetch(`${API_BASE}/streams/${videoId}`);
        const streamData = await response.json();

        // Isolates premium background audio pipelines without ad injections
        const audioStreams = streamData.audioStreams;
        if (!audioStreams || audioStreams.length === 0) {
            alert("This file composition cannot stream directly. Try another track.");
            return;
        }

        // Extracts high bitrate background wrapper asset directly 
        const clearAudioUrl = audioStreams[0].url;

        audioEngine.src = clearAudioUrl;
        audioEngine.play();
        
        playPauseBtn.disabled = false;
        playPauseBtn.textContent = "Pause";

    } catch (err) {
        console.error("Audio route loading failure:", err);
        alert("Failed to securely mount the audio channel pipeline.");
        playPauseBtn.textContent = "Play";
    }
}

function togglePlayback() {
    if (audioEngine.paused) {
        audioEngine.play();
        playPauseBtn.textContent = "Pause";
    } else {
        audioEngine.pause();
        playPauseBtn.textContent = "Play";
    }
}

function seekAudio() {
    if (audioEngine.duration) {
        const newTime = (progressBar.value / 100) * audioEngine.duration;
        audioEngine.currentTime = newTime;
    }
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}
