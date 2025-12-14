// --- 1. Initialization & Variables ---
const video = document.getElementById('webcam');
const canvasElement = document.getElementById('c');
const btnCapture = document.getElementById('btnCapture');
const btnCollage = document.getElementById('btnCollage');
const btnDownload = document.getElementById('btnDownload');
const btnReset = document.getElementById('btnReset');
const editControls = document.getElementById('editControls');
const stickerid  = document.getElementById('sticker-id');
const stickerbtn  = document.getElementById('stickerbtn');
// const grid4frams =document.getElementById('grid4frams');
const countdownTimer = document.getElementById('countdownTimer');
const frameid = document.getElementById('frameid');
const labelframe = document.getElementById('labelframe');

// Canvas dimensions
const WIDTH = 480;
const HEIGHT = 640;
const HALF = HEIGHT / 2;

// Initialize Fabric Canvas
const canvas = new fabric.Canvas('c');

// Global State
let collageMode = false;
let gridIndex = 0;
let gridIndex1 = 0;
let isGridSessionActive = false;
let isSingleSessionActive = false;
let troll = true;

let slot1 ='';


// Define your 4 Holes (Coordinates for the VIDEO ELEMENT)
// These need to match your canvas coordinates but for CSS
const gridLayout = [
    { id: 0, left: 25, top: 20, width: 220, height: 260 },
    { id: 1, left: 245, top: 20, width: 220, height: 260 },
    { id: 2, left: 25, top: 270, width: 220, height: 260 },
    { id: 3, left: 245, top: 270, width: 220, height: 260 }
];


const gridSingleFrame = [
    { id: 0, left: 35, top: 60, width: 375, height: 500 },
    { id: 1, left: 45, top: 35, width: 450, height: 550 },
    { id: 2, left: 40, top: 40, width: 450, height: 550 }
];

// --- 2. Webcam Setup ---
async function startWebcam() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
    } catch (err) {
        alert("Camera Error: " + err);
    }
}

startWebcam();


// countdown
const startCountdown = callback => {
  var count = 3;
  countdownTimer.innerText = count;
  const intervalId = setInterval(() => {
    count--;
    if (count > 0) countdownTimer.innerText = count;
    else if(btnCapture.style.display != 'none') {
      clearInterval(intervalId);
      countdownTimer.style.display = 'none';
      callback();
    }
    else{
       clearInterval(intervalId);
       countdownTimer.style.display = 'none';
       callback(); 
    }
  }, 1000);
};

function capturePhoto() { 
    countdownTimer.style.display = 'block';
    startCountdown(() => {
            TakeSingleShot();;
})}

function initsingleshot() {

    if(isSingleSessionActive==true){
        frameid.style.display ='block'; 
        labelframe.style.display ='block';
    }
    const slot = gridSingleFrame[0];

    btnCapture.style.display = 'block';
    btnCollage.style.display = 'none';
    stickerid.style.display ='none';
    stickerbtn.style.display ='none';
    // grid4frams.style.display ='none';
    btnCapture.innerText = "Capture";  

    // Transform video into a "floating window" but under the overlay
    video.style.position = 'absolute';
    video.style.zIndex = '5'; // <- lower than canvas container
    video.style.objectFit = 'cover';
    video.style.display = 'block';
    video.style.opacity = '1';
    
    // 1. Show Canvas Container and ensure it sits above the video
    const container = document.querySelector('.canvas-container');
    container.style.display = 'block';
    container.style.position = 'relative';
    container.style.zIndex = '20'; // <- above video

    // Apply CSS coordinates directly to the video tag
    video.style.left = slot.left + 'px';
    video.style.top = slot.top + 'px';
    video.style.width = slot.width + 'px';
    video.style.height = slot.height + 'px';

    fabric.Image.fromURL('./frames/0.png', (img) => {
    const scaleX = canvas.width / img.width;
    const scaleY = canvas.height / img.height;
    img.set({ scaleX, scaleY });
    canvas.setOverlayImage(img, canvas.requestRenderAll.bind(canvas));

    })};

function moveVideoToSlotSingle() {


    const slot_single = gridSingleFrame[slot1];

    // Apply CSS coordinates directly to the video tag
    video.style.left = slot_single.left + 'px';
    video.style.top = slot_single.top + 'px';
    video.style.width = slot_single.width + 'px';
    video.style.height = slot_single.height + 'px';
}

btnCapture.addEventListener('click', () => {
    editControls.style.display = 'block';
    if(isSingleSessionActive == false){
        initsingleshot();
        isSingleSessionActive = true;
    }
    else{
        capturePhoto();
    }
});

// --- HELPER FUNCTION: Adds the result to Fabric ---
function addToFabric(dataURL) {
    fabric.Image.fromURL(dataURL, (img) => {    
        const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
        img.scale(scale);
        img.set({
            left: (canvas.width - img.getScaledWidth()) / 2,
            top: (canvas.height - img.getScaledHeight()) / 2,
            originX: 'left', originY: 'top',
            selectable: false
        }); 
        canvas.add(img);
        canvas.sendToBack(img);
        showEditor();
    });
    
}

// async function TakeSingleShot() {

//     // 1. Create a canvas to save the frame
//     const tempCanvas = document.createElement('canvas');
//     tempCanvas.width =WIDTH;
//     tempCanvas.height = HEIGHT;
//     const ctx = tempCanvas.getContext('2d');

//     // 2. Handle Mirroring
//     ctx.translate(tempCanvas.width, 0);
//     ctx.scale(-1, 1);

//     // 3. LOGIC: Troll vs Normal
//     if (typeof troll !== 'undefined' && troll === true) {
//         // --- TROLL MODE ---
//         // Create a NEW image object (Don't touch the video element!)
//         const monkeyImg = new Image();
//         monkeyImg.src = './image/monkey.png'; // Make sure this path is correct
        
//         // Wait for image to load before drawing
//         monkeyImg.onload = () => {
//             // Draw the monkey image to canvas
//             ctx.drawImage(monkeyImg, 0, 0, tempCanvas.width, tempCanvas.height);
            
//             // Generate URL and send to Fabric
//             const dataURL = tempCanvas.toDataURL();
//             addToFabric(dataURL);
            
//             // Turn off troll mode
//             troll = false;
//         };
//     } 
//     else {
//         // --- NORMAL WEBCAM MODE ---
//          // Center/crop the video to cover the destination size (like object-fit: cover)
//         const vW = video.videoWidth;
//         const vH = video.videoHeight;
//         const destW = tempCanvas.width;
//         const destH = tempCanvas.height;
//         const scale = Math.max(destW / vW, destH / vH);
//         const cropW = destW / scale;
//         const cropH = destH / scale;
//         const startX = (vW - cropW) / 2;
//         const startY = (vH - cropH) / 2;
//         // Draw the current video frame
//         ctx.drawImage(video, 0, 0, tempCanvas.width, tempCanvas.height);
        
//         // Generate URL and send to Fabric
//         const dataURL = tempCanvas.toDataURL();
//         addToFabric(dataURL);
//         moveVideoToSlotSingle();
//     }
//     // showEditor();


//}

// --- HELPER: Add image to fabric at exact rectangle (no extra scaling) ---
function addImageAtRect(dataURL, left, top, width, height) {
    fabric.Image.fromURL(dataURL, (img) => {
        // Scale the image to exactly fit the provided rectangle
        const scaleX = width / img.width;
        const scaleY = height / img.height;
        img.set({
            left: left,
            top: top,
            originX: 'left',
            originY: 'top',
            selectable: false
        });
        img.scaleX = scaleX;
        img.scaleY = scaleY;

        canvas.add(img);
        canvas.sendToBack(img);
        canvas.renderAll();
        showEditor();
    });
}

// Replace TakeSingleShot to capture exactly the visible video rectangle
async function TakeSingleShot() {
    // Determine the slot we are using for the single-shot
    const slot = (typeof slot1 === 'object' && slot1 && slot1.left !== undefined) ? slot1 : gridSingleFrame[0];

    // Create a canvas sized exactly to the visible video rectangle on screen
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = slot.width;
    tempCanvas.height = slot.height;
    const ctx = tempCanvas.getContext('2d');

    // Mirror to match the live mirrored video view
    ctx.translate(tempCanvas.width, 0);
    ctx.scale(-1, 1);

    // Center/crop the video to match object-fit: cover for the slot size
    const vW = video.videoWidth;
    const vH = video.videoHeight;
    const ratio = Math.max(slot.width / vW, slot.height / vH);
    const cropW = slot.width / ratio;
    const cropH = slot.height / ratio;
    const startX = (vW - cropW) / 2;
    const startY = (vH - cropH) / 2;

    // Draw the exact rectangle that is visible on-screen into the temp canvas
    ctx.drawImage(video, startX, startY, cropW, cropH, 0, 0, slot.width, slot.height);

    // Convert and add the result to Fabric at the same position/size so nothing is scaled
    const dataURL = tempCanvas.toDataURL();
    addImageAtRect(dataURL, slot.left, slot.top, slot.width, slot.height);

    // Move video back to slot (keeps UI consistent)
    moveVideoToSlotSingle();
}
// --- 4. Main Button Listener ---
btnCollage.addEventListener('click', () => {
    countdownTimer.style.display = 'block';
    if (!isGridSessionActive) startGridSession();
    else {
            // Wrap the snap function in the countdown
            startCountdown(() => {
            snapGridPhoto();
        });
    }
});

// ======================================================
// === 5. NEW LOGIC: MOVING THE HTML VIDEO ITSELF     ===
// ======================================================
// ...existing code...
async function startGridSession() {
    isGridSessionActive = true;

    // 1. Show Canvas Container and ensure it sits above the video
    const container = document.querySelector('.canvas-container');
    container.style.display = 'block';
    container.style.position = 'relative';
    container.style.zIndex = '20'; // <- above video

    btnCapture.style.display = 'none';
    btnDownload.style.display = 'none';

    // 2. Load Frame on Canvas as an OVERLAY (so it stays on top)
    canvas.clear();
    fabric.Image.fromURL('./frames/4grid.png', (img) => {
        const scaleX = canvas.width / img.width;
        const scaleY = canvas.height / img.height;
        img.set({ scaleX, scaleY });
        canvas.setOverlayImage(img, canvas.requestRenderAll.bind(canvas));
    });

    // 3. Transform video into a "floating window" but under the overlay
    video.style.position = 'absolute';
    video.style.zIndex = '5'; // <- lower than canvas container
    video.style.objectFit = 'cover';
    video.style.display = 'block';
    video.style.opacity = '1';

    // place the video in the first slot immediately
    moveVideoToSlot(gridIndex);

    btnCollage.innerText = "📸 Snap Photo " + (gridIndex + 1) + "/4";
    btnCollage.style.backgroundColor = '#e74c3c';
}
// ...existing code...

function moveVideoToSlot(index) {
    if (index >= 4) return;
    const slot = gridLayout[index];

    // Apply CSS coordinates directly to the video tag
    video.style.left = slot.left + 'px';
    video.style.top = slot.top + 'px';
    video.style.width = slot.width + 'px';
    video.style.height = slot.height + 'px';
}

function snapGridPhoto() {
    // 1. Capture the current video slot as a canvas image
    const slot = gridLayout[gridIndex];
    
    // Create a temp canvas to crop the video exactly as it looks
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = slot.width;
    tempCanvas.height = slot.height;
    const ctx = tempCanvas.getContext('2d');

    // Calculate crop (Center the video logic)
    // The video element is showing a 'cover' fit, we need to match that math
    const vW = video.videoWidth;
    const vH = video.videoHeight;
    const ratio = Math.max(slot.width / vW, slot.height / vH);
    const cropW = slot.width / ratio;
    const cropH = slot.height / ratio;
    const startX = (vW - cropW) / 2;
    const startY = (vH - cropH) / 2;

    ctx.translate(slot.width, 0);
    ctx.scale(-1, 1);
    
    ctx.drawImage(video, startX, startY, cropW, cropH, 0, 0, slot.width, slot.height);
    
    // 2. Add this "stamped" photo to the main canvas
    fabric.Image.fromURL(tempCanvas.toDataURL(), (img) => {
        img.set({
            left: slot.left,
            top: slot.top,
            selectable: false
        });
        canvas.add(img);

        canvas.sendToBack(img);
        canvas.renderAll();
    });

    // 3. Move to next slot
    gridIndex++;
    if (gridIndex < 4) {
        moveVideoToSlot(gridIndex);
        btnCollage.innerText = `📸 Snap Photo ${gridIndex + 1}`;
    } else {
        finishGridSession();
    }
}

function finishGridSession() {
    isGridSessionActive = false;
    
    // Reset Video to normal (Big screen mode)
    video.style.position = 'relative';
    video.style.zIndex = '';
    video.style.left = '';
    video.style.top = '';
    video.style.width = '100%';
    video.style.height = '100%';
    video.style.display = 'none'; // Hide video, show result canvas

    btnCollage.innerText = "田 Capture 4-Grid";
    btnCollage.style.backgroundColor = "#8e44ad";
    
    showEditor();
}

// --- Mouse Wheel Zoom Logic ---
canvas.on('mouse:wheel', function(opt) {
    var target = canvas.getActiveObject();
    if (target) {
        opt.e.preventDefault();
        opt.e.stopPropagation();
        var delta = opt.e.deltaY;
        var zoom = target.scaleX;
        zoom *= 0.999 ** delta;
        if (zoom > 3) zoom = 3;
        if (zoom < 0.2) zoom = 0.2;
        target.scale(zoom);
        target.setCoords();
        canvas.requestRenderAll();
    }
});

// --- 7. UI Switching ---
function showEditor() {
    video.style.display = 'none'; // Hide video, show result canvas
    document.querySelector('.canvas-container').style.display = 'block';
    btnCapture.style.display = 'none';
    btnCollage.style.display = 'none';
    btnDownload.style.display = 'block';
    btnReset.style.display = 'block';
    editControls.style.display = 'block';
    stickerid.style.display ='block';
    stickerbtn.style.display ='flex';
    frameid.style.display = 'none';
    labelframe.style.display = 'none';
}

// --- 8. Reset Logic ---
btnReset.addEventListener('click', () => {
    canvas.clear();
    capturedPhotos = [];
    collageMode = false;
    btnCollage.innerText = "田 Capture 4-Grid";
    
    video.style.display = 'block';
    document.querySelector('.canvas-container').style.display = 'none';
    btnCapture.style.display = 'block';
    btnCollage.style.display = 'block';
    btnDownload.style.display = 'none';
    btnReset.style.display = 'none';
    // editControls.style.display = 'none';
    initsingleshot();
});

// --- Helper: Convert Image URL to Base64 "Safe String" ---
async function loadSafeImage(url) {
    try {
        const response = await fetch(url);
        const blob = await response.blob();
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(blob);
        });
    } catch (e) {
        console.error("Error loading secure image:", e);
        return null;
    }
}

// --- 9. Sticker Logic (Secure) ---
window.addSticker = async function(url) {
    const safeURL = await loadSafeImage(url);
    if (!safeURL) {
        alert("Could not load sticker.");
        return;
    }
    fabric.Image.fromURL(safeURL, function(img) {
        img.scale(0.3);
        img.set({ left: 100, top: 100, cornerColor: 'white', cornerStrokeColor: 'black', borderColor: 'white', cornerSize: 12, transparentCorners: false });
        canvas.add(img);
        canvas.bringToFront(img);
        canvas.setActiveObject(img);
    });
}

// --- 10. Frame Logic (Secure) ---
window.setFrame = async function(url) {
    var idx = url.split('/').pop().split('.')[0];
    slot1 = gridSingleFrame[idx];
    const safeURL = await loadSafeImage(url);
    if (!safeURL) {
        alert("Could not load frame.");
        return;
    }
        // Transform video into a "floating window" but under the overlay
    video.style.position = 'absolute';
    video.style.zIndex = '5'; // <- lower than canvas container
    video.style.objectFit = 'cover';
    video.style.display = 'block';
    video.style.opacity = '1';
    
    // 1. Show Canvas Container and ensure it sits above the video
    const container = document.querySelector('.canvas-container');
    container.style.display = 'block';
    container.style.position = 'relative';
    container.style.zIndex = '20'; // <- above video

    // Apply CSS coordinates directly to the video tag
    video.style.left = slot1.left + 'px';
    video.style.top = slot1.top + 'px';
    video.style.width = slot1.width + 'px';
    video.style.height = slot1.height + 'px';

    fabric.Image.fromURL(safeURL, (img) => {    
    const scaleX = canvas.width / img.width;
    const scaleY = canvas.height / img.height;
    img.set({ scaleX, scaleY });
    canvas.clear();
    canvas.setOverlayImage(img, canvas.requestRenderAll.bind(canvas));
    canvas.add(img);
    canvas.setActiveObject(img);
})};

// --- 11. Download Logic ---
btnDownload.addEventListener('click', () => {
    canvas.discardActiveObject();
    canvas.renderAll();
    const dataURL = canvas.toDataURL({ format: 'png', quality: 1.0 });
    const link = document.createElement('a');
    link.download = collageMode ? 'christmas-collage.png' : 'christmas-photo.png';
    link.href = dataURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});

// --- Snow & Music Logic (Keep as is) ---
document.addEventListener('DOMContentLoaded', function() {
    const snowContainer = document.getElementById('snow-container');
    const numberOfFlakes = 70; 
    for (let i = 0; i < numberOfFlakes; i++) { createSnowflake(); }

    function createSnowflake() {
        const flake = document.createElement('div');
        flake.classList.add('snowflake');
        flake.style.left = Math.random() * 100 + 'vw';
        const size = Math.random() * 5 + 5 + 'px';
        flake.style.width = size; flake.style.height = size;
        flake.style.animationDuration = Math.random() * 7 + 5 + 's';
        flake.style.animationDelay = Math.random() * 5 + 's';
        flake.style.opacity = Math.random() * 0.5 + 0.3;
        snowContainer.appendChild(flake);
    }
});

const songs = [
    { title: "Jingle Bells", url: "./music/1.mp3" },
    { title: "Silent Night", url: "./music/2.mp3" },
    { title: "Deck the Halls", url: "./music/3.mp3" },
];

const audioEl = document.getElementById('audioElement');
const btnPlayPause = document.getElementById('btnPlayPause');
const currentTitle = document.getElementById('currentTitle');
const trackListEl = document.getElementById('trackList');
let isPlaying = false;

songs.forEach((song, index) => {
    const div = document.createElement('div');
    div.classList.add('track-item');
    div.innerText = song.title;
    div.addEventListener('click', () => { playTrack(index); });
    trackListEl.appendChild(div);
});

function playTrack(index) {
    const song = songs[index];
    audioEl.src = song.url;
    audioEl.play();
    isPlaying = true;
    btnPlayPause.innerText = "⏸";
    currentTitle.innerText = song.title;
    const items = document.querySelectorAll('.track-item');
    items.forEach(item => item.classList.remove('active'));
    items[index].classList.add('active');
}

btnPlayPause.addEventListener('click', () => {
    if (!audioEl.src) { playTrack(0); return; }
    if (isPlaying) {
        audioEl.pause();
        btnPlayPause.innerText = "▶";
        isPlaying = false;
    } else {
        audioEl.play();
        btnPlayPause.innerText = "⏸";
        isPlaying = true;
    }
});