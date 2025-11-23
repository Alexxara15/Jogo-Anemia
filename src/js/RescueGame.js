export class RescueGame {
    constructor(canvasId, onRescueAttempt, onGameOver, audioManager) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.onRescueAttempt = onRescueAttempt;
        this.onGameOver = onGameOver;
        this.audioManager = audioManager;

        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;

        // Game State
        this.state = 'IDLE'; // IDLE, DROPPING_ROPE, PULLING_UP, SNAP_ROPE, SUCKING_IN, MOVING_SHIP
        this.gameActive = false;
        this.isPaused = false;
        this.lastTime = 0;

        // Entities
        this.ship = { x: this.width / 2, y: 80, size: 40, targetX: this.width / 2 };
        this.astronaut = {
            x: this.width / 2,
            y: this.height - 150,
            size: 20,
            angle: 0,
            color: '#ffffff',
            visible: true
        };
        this.blackHole = {
            x: this.width / 2,
            y: this.height + 100, // Slightly off-screen bottom
            radius: 150,
            angle: 0
        };
        this.rope = {
            length: 0,
            targetLength: 0,
            connected: false,
            snapped: false
        };

        this.stars = [];
        this.colors = ['#ffffff', '#ff0000', '#00ff00', '#ffff00', '#00ffff', '#ff00ff'];

        this.initStars();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.initStars();

        // Recenter elements if resizing during idle
        if (this.state === 'IDLE') {
            this.ship.x = this.width / 2;
            this.ship.y = 80;
            this.astronaut.x = this.width / 2;
            this.astronaut.y = this.height - 150;
            this.blackHole.x = this.width / 2;
            this.blackHole.y = this.height + 100;
        }
    }

    initStars() {
        this.stars = [];
        for (let i = 0; i < 100; i++) {
            this.stars.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                size: Math.random() * 2,
                speed: Math.random() * 0.5 + 0.1
            });
        }
    }

    start() {
        this.gameActive = true;
        this.isPaused = false;
        this.state = 'IDLE';
        this.lastTime = performance.now();
        this.loop(this.lastTime);
    }

    spawnObstacle() {
        // Reset for next question
        this.state = 'IDLE';
        this.astronaut.visible = true;
        this.astronaut.y = this.height - 150;
        this.astronaut.x = this.width / 2; // Centered below ship
        this.astronaut.angle = 0;
        this.astronaut.color = this.colors[Math.floor(Math.random() * this.colors.length)];

        this.rope.length = 0;
        this.rope.connected = false;
        this.rope.snapped = false;

        // Trigger question
        setTimeout(() => {
            this.onRescueAttempt();
        }, 1000);
    }

    destroyCurrentObstacle(onComplete) {
        // Success: Drop rope and pull up
        this.state = 'DROPPING_ROPE';
        this.rope.targetLength = (this.astronaut.y - this.ship.y);
        this.onRescueComplete = onComplete;

        // Play rope descending sound
        if (this.audioManager) this.audioManager.playSound('ropeDescend');
    }

    triggerImpact() {
        // Fail: Snap rope (if connected) or just suck in
        this.state = 'SNAP_ROPE';
        this.rope.snapped = true;

        // Play black hole pull sound
        if (this.audioManager) this.audioManager.playSound('blackHolePull');

        setTimeout(() => {
            this.state = 'SUCKING_IN';
        }, 500);
    }

    update(dt) {
        if (this.isPaused) return;

        // Background stars - wrap around edges
        this.stars.forEach(star => {
            star.y -= star.speed; // Vertical scroll effect
            if (star.y < 0) star.y = this.height;

            // Wrap horizontally too
            if (star.x < 0) star.x = this.width;
            if (star.x > this.width) star.x = 0;
        });

        // Black Hole Rotation
        this.blackHole.angle += 0.02;

        // State Machine
        switch (this.state) {
            case 'IDLE':
                this.astronaut.y = (this.height - 150) + Math.sin(Date.now() / 500) * 5;
                break;

            case 'DROPPING_ROPE':
                this.rope.length += 20; // Speed of rope drop
                if (this.rope.length >= this.rope.targetLength) {
                    this.rope.length = this.rope.targetLength;
                    this.rope.connected = true;
                    this.state = 'PULLING_UP';
                }
                break;

            case 'PULLING_UP':
                this.rope.length -= 10; // Pull speed
                this.astronaut.y = this.ship.y + this.rope.length;
                this.astronaut.angle += 0.1; // Spin joyfully

                // Play rope ascending sound once when starting to pull
                if (!this.ropeSoundPlayed) {
                    if (this.audioManager) this.audioManager.playSound('ropeAscend');
                    this.ropeSoundPlayed = true;
                }

                if (this.rope.length <= 40) { // Close enough
                    this.astronaut.visible = false;
                    this.state = 'MOVING_SHIP';
                    this.ropeSoundPlayed = false; // Reset for next rescue
                }
                break;

            case 'MOVING_SHIP':
                // Simulate moving to next spot (background scrolls faster, ship moves slightly)
                this.stars.forEach(s => s.x -= 5);

                // Wait a bit then finish
                if (!this.moveTimer) this.moveTimer = Date.now();
                if (Date.now() - this.moveTimer > 1500) {
                    this.moveTimer = null;
                    if (this.onRescueComplete) {
                        this.onRescueComplete();
                        this.onRescueComplete = null;
                    }
                }
                break;

            case 'SNAP_ROPE':
                // Visual snap effect handled in draw
                break;

            case 'SUCKING_IN':
                // Move astronaut towards black hole center
                const dx = this.blackHole.x - this.astronaut.x;
                const dy = this.blackHole.y - this.astronaut.y;
                this.astronaut.x += dx * 0.05;
                this.astronaut.y += dy * 0.05;
                this.astronaut.angle += 0.2; // Spin faster
                this.astronaut.size *= 0.99; // Shrink

                if (this.astronaut.y > this.height) {
                    if (this.onGameOver) this.onGameOver();
                }
                break;
        }
    }

    draw() {
        // Solid black background
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(0, 0, this.width, this.height);

        // Stars
        this.ctx.fillStyle = '#ffffff';
        this.stars.forEach(star => {
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            this.ctx.fill();
        });


        // Black Hole - Enhanced Version
        this.ctx.save();
        this.ctx.translate(this.blackHole.x, this.blackHole.y);
        this.ctx.rotate(this.blackHole.angle);

        // Outer glow (gravitational lensing effect)
        const outerGlow = this.ctx.createRadialGradient(0, 0, 150, 0, 0, 250);
        outerGlow.addColorStop(0, 'rgba(138, 43, 226, 0.3)'); // Purple glow
        outerGlow.addColorStop(0.5, 'rgba(75, 0, 130, 0.2)'); // Indigo
        outerGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');

        this.ctx.fillStyle = outerGlow;
        this.ctx.beginPath();
        this.ctx.arc(0, 0, 250, 0, Math.PI * 2);
        this.ctx.fill();

        // Accretion Disk - Multiple layers for depth
        // Layer 1: Outer disk (red-orange)
        const disk1 = this.ctx.createRadialGradient(0, 0, 100, 0, 0, 180);
        disk1.addColorStop(0, 'rgba(255, 69, 0, 0)');
        disk1.addColorStop(0.3, 'rgba(255, 69, 0, 0.6)'); // Red-orange
        disk1.addColorStop(0.6, 'rgba(255, 140, 0, 0.4)'); // Dark orange
        disk1.addColorStop(1, 'rgba(0, 0, 0, 0)');

        this.ctx.fillStyle = disk1;
        this.ctx.beginPath();
        this.ctx.arc(0, 0, 180, 0, Math.PI * 2);
        this.ctx.fill();

        // Layer 2: Middle disk (yellow-white hot)
        const disk2 = this.ctx.createRadialGradient(0, 0, 70, 0, 0, 130);
        disk2.addColorStop(0, 'rgba(255, 255, 255, 0)');
        disk2.addColorStop(0.3, 'rgba(255, 255, 100, 0.8)'); // Hot yellow
        disk2.addColorStop(0.7, 'rgba(255, 165, 0, 0.5)'); // Orange
        disk2.addColorStop(1, 'rgba(0, 0, 0, 0)');

        this.ctx.fillStyle = disk2;
        this.ctx.beginPath();
        this.ctx.arc(0, 0, 130, 0, Math.PI * 2);
        this.ctx.fill();

        // Spiral arms in accretion disk
        this.ctx.strokeStyle = 'rgba(255, 100, 0, 0.3)';
        this.ctx.lineWidth = 3;
        for (let i = 0; i < 3; i++) {
            this.ctx.beginPath();
            for (let angle = 0; angle < Math.PI * 4; angle += 0.1) {
                const r = 80 + angle * 8;
                const x = Math.cos(angle + i * Math.PI * 2 / 3) * r;
                const y = Math.sin(angle + i * Math.PI * 2 / 3) * r;
                if (angle === 0) {
                    this.ctx.moveTo(x, y);
                } else {
                    this.ctx.lineTo(x, y);
                }
            }
            this.ctx.stroke();
        }

        // Photon sphere (bright ring)
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.arc(0, 0, 75, 0, Math.PI * 2);
        this.ctx.stroke();

        // Pulsing inner glow
        const pulseIntensity = 0.5 + Math.sin(Date.now() / 200) * 0.3;
        const innerGlow = this.ctx.createRadialGradient(0, 0, 40, 0, 0, 70);
        innerGlow.addColorStop(0, `rgba(138, 43, 226, ${pulseIntensity})`); // Purple
        innerGlow.addColorStop(0.5, `rgba(75, 0, 130, ${pulseIntensity * 0.6})`);
        innerGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');

        this.ctx.fillStyle = innerGlow;
        this.ctx.beginPath();
        this.ctx.arc(0, 0, 70, 0, Math.PI * 2);
        this.ctx.fill();

        // Event Horizon (pure black center)
        this.ctx.fillStyle = '#000000';
        this.ctx.beginPath();
        this.ctx.arc(0, 0, 50, 0, Math.PI * 2);
        this.ctx.fill();

        // Event horizon edge glow
        this.ctx.strokeStyle = 'rgba(138, 43, 226, 0.9)';
        this.ctx.lineWidth = 3;
        this.ctx.stroke();

        this.ctx.restore();

        // Rope
        if (this.state === 'DROPPING_ROPE' || this.state === 'PULLING_UP' || this.state === 'SNAP_ROPE') {
            this.ctx.strokeStyle = this.state === 'SNAP_ROPE' ? '#ff0000' : '#ffffff';
            this.ctx.lineWidth = 3;
            this.ctx.beginPath();
            this.ctx.moveTo(this.ship.x, this.ship.y + 20);

            if (this.state === 'SNAP_ROPE') {
                // Draw broken rope
                this.ctx.lineTo(this.ship.x + (Math.random() - 0.5) * 20, this.ship.y + 100);
            } else {
                this.ctx.lineTo(this.ship.x, this.ship.y + this.rope.length);
            }
            this.ctx.stroke();
        }

        // Ship - Industrial Rescue Ship
        this.ctx.save();
        this.ctx.translate(this.ship.x, this.ship.y);

        // Hull (Industrial Grey/Yellow)
        this.ctx.fillStyle = '#444';
        this.ctx.beginPath();
        this.ctx.moveTo(-30, -20);
        this.ctx.lineTo(30, -20);
        this.ctx.lineTo(35, 10);
        this.ctx.lineTo(20, 25);
        this.ctx.lineTo(-20, 25);
        this.ctx.lineTo(-35, 10);
        this.ctx.closePath();
        this.ctx.fill();

        // Warning Stripes
        this.ctx.fillStyle = '#feda4a';
        this.ctx.beginPath();
        this.ctx.moveTo(-30, -15);
        this.ctx.lineTo(30, -15);
        this.ctx.lineTo(30, -10);
        this.ctx.lineTo(-30, -10);
        this.ctx.fill();

        // Cockpit
        this.ctx.fillStyle = '#00ffff';
        this.ctx.beginPath();
        this.ctx.rect(-15, -5, 30, 10);
        this.ctx.fill();

        // Thrusters (Hovering)
        this.ctx.fillStyle = `rgba(0, 255, 255, ${0.5 + Math.random() * 0.5})`;
        this.ctx.beginPath();
        this.ctx.arc(-25, 25, 5 + Math.random() * 2, 0, Math.PI * 2);
        this.ctx.arc(25, 25, 5 + Math.random() * 2, 0, Math.PI * 2);
        this.ctx.fill();

        // Crane/Winch Mechanism
        this.ctx.fillStyle = '#666';
        this.ctx.fillRect(-8, 20, 16, 10);
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(-8, 20, 16, 10);

        this.ctx.restore();

        // Astronaut - Detailed
        if (this.astronaut.visible) {
            this.ctx.save();
            this.ctx.translate(this.astronaut.x, this.astronaut.y);
            this.ctx.rotate(this.astronaut.angle);

            // Backpack (Life Support)
            this.ctx.fillStyle = '#ccc';
            this.ctx.fillRect(-12, -15, 24, 30);

            // Suit Body
            this.ctx.fillStyle = this.astronaut.color;
            this.ctx.beginPath();
            this.ctx.roundRect(-10, -15, 20, 30, 5);
            this.ctx.fill();

            // Helmet
            this.ctx.fillStyle = '#fff';
            this.ctx.beginPath();
            this.ctx.arc(0, -15, 12, 0, Math.PI * 2);
            this.ctx.fill();

            // Visor (Gold/Reflective)
            this.ctx.fillStyle = '#ffd700';
            this.ctx.beginPath();
            this.ctx.ellipse(0, -15, 8, 6, 0, 0, Math.PI * 2);
            this.ctx.fill();

            // Glare on Visor
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            this.ctx.beginPath();
            this.ctx.ellipse(-3, -17, 2, 1, 0.5, 0, Math.PI * 2);
            this.ctx.fill();

            // Limbs (Simple rounded rects for now)
            this.ctx.fillStyle = this.astronaut.color;
            // Arms
            this.ctx.beginPath();
            this.ctx.arc(-12, -5, 4, 0, Math.PI * 2);
            this.ctx.arc(12, -5, 4, 0, Math.PI * 2);
            this.ctx.fill();
            // Legs
            this.ctx.beginPath();
            this.ctx.arc(-6, 18, 4, 0, Math.PI * 2);
            this.ctx.arc(6, 18, 4, 0, Math.PI * 2);
            this.ctx.fill();

            // Help Text
            if (this.state === 'IDLE' || this.state === 'SUCKING_IN') {
                this.ctx.fillStyle = '#ff0000';
                this.ctx.font = '12px Arial';
                this.ctx.textAlign = 'center';
                this.ctx.fillText(this.state === 'SUCKING_IN' ? 'AAAAHH!' : 'HELP!', 0, -35);
            }

            this.ctx.restore();
        }

        // Rescue Text
        if (this.state === 'PULLING_UP') {
            this.ctx.fillStyle = '#00ff00';
            this.ctx.font = '20px "Press Start 2P"';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('RESCUING...', this.width / 2, this.height / 2);
        }
    }

    loop(timestamp) {
        const dt = timestamp - this.lastTime;
        this.lastTime = timestamp;

        this.update(dt);
        this.draw();

        if (this.gameActive) {
            requestAnimationFrame((t) => this.loop(t));
        }
    }

    stop() {
        this.gameActive = false;
    }
}
