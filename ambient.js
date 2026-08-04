(() => {
    "use strict";

    const cyclesPerMinute = 16.25;
    const maximumAlpha = 60;
    const minimumAlpha = 10;
    const minimumIntensity = 0.2;
    const maximumBlur = 4;

    const canvas = document.createElement("canvas");
    canvas.id = "ambientCanvas";
    canvas.setAttribute("aria-hidden", "true");
    document.body.appendChild(canvas);

    const context = canvas.getContext("2d");
    let width;
    let height;

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    window.addEventListener("resize", resize);
    resize();

    const cyclesPerSecond = cyclesPerMinute / 60;
    const startedAt = performance.now();

    function drawNoise() {
        const elapsedSeconds = (performance.now() - startedAt) / 1000;
        const wave = (Math.sin(2 * Math.PI * cyclesPerSecond * elapsedSeconds) + 1) / 2;
        const intensity = minimumIntensity + wave * (1 - minimumIntensity);

        canvas.style.filter = `blur(${intensity * maximumBlur}px)`;

        const image = context.createImageData(width, height);
        const pixels = image.data;
        const alphaRange = (maximumAlpha - minimumAlpha) * intensity;

        for (let pixel = 0, count = width * height; pixel < count; pixel += 1) {
            const offset = pixel * 4;
            const alpha = minimumAlpha + Math.random() * alphaRange;

            pixels[offset] = 150;
            pixels[offset + 1] = 150;
            pixels[offset + 2] = 150;
            pixels[offset + 3] = alpha;
        }

        context.putImageData(image, 0, 0);
        requestAnimationFrame(drawNoise);
    }

    drawNoise();
})();
