export class ArcadeGame {
    constructor(canvasId, onObstacleEncountered, onGameOver, audioManager) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.onObstacleEncountered = onObstacleEncountered;
        this.onGameOver = onGameOver;
        this.audioManager = audioManager;

        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;

        this.ship = { x: 100, y: this.height / 2, size: 30, speed: 5, visible: true };
        this.asteroids = [];
        this.stars = [];
        this.lasers = [];
        this.particles = [];

        this.gameActive = false;
        this.isPaused = false;
        this.lastTime = 0;
        this.spawnTimer = 0;
        this.obstaclePending = false;
        this.isCrashing = false; // Flag for dramatic crash speed

        this.onObstacleDestroyed = null; // Callback for when doomed asteroid dies

        this.initStars();

        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.initStars();
    }

    initStars() {
        this.stars = [];
        for (let i = 0; i < 150; i++) { // More stars
            this.stars.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                size: Math.random() * 2,
                speed: Math.random() * 3 + 0.5
            });
        }
    }

    start() {
        this.gameActive = true;
        this.isPaused = false;
        this.obstaclePending = false;
        this.isCrashing = false;
        this.asteroids = [];
        this.lasers = [];
        this.particles = [];
        this.ship.visible = true;
        this.lastTime = performance.now();
        this.loop(this.lastTime);
    }

    spawnObstacle() {
        this.asteroids = this.asteroids.filter(a => !a.active);

        if (this.obstaclePending) return;

        this.asteroids.push({
            x: this.width + 200,
            y: this.height / 2,
            size: 60,
            hp: 1,
            active: true,
            doomed: false, // If true, will explode on laser contact
            spawnTime: performance.now() // Track when asteroid spawned
        });
        this.obstaclePending = true;
        this.isCrashing = false; // Reset crash speed
    }

    destroyCurrentObstacle(onComplete) {
        this.isPaused = false;

        const ast = this.asteroids.find(a => a.active);

        // Spawn fast laser
        this.lasers.push({
            x: this.ship.x + this.ship.size,
            y: this.ship.y,
            speed: 40, // Fast but trackable
            active: true
        });

        // Play laser sound
        if (this.audioManager) this.audioManager.playSound('laser');

        if (ast) {
            ast.doomed = true; // Mark for death by laser
            this.onObstacleDestroyed = onComplete; // Store callback
        } else {
            // Fallback if no asteroid
            if (onComplete) setTimeout(onComplete, 500);
        }
    }

    triggerImpact() {
        this.isPaused = false;
        this.obstaclePending = false;
        this.isCrashing = true; // Engage hyper speed for crash
    }

    destroyShip() {
        if (!this.gameActive) return;
        this.isPaused = false;

        // Play ship explosion sound
        if (this.audioManager) this.audioManager.playSound('shipExplosion');

        this.createExplosion(this.ship.x, this.ship.y, '#ff0000', 80); // Massive explosion
        this.createExplosion(this.ship.x, this.ship.y, '#ffff00', 40); // Secondary core
        this.ship.visible = false;
        this.gameActive = false;

        setTimeout(() => {
            if (this.onGameOver) this.onGameOver();
        }, 2500);
    }

    createExplosion(x, y, color, count) {
        // Shockwave
        this.particles.push({
            type: 'shockwave',
            x: x,
            y: y,
            size: 5,
            grow: 15,
            alpha: 1.0,
            color: color
        });

        // Debris
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 15 + 5;
            this.particles.push({
                type: 'debris',
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 1.0,
                decay: Math.random() * 0.03 + 0.01,
                color: color,
                size: Math.random() * 4 + 2
            });
        }
    }

    update(dt) {
        if (this.isPaused) return;

        // Background
        this.stars.forEach(star => {
            star.x -= star.speed;
            if (star.x < 0) star.x = this.width;
        });

        // Asteroids
        this.asteroids.forEach(ast => {
            if (!ast.active) return;

            // Movement logic with initial delay
            let speed = 0;
            const timeSinceSpawn = performance.now() - ast.spawnTime;

            // Only start moving after 1 second delay
            if (timeSinceSpawn > 1000) {
                speed = 5;
                if (this.isCrashing) speed = 25; // Dramatic crash speed
            }
            ast.x -= speed;

            // Trigger Question (adjusted for mobile screens)
            if (!this.isCrashing && ast.x < this.width - 150 && this.obstaclePending) {
                this.isPaused = true;
                this.obstaclePending = false;
                this.onObstacleEncountered();
            }

            // Ship Collision
            if (this.ship.visible) {
                const dx = ast.x - this.ship.x;
                const dy = ast.y - this.ship.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < (ast.size + this.ship.size) * 0.8) {
                    this.destroyShip();
                }
            }
        });

        // Lasers
        this.lasers.forEach(laser => {
            if (!laser.active) return;
            laser.x += laser.speed;
            if (laser.x > this.width) laser.active = false;

            // Check collisions with doomed asteroids
            this.asteroids.forEach(ast => {
                if (ast.active && ast.doomed) {
                    const dx = laser.x - ast.x;
                    const dy = laser.y - ast.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    // Hit!
                    if (dist < ast.size + 20) { // Generous hit box
                        ast.active = false;
                        laser.active = false;

                        // Play explosion sound
                        if (this.audioManager) this.audioManager.playSound('explosion');

                        // Fancy explosion
                        this.createExplosion(ast.x, ast.y, '#ffaa00', 40);
                        this.createExplosion(ast.x, ast.y, '#ffffff', 20);

                        // Callback
                        if (this.onObstacleDestroyed) {
                            // Small delay before next level for visual pacing
                            setTimeout(() => {
                                this.onObstacleDestroyed();
                                this.onObstacleDestroyed = null;
                            }, 1000);
                        }
                    }
                }
            });
        });

        // Particles
        this.particles.forEach(p => {
            if (p.type === 'shockwave') {
                p.size += p.grow;
                p.alpha -= 0.05;
            } else {
                p.x += p.vx;
                p.y += p.vy;
                p.life -= p.decay;
                p.vx *= 0.95; // Friction
                p.vy *= 0.95;
            }
        });
        this.particles = this.particles.filter(p => (p.type === 'shockwave' ? p.alpha > 0 : p.life > 0));
    }

    draw() {
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, this.width, this.height);

        // Stars
        this.ctx.fillStyle = '#ffffff';
        this.stars.forEach(star => {
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            this.ctx.fill();
        });

        // Ship - Fighter Jet Design
        if (this.ship.visible) {
            this.ctx.save();
            this.ctx.translate(this.ship.x, this.ship.y);

            // Engine Glow
            this.ctx.shadowBlur = 20;
            this.ctx.shadowColor = '#00ffff';
            this.ctx.fillStyle = `rgba(0, 255, 255, ${0.5 + Math.random() * 0.5})`;
            this.ctx.beginPath();
            this.ctx.moveTo(-25, -5);
            this.ctx.lineTo(-45 - Math.random() * 10, 0);
            this.ctx.lineTo(-25, 5);
            this.ctx.fill();
            this.ctx.shadowBlur = 0;

            // Main Hull (Dark Metal)
            this.ctx.fillStyle = '#2a2a2a';
            this.ctx.beginPath();
            this.ctx.moveTo(30, 0); // Nose
            this.ctx.lineTo(-20, 15); // Bottom Wing
            this.ctx.lineTo(-15, 5); // Body indent
            this.ctx.lineTo(-25, 5); // Engine block
            this.ctx.lineTo(-25, -5);
            this.ctx.lineTo(-15, -5);
            this.ctx.lineTo(-20, -15); // Top Wing
            this.ctx.closePath();
            this.ctx.fill();

            // Cockpit (Glass)
            this.ctx.fillStyle = '#00ffff';
            this.ctx.beginPath();
            this.ctx.ellipse(5, 0, 8, 4, 0, 0, Math.PI * 2);
            this.ctx.fill();

            // Wing Details (Neon Accents)
            this.ctx.strokeStyle = '#00ff00';
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.moveTo(-10, 10);
            this.ctx.lineTo(10, 0);
            this.ctx.lineTo(-10, -10);
            this.ctx.stroke();

            this.ctx.restore();
        }

        // Asteroids - Irregular Polygons
        this.asteroids.forEach(ast => {
            if (!ast.active) return;
            this.ctx.save();
            this.ctx.translate(ast.x, ast.y);
            this.ctx.rotate(ast.x * 0.02); // Slow rotation based on position

            // Generate random shape if not already generated
            if (!ast.vertices) {
                ast.vertices = [];
                const numPoints = 8 + Math.floor(Math.random() * 4);
                for (let i = 0; i < numPoints; i++) {
                    const angle = (i / numPoints) * Math.PI * 2;
                    const r = ast.size * (0.8 + Math.random() * 0.4);
                    ast.vertices.push({
                        x: Math.cos(angle) * r,
                        y: Math.sin(angle) * r
                    });
                }
            }

            // Draw Rock
            this.ctx.fillStyle = '#555';
            this.ctx.beginPath();
            ast.vertices.forEach((v, i) => {
                if (i === 0) this.ctx.moveTo(v.x, v.y);
                else this.ctx.lineTo(v.x, v.y);
            });
            this.ctx.closePath();
            this.ctx.fill();

            // Shading (Gradient)
            const grad = this.ctx.createRadialGradient(-10, -10, 5, 0, 0, ast.size);
            grad.addColorStop(0, 'rgba(255, 255, 255, 0.1)');
            grad.addColorStop(1, 'rgba(0, 0, 0, 0.4)');
            this.ctx.fillStyle = grad;
            this.ctx.fill();

            // Craters
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
            this.ctx.beginPath();
            this.ctx.arc(ast.size * 0.3, ast.size * 0.2, ast.size * 0.2, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.beginPath();
            this.ctx.arc(-ast.size * 0.4, -ast.size * 0.1, ast.size * 0.15, 0, Math.PI * 2);
            this.ctx.fill();

            this.ctx.restore();
        });

        // Lasers
        this.ctx.fillStyle = '#00ffff';
        this.ctx.shadowBlur = 10;
        this.ctx.shadowColor = '#00ffff';
        this.lasers.forEach(laser => {
            if (!laser.active) return;
            this.ctx.fillRect(laser.x, laser.y - 3, 40, 6); // Longer, thicker laser
        });
        this.ctx.shadowBlur = 0;

        // Particles
        this.particles.forEach(p => {
            if (p.type === 'shockwave') {
                this.ctx.strokeStyle = p.color;
                this.ctx.lineWidth = 3;
                this.ctx.globalAlpha = p.alpha;
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                this.ctx.stroke();
            } else {
                this.ctx.fillStyle = p.color;
                this.ctx.globalAlpha = p.life;
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                this.ctx.fill();
            }
            this.ctx.globalAlpha = 1.0;
        });
    }

    loop(timestamp) {
        const dt = timestamp - this.lastTime;
        this.lastTime = timestamp;

        this.update(dt);
        this.draw();

        if (this.gameActive || this.particles.length > 0) {
            requestAnimationFrame((t) => this.loop(t));
        }
    }

    resume() {
        this.isPaused = false;
        this.lastTime = performance.now();
    }

    stop() {
        this.gameActive = false;
        this.particles = [];
        this.asteroids = [];
        this.lasers = [];
    }
}
