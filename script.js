const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');
const redButton = document.getElementById('redButton');
const crazyButton=document.getElementById('crazyColours');
const greenScreenButton=document.getElementById('greenScreen');
const controls=document.querySelector('.controls')

async function startVideo() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      video.srcObject = stream;
      video.play();
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  }
  function paintToCanvas(){
    const width=video.videoWidth;
    const height=video.videoHeight;
    canvas.width=width;
    canvas.height=height;

   return setInterval(()=>{
    ctx.drawImage(video, 0, 0, width, height);
    // take the pixels out
    let pixels = ctx.getImageData(0, 0, width, height);
   // mess with them
    if (redButton.classList.contains('active')) { // Check active class
        pixels = redEffect(pixels);
      }
    if(crazyButton.classList.contains('active')){
        pixels = rgbSplit(pixels);
        ctx.globalAlpha = 0.8;
    }
    if(greenScreenButton.classList.contains('active')){
        pixels = greenScreen(pixels);

    }
    //pixels = greenScreen(pixels);
    // put them back
    ctx.putImageData(pixels, 0, 0);

    },16);
  }

  function takePhoto(){
    //Playing the sound
    snap.currentTime=0;
    snap.play();

    //Take data from the canvas
    const data=canvas.toDataURL('image/jpeg');
    const link=document.createElement('a');
    link.href=data;
    link.setAttribute('download','beautiful');
    //link.textContent='Download Image';
    link.innerHTML=`<img src="${data}", alt="Beautiful woman"/>`
    strip.insertBefore(link,strip.firstChild);
  }
  function redEffect(pixels) {
   
    for (let i = 0; i < pixels.data.length; i+=4) {
      pixels.data[i + 0] = pixels.data[i + 0] + 200; // RED
      pixels.data[i + 1] = pixels.data[i + 1] - 50; // GREEN
      pixels.data[i + 2] = pixels.data[i + 2] * 0.5; // Blue
    }
    return pixels;
  
  }
  function rgbSplit(pixels) {
    for (let i = 0; i < pixels.data.length; i+=4) {
      pixels.data[i - 150] = pixels.data[i + 0]; // RED
      pixels.data[i + 500] = pixels.data[i + 1]; // GREEN
      pixels.data[i - 550] = pixels.data[i + 2]; // Blue
    }
    return pixels;
  }
  function greenScreen(pixels) {
    const levels = {};
  
    document.querySelectorAll('.rgb input').forEach((input) => {
      levels[input.name] = input.value;
    });
  
    for (i = 0; i < pixels.data.length; i = i + 4) {
      red = pixels.data[i + 0];
      green = pixels.data[i + 1];
      blue = pixels.data[i + 2];
      alpha = pixels.data[i + 3];
  
      if (red >= levels.rmin
        && green >= levels.gmin
        && blue >= levels.bmin
        && red <= levels.rmax
        && green <= levels.gmax
        && blue <= levels.bmax) {
        // take it out!
        pixels.data[i + 3] = 0;
      }
    }
  
    return pixels;
  }

  startVideo();
  video.addEventListener('canplay',paintToCanvas);
  redButton.addEventListener('click', () => {
    redButton.classList.toggle('active'); // Toggle active class on click
  });
  crazyButton.addEventListener('click', () => {
    crazyButton.classList.toggle('active'); // Toggle active class on click
  });
  greenScreenButton.addEventListener('click', () => {
    greenScreenButton.classList.toggle('active'); // Toggle active class on click
    controls.classList.toggle('active');
  });