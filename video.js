document.addEventListener('DOMContentLoaded', () => {
    const video = document.getElementById('christmas-video');
    const enterBtn = document.getElementById('enter-btn');
    const overlay = document.getElementById('intro-overlay');

    // 1. Function to show the button
    const showButton = () => {
        enterBtn.classList.remove('hidden');
        enterBtn.classList.add('visible');
    };

    // 2. Listen for when the video ends
    video.addEventListener('ended', showButton);

    // OPTIONAL: Force show button after 20 seconds even if video loops
    // setTimeout(showButton, 20000); 

    // 3. Handle the "Enter Site" click
    enterBtn.addEventListener('click', () => {
        // Fade out the overlay
        overlay.style.opacity = '0';

        window.location.href = 'index.html';
        
        // Remove overlay from DOM after fade completes (1s) to allow scrolling
        setTimeout(() => {
            overlay.style.display = 'none';
        }, 1000); // Matches the CSS transition time
    });
});