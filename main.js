const THICKNESS = Math.pow(80, 2),
    SPACING = 3,
    MARGIN = 100,
    COLOR = 220,
    DRAG = 0.95,
    EASE = 0.25;

let container,
    canvas,
    stats,
    particles,
    ctx,
    tog,
    man,
    dx, dy,
    mx, my,
    d, t, f,
    a, b,
    i, n,
    w, h,
    p, s,
    r, c;

draw();

function draw() {
    const canvas = createCanvas();
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = function () {
        const imageWidth = 1000;
        const imageHeight = 600;

        ctx.drawImage(img, 0, 0, imageWidth, imageHeight, 0, 0, imageWidth, imageHeight);
        const imageData = ctx.getImageData(0, 0, imageWidth, imageHeight);
        particles = [];

        for (let y = 0; y < imageHeight; y += 1) {
            for (let x = 0; x < imageWidth * 4; x += 4) {
                if (imageData.data[(y - 1) * imageWidth * 4 + x] === 104) {
                    particles.push(Particle(x / 4, y));
                }
            }
        }

        init();
        step();
    };
    img.src = './dotted-world-map.png';
}

function createCanvas() {
    const canvas = document.createElement('canvas');
    canvas.width = 1000;
    canvas.height = 600;
    document.getElementById('canvas-root').appendChild(canvas);
    return canvas;
}

function Particle(x = 0, y = 0) {
    return { vx: 0, vy: 0, x, y, ox: x, oy: y };
}

function init() {
    container = document.getElementById('container');
    canvas = document.createElement('canvas');

    ctx = canvas.getContext('2d');
    man = false;
    tog = true;

    w = canvas.width = 1000;
    h = canvas.height = 600;

    container.addEventListener('mousemove', function (e) {
        bounds = container.getBoundingClientRect();
        mx = e.clientX - bounds.left;
        my = e.clientY - bounds.top;
        man = true;
    });

    if (typeof Stats === 'function') {
        document.body.appendChild((stats = new Stats()).domElement);
    }

    container.appendChild(canvas);
}

function step() {
    if (stats) stats.begin();

    if (tog = !tog) {
        if (!man) {
            t = +new Date() * 0.001;
            mx = w * 0.5 + (Math.cos(t * 2.1) * Math.cos(t * 0.9) * w * 0.45);
            my = h * 0.5 + (Math.sin(t * 3.2) * Math.tan(Math.sin(t * 0.8)) * h * 0.45);
        }

        for (i = 0; i < particles.length; i++) {
            p = particles[i];
            d = (dx = mx - p.x) * dx + (dy = my - p.y) * dy;
            f = -THICKNESS / d;

            if (d < THICKNESS) {
                t = Math.atan2(dy, dx);
                p.vx += f * Math.cos(t);
                p.vy += f * Math.sin(t);
            }

            p.x += (p.vx *= DRAG) + (p.ox - p.x) * EASE;
            p.y += (p.vy *= DRAG) + (p.oy - p.y) * EASE;
        }
    } else {
        b = (a = ctx.createImageData(w, h)).data;

        for (i = 0; i < particles.length; i++) {
            p = particles[i];
            b[n = (~~p.x + (~~p.y * w)) * 4] = b[n + 1] = b[n + 2] = COLOR, b[n + 3] = 255;
        }

        ctx.putImageData(a, 0, 0);
    }

    if (stats) stats.end();

    requestAnimationFrame(step);
}
