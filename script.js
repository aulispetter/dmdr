let player, overlay, initialBg, bgEl;

// list of flash images to cycle through
const rapImages = [
  '1.png', '2.png', '3.png', '4.png',
  '5.png', '6.png', '7.png', '8.png'
];

const cImages = [
  'initial.png'
];

const rImages = [
  'r.png',
];

const urls = [
  'https://shorturl.at/xB6zj',
  'https://shorturl.at/E5wJO',
  'https://shorturl.at/iuaz4',
  'https://shorturl.at/X8HV'
];

// preload flashes
rapImages.forEach(src => new Image().src = src);
cImages.forEach(src => new Image().src = src);
rImages.forEach(src => new Image().src = src);

function scheduleFlash(startMs, durationMs, rotateIntervalMs, images = rapImages) {
  const originalSrc = bgEl.src;
  let intervalHandle;
  setTimeout(() => {
    let idx = 0;
    bgEl.style.opacity = 0.03;
    bgEl.src = images[idx];
    intervalHandle = setInterval(() => {
      idx = (idx + 1) % images.length;
      bgEl.src = images[idx];
    }, rotateIntervalMs);
    setTimeout(() => {
      clearInterval(intervalHandle);
      bgEl.src = originalSrc;
      bgEl.style.opacity = 0.01;
    }, durationMs);
  }, startMs);
}

document.addEventListener('DOMContentLoaded', () => {
  overlay = document.getElementById('playOverlay');
  initialBg = document.getElementById('initialBg');
  bgEl = document.getElementById('bgImage');
  bgEl.classList.add('pulse');
});

function onYouTubeIframeAPIReady() {
  player = new YT.Player('ytPlayer', {
    videoId: 'e0L5U-BWof0',
    playerVars: {
      autoplay: 0, controls: 0, rel: 0,
      modestbranding: 1, iv_load_policy: 3,
      disablekb: 1, playsinline: 1
    },
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerStateChange
    }
  });
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function onPlayerReady() {
  initialBg.style.display = 'block';
  overlay.style.display = 'flex';

  overlay.addEventListener('click', () => {
    player.playVideo();
    overlay.style.display = 'none';
    const animationTimeout = 5440;
    document.documentElement.requestFullscreen?.();

    setTimeout(() => {
      bgEl.style.display = 'block';
      bgEl.classList.add('pulse');
      initialBg.style.display = 'none';
      startAmbient(16.25);

      const carousel = ['image.png'].concat(rImages).concat(cImages);

      // 1st slot
      scheduleFlash(14700, 8800, 1848, shuffleArray(rapImages));
      scheduleFlash(30000, 924, 924, cImages);
      scheduleFlash(40000, 1848, 1848, cImages);

      // 2nd slot
      scheduleFlash(47500, 29000, 1848, shuffleArray(rapImages));
      scheduleFlash(80000, 924, 924, cImages);
      // kwak kwak
      scheduleFlash(88500, 924, 924, cImages);
      scheduleFlash(91500, 1848, 1848, cImages);

      // 3rd slot
      scheduleFlash(94500, 11088, 924, shuffleArray(rapImages));
      scheduleFlash(120000, 1848, 1848, cImages);
      scheduleFlash(130000, 924, 924, cImages);
      scheduleFlash(140000, 1848, 1848, cImages);

      // 4th slot
      scheduleFlash(156900, 21252, 924, shuffleArray(rapImages));
      scheduleFlash(190000, 1848, 1848, cImages);
      scheduleFlash(200000, 17556, 924, carousel);

      // 5th slot
      scheduleFlash(218800, 12012, 924, shuffleArray(rapImages));
      scheduleFlash(232000, 33000, 924, carousel);
      scheduleFlash(265600, 4620, 4620, rImages);
      scheduleFlash(280000, 924, 924, cImages);
      scheduleFlash(283000, 924, 924, cImages);
      scheduleFlash(286000, 924, 924, cImages);
      scheduleFlash(289000, 924, 924, cImages);
      scheduleFlash(292000, 4620, 4620, cImages);

      // 6th slot
      scheduleFlash(300000, 20100, 924);

    }, animationTimeout);


  }, { once: true });
}

function onPlayerStateChange(e) {
  if (e.data === YT.PlayerState.PLAYING) {
    if (player.isMuted()) {
      player.unMute();
    } else {
      console.log('Not muted — no need to unmute');
    }
  }
  if (e.data === YT.PlayerState.ENDED) {
    bgEl.style.display = 'none';
    initialBg.style.display = 'block';
    setTimeout(() => {
      initialBg.style.brightness = '0.06';
      initialBg.src = 'r.png';
    }, 6200);
    setTimeout(() => {
      window.location.href = shuffleArray(urls)[0];
    }, 8200);
  }
}

function startAmbient(bpm) {
  const canvas = document.createElement('canvas');
  canvas.id = 'ambientCanvas';
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  let w, h;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  const beatFreq = bpm / 60;
  const maxAlpha = 60, minAlpha = 10, floorMod = 0.2, maxBlur = 4;
  const startTime = performance.now();

  (function drawNoise() {
    const t = (performance.now() - startTime) / 1000;
    const raw = (Math.sin(2 * Math.PI * beatFreq * t) + 1) / 2;
    const mod = floorMod + raw * (1 - floorMod);

    canvas.style.filter = `blur(${mod * maxBlur}px)`;

    const imgData = ctx.createImageData(w, h);
    const data = imgData.data;
    const range = (maxAlpha - minAlpha) * mod;
    for (let i = 0, len = w * h; i < len; i++) {
      const alpha = minAlpha + Math.random() * range;
      data[4 * i] = data[4 * i + 1] = data[4 * i + 2] = 150;
      data[4 * i + 3] = alpha;
    }
    ctx.putImageData(imgData, 0, 0);
    requestAnimationFrame(drawNoise);
  })();
}