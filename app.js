async function searchMusic() {
    const query = document.getElementById('query').value;
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = "Searching...";

    if (!query) return;

    try {
        // Uses a public open-source audio search API mirror
        const response = await fetch(`https://apple.com{encodeURIComponent(query)}&entity=song&limit=10`);
        const data = await response.json();
        
        resultsDiv.innerHTML = ""; // Clear loader

        if (data.results.length === 0) {
            resultsDiv.innerHTML = "No tracks found.";
            return;
        }

        data.results.forEach(track => {
            const trackEl = document.createElement('div');
            trackEl.className = 'track';
            trackEl.innerHTML = `<strong>${track.trackName}</strong> <span>${track.artistName}</span>`;
            
            // When clicked, send the unblocked audio stream to the audio element
            trackEl.onclick = () => {
                const player = document.getElementById('audioPlayer');
                player.src = track.previewUrl; // Directly streams audio file
                player.play();
            };

            resultsDiv.appendChild(trackEl);
        });

    } catch (error) {
        resultsDiv.innerHTML = "Error loading music. Try another search.";
        console.error(error);
    }
}
