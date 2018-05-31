const IMAGE_WIDTH = 1000,
    IMAGE_HEIGHT = 600,
    THICKNESS = Math.pow(80, 2),
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
    p, s,
    r, c;

draw();

function draw() {
    const canvas = createCanvas('container-src', IMAGE_WIDTH, IMAGE_HEIGHT);
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = function () {
        ctx.drawImage(img, 0, 0, IMAGE_WIDTH, IMAGE_HEIGHT, 0, 0, IMAGE_WIDTH, IMAGE_HEIGHT);
        const imageData = ctx.getImageData(0, 0, IMAGE_WIDTH, IMAGE_HEIGHT);
        particles = [];

        for (let y = 0; y < IMAGE_HEIGHT; y += 1) {
            for (let x = 0; x < IMAGE_WIDTH * 4; x += 4) {
                if (imageData.data[(y - 1) * IMAGE_WIDTH * 4 + x] === 104) {
                    particles.push(Particle(x / 4, y));
                }
            }
        }

        init();
        step();
    };
    img.src = './dotted-world-map.png';
}

function createCanvas(elId, width, height) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    document.getElementById(elId).appendChild(canvas);
    return canvas;
}

function Particle(x = 0, y = 0) {
    return { vx: 0, vy: 0, x, y, ox: x, oy: y };
}

function init() {
    const container = document.getElementById('container');
    const canvas = createCanvas('container', IMAGE_WIDTH, IMAGE_HEIGHT);
    ctx = canvas.getContext('2d');
    man = false;
    tog = true;

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
            mx = IMAGE_WIDTH * 0.5 + (Math.cos(t * 2.1) * Math.cos(t * 0.9) * IMAGE_WIDTH * 0.45);
            my = IMAGE_HEIGHT * 0.5 + (Math.sin(t * 3.2) * Math.tan(Math.sin(t * 0.8)) * IMAGE_HEIGHT * 0.45);
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
        b = (a = ctx.createImageData(IMAGE_WIDTH, IMAGE_HEIGHT)).data;

        for (i = 0; i < particles.length; i++) {
            p = particles[i];
            b[n = (~~p.x + (~~p.y * IMAGE_WIDTH)) * 4] = b[n + 1] = b[n + 2] = COLOR, b[n + 3] = 255;
        }

        ctx.putImageData(a, 0, 0);
    }

    if (stats) stats.end();

    requestAnimationFrame(step);
}
