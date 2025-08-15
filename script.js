let pl, iBg, bgEl;
let started = false;

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

const us = [
  'https://shorturl.at/Z3ELJ',
  'https://shorturl.at/E5wJO'
];

const yalp = ['y', 'a', 'l', 'p'];

rapImages.forEach(src => new Image().src = src);
cImages.forEach(src => new Image().src = src);
rImages.forEach(src => new Image().src = src);

function sF(startMs, durationMs, rotateIntervalMs, images = rapImages) {
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
  iBg = document.getElementById('initialBg');
  bgEl = document.getElementById('bgImage');
  bgEl.classList.add('pulse');
});

function onYouTubeIframeAPIReady() {
  pl = new YT.Player('ytPlayer', {
    videoId: 'e0L5U-BWof0',
    playerVars: {
      controls: 0, rel: 0,
      modestbranding: 1, iv_load_policy: 3,
      disablekb: 1, playsinline: 1, enablejsapi: 1
    },
    events: {
      onReady: oPr,
      onStateChange: oPSC
    }
  });
}

function sA(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function sP(morningHour, morningMinutes, nightHour, nightMinutes) {
  const now = new Date();
  const localHours = now.getHours();
  const localMinutes = now.getMinutes();

  const isN =
    (localHours >= nightHour && localMinutes >= nightMinutes) ||
    (localHours < morningHour && localMinutes <= morningMinutes);

  const urlParams = new URLSearchParams(window.location.search);
  const p = yalp.reverse().join('');
  const show = isN || urlParams.has(p);
  return show;
}


function oPr() {
  iBg.style.display = 'block';
  sAmb(16.25);

  document.body.addEventListener('click', () => {
    const sp = sP(6, 59, 17, 0);
    if (!sp || started) {
      return;
    }

    started = true;
    pl.playVideo();
    pl.unMute();
    pl.setVolume(100);
    document.documentElement.requestFullscreen?.();
  });
}

function oPSC(e) {
  if (e.data === YT.PlayerState.PLAYING) {
    const animationTimeout = 4350;

    setTimeout(() => {
      bgEl.style.display = 'block';
      bgEl.classList.add('pulse');
      iBg.style.display = 'none';

      const carousel = ['image2.png'].concat(rImages).concat(cImages);

      // 1st slot
      sF(14700, 8800, 1848, sA(rapImages));
      sF(30000, 1848, 1848, cImages);
      sF(40000, 1848, 1848, cImages);

      // 2nd slot
      sF(47500, 29000, 1848, sA(rapImages));
      sF(80000, 1848, 1848, cImages);
      // kwak kwak
      sF(88500, 924, 924, cImages);
      sF(91500, 1848, 1848, cImages);

      // 3rd slot
      sF(94500, 11088, 924, sA(rapImages));
      sF(110000, 1848, 1848, cImages);
      sF(120000, 1848, 1848, cImages);
      sF(130000, 924, 924, cImages);
      sF(140000, 1848, 1848, cImages);

      // 4th slot
      sF(157200, 21252, 924, sA(rapImages));
      sF(190000, 1848, 1848, cImages);
      sF(200000, 17556, 924, carousel);

      // 5th slot
      sF(218800, 12012, 924, sA(rapImages));
      sF(230812, 33000, 924, carousel);
      sF(265600, 4620, 4620, rImages);
      sF(280000, 924, 924, cImages);
      sF(283000, 924, 924, cImages);
      sF(286000, 924, 924, cImages);
      sF(289000, 924, 924, cImages);
      sF(292000, 4620, 4620, cImages);

      // 6th slot
      sF(300000, 20100, 924);

    }, animationTimeout);
  }
  if (e.data === YT.PlayerState.ENDED) {
    bgEl.style.display = 'none';
    iBg.style.display = 'block';
    setTimeout(() => {
      iBg.style.filter = 'brightness(6%)';
      iBg.src = 'r.png';
    }, 6200);
    setTimeout(() => {
      window.location.href = sA(us)[0];
    }, 8200);
  }
}

function sAmb(bpm) {
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

  (function dNo() {
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
    requestAnimationFrame(dNo);
  })();
}
