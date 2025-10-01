const canvas = document.getElementById('cardCanvas');
const ctx = canvas.getContext('2d');
const card = document.getElementById('card');

canvas.width = card.clientWidth;
canvas.height = card.clientHeight;

let particles = [];
let fireworks = [];

// Particle class (heart shape)
class Particle {
    constructor(x, y, color, angle, speed, life, shape="heart") {
        this.x = x;
        this.y = y;
        this.color = color;
        this.angle = angle;
        this.speed = speed;
        this.life = life;
        this.alpha = 1;
        this.shape = shape;
    }

    update() {
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed + 0.05; // gravity
        this.speed *= 0.95;
        this.life--;
        this.alpha = this.life / 50;
    }

    draw() {
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;

        if (this.shape === "heart") {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.scale(0.05, 0.05);
            ctx.beginPath();
            ctx.moveTo(0, -20);
            ctx.bezierCurveTo(-20, -40, -40, -10, 0, 20);
            ctx.bezierCurveTo(40, -10, 20, -40, 0, -20);
            ctx.fill();
            ctx.restore();
        } else {
            ctx.beginPath();
            ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalAlpha = 1;
    }
}

// Firework class
class Firework {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.particles = [];
        this.createParticles();
    }

    createParticles() {
        const colors = ['#ff004c','#fffc00','#14fc56','#00e5ff','#ff00ff'];
        const count = 20 + Math.floor(Math.random() * 15);
        for (let i=0; i<count; i++){
            const t = (i / count) * Math.PI * 2;
            const hx = 16 * Math.pow(Math.sin(t),3);
            const hy = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
            const scale = 2.5;
            const xOff = hx * scale;
            const yOff = hy * scale;
            const angle = Math.atan2(yOff, xOff);
            const speed = Math.sqrt(xOff*xOff + yOff*yOff)/25;
            const color = colors[Math.floor(Math.random()*colors.length)];
            this.particles.push(new Particle(this.x, this.y, color, angle, speed, 50, "heart"));
        }
    }

    update() {
        this.particles.forEach(p => p.update());
        this.particles = this.particles.filter(p => p.life > 0);
    }

    draw() {
        this.particles.forEach(p => p.draw());
    }

    isDead() {
        return this.particles.length === 0;
    }
}

// Animate fireworks
function animate() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    fireworks.forEach((fw, index) => {
        fw.update();
        fw.draw();
        if(fw.isDead()) fireworks.splice(index,1);
    });
    requestAnimationFrame(animate);
}
animate();

// Auto-launch fireworks
setInterval(() => {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height * 0.5;
    fireworks.push(new Firework(x, y));
}, 1200);

// Mouse interaction
card.addEventListener('mouseenter', (e)=>{
    fireworks.push(new Firework(canvas.width/2, canvas.height/2));
});

card.addEventListener('mousemove', (e)=>{
    const rect = card.getBoundingClientRect();
    fireworks.push(new Firework(e.clientX - rect.left, e.clientY - rect.top));
});

card.addEventListener('click', (e)=>{
    const rect = card.getBoundingClientRect();
    fireworks.push(new Firework(e.clientX - rect.left, e.clientY - rect.top));
});
