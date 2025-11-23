export class AudioManager {
    constructor() {
        this.audioContext = null;
        this.sounds = {};
        this.ambientOscillator = null;
        this.ambientGain = null;
        this.masterVolume = 0.3;
        this.muted = false;
        this.initialized = false;
    }

    async init() {
        if (this.initialized) return;

        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.initialized = true;

            this.createBeepSound();
            this.createClickSound();
            this.createVictorySound();
            this.createDefeatSound();
            this.createCorrectAnswerSound();
            this.createWrongAnswerSound();
            this.createLaserSound();
            this.createExplosionSound();
            this.createShipExplosionSound();
            this.createBlackHolePullSound();
            this.createRopeDescendSound();
            this.createRopeAscendSound();
        } catch (error) {
            console.warn('Audio initialization failed:', error);
        }
    }

    startAmbient() {
        if (!this.audioContext || this.muted) return;

        try {
            if (this.audioContext.state === 'suspended') {
                this.audioContext.resume();
            }

            this.ambientOscillator = this.audioContext.createOscillator();
            this.ambientGain = this.audioContext.createGain();

            this.ambientOscillator.type = 'sine';
            this.ambientOscillator.frequency.setValueAtTime(55, this.audioContext.currentTime);

            this.ambientGain.gain.setValueAtTime(0, this.audioContext.currentTime);
            this.ambientGain.gain.linearRampToValueAtTime(
                this.masterVolume * 0.1,
                this.audioContext.currentTime + 2
            );

            this.ambientOscillator.connect(this.ambientGain);
            this.ambientGain.connect(this.audioContext.destination);
            this.ambientOscillator.start();
        } catch (error) {
            console.warn('Ambient sound failed:', error);
        }
    }

    stopAmbient() {
        if (this.ambientOscillator) {
            try {
                this.ambientGain.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 1);
                setTimeout(() => {
                    if (this.ambientOscillator) {
                        this.ambientOscillator.stop();
                        this.ambientOscillator = null;
                    }
                }, 1000);
            } catch (error) {
                console.warn('Stop ambient failed:', error);
            }
        }
    }

    startIntroAmbient() {
        // No intro sound - user preference
    }

    playIntroMelodyOnce() {
        // No intro sound - user preference
    }

    stopIntroAmbient() {
        // No intro sound - user preference
    }

    createBeepSound() {
        this.sounds.beep = () => {
            if (!this.audioContext || this.muted) return;
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(800, this.audioContext.currentTime);
            gain.gain.setValueAtTime(this.masterVolume * 0.1, this.audioContext.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
            osc.connect(gain);
            gain.connect(this.audioContext.destination);
            osc.start();
            osc.stop(this.audioContext.currentTime + 0.1);
        };
    }

    createClickSound() {
        this.sounds.click = () => {
            if (!this.audioContext || this.muted) return;
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();
            osc.type = 'square';
            osc.frequency.setValueAtTime(400, this.audioContext.currentTime);
            osc.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + 0.1);
            gain.gain.setValueAtTime(this.masterVolume * 0.2, this.audioContext.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
            osc.connect(gain);
            gain.connect(this.audioContext.destination);
            osc.start();
            osc.stop(this.audioContext.currentTime + 0.1);
        };
    }

    createVictorySound() {
        this.sounds.victory = () => {
            if (!this.audioContext || this.muted) return;
            const notes = [523.25, 659.25, 783.99];
            const startTime = this.audioContext.currentTime;
            notes.forEach((freq, i) => {
                const osc = this.audioContext.createOscillator();
                const gain = this.audioContext.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, startTime + i * 0.15);
                gain.gain.setValueAtTime(0, startTime + i * 0.15);
                gain.gain.linearRampToValueAtTime(this.masterVolume * 0.3, startTime + i * 0.15 + 0.05);
                gain.gain.exponentialRampToValueAtTime(0.01, startTime + i * 0.15 + 0.4);
                osc.connect(gain);
                gain.connect(this.audioContext.destination);
                osc.start(startTime + i * 0.15);
                osc.stop(startTime + i * 0.15 + 0.4);
            });
        };
    }

    createDefeatSound() {
        this.sounds.defeat = () => {
            if (!this.audioContext || this.muted) return;
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(400, this.audioContext.currentTime);
            osc.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + 0.5);
            gain.gain.setValueAtTime(this.masterVolume * 0.3, this.audioContext.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);
            osc.connect(gain);
            gain.connect(this.audioContext.destination);
            osc.start();
            osc.stop(this.audioContext.currentTime + 0.5);
        };
    }

    createCorrectAnswerSound() {
        this.sounds.correctAnswer = () => {
            if (!this.audioContext || this.muted) return;
            // Ascending arpeggio for correct answer
            const notes = [523.25, 659.25]; // C, E
            const startTime = this.audioContext.currentTime;
            notes.forEach((freq, i) => {
                const osc = this.audioContext.createOscillator();
                const gain = this.audioContext.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, startTime + i * 0.08);
                gain.gain.setValueAtTime(0, startTime + i * 0.08);
                gain.gain.linearRampToValueAtTime(this.masterVolume * 0.25, startTime + i * 0.08 + 0.02);
                gain.gain.exponentialRampToValueAtTime(0.01, startTime + i * 0.08 + 0.2);
                osc.connect(gain);
                gain.connect(this.audioContext.destination);
                osc.start(startTime + i * 0.08);
                osc.stop(startTime + i * 0.08 + 0.2);
            });
        };
    }

    createWrongAnswerSound() {
        this.sounds.wrongAnswer = () => {
            if (!this.audioContext || this.muted) return;
            // Descending tone for wrong answer
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();
            osc.type = 'square';
            osc.frequency.setValueAtTime(300, this.audioContext.currentTime);
            osc.frequency.exponentialRampToValueAtTime(150, this.audioContext.currentTime + 0.3);
            gain.gain.setValueAtTime(this.masterVolume * 0.25, this.audioContext.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
            osc.connect(gain);
            gain.connect(this.audioContext.destination);
            osc.start();
            osc.stop(this.audioContext.currentTime + 0.3);
        };
    }

    playSound(soundName) {
        if (this.sounds[soundName]) {
            this.sounds[soundName]();
        }
    }

    toggleMute() {
        this.muted = !this.muted;
        if (this.muted) {
            this.stopAmbient();
        }
        return this.muted;
    }

    setVolume(volume) {
        this.masterVolume = Math.max(0, Math.min(1, volume));
    }

    createLaserSound() {
        this.sounds.laser = () => {
            if (!this.audioContext || this.muted) return;
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(800, this.audioContext.currentTime);
            osc.frequency.exponentialRampToValueAtTime(200, this.audioContext.currentTime + 0.1);
            gain.gain.setValueAtTime(this.masterVolume * 0.2, this.audioContext.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
            osc.connect(gain);
            gain.connect(this.audioContext.destination);
            osc.start();
            osc.stop(this.audioContext.currentTime + 0.1);
        };
    }

    createExplosionSound() {
        this.sounds.explosion = () => {
            if (!this.audioContext || this.muted) return;
            const bufferSize = this.audioContext.sampleRate * 0.3;
            const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
            }
            const noise = this.audioContext.createBufferSource();
            noise.buffer = buffer;
            const filter = this.audioContext.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(1000, this.audioContext.currentTime);
            filter.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + 0.3);
            const gain = this.audioContext.createGain();
            gain.gain.setValueAtTime(this.masterVolume * 0.3, this.audioContext.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
            noise.connect(filter);
            filter.connect(gain);
            gain.connect(this.audioContext.destination);
            noise.start();
            noise.stop(this.audioContext.currentTime + 0.3);
        };
    }

    createShipExplosionSound() {
        this.sounds.shipExplosion = () => {
            if (!this.audioContext || this.muted) return;
            const bufferSize = this.audioContext.sampleRate * 0.8;
            const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = Math.random() * 2 - 1;
            }
            const noise = this.audioContext.createBufferSource();
            noise.buffer = buffer;
            const filter = this.audioContext.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(2000, this.audioContext.currentTime);
            filter.frequency.exponentialRampToValueAtTime(50, this.audioContext.currentTime + 0.8);
            const gain = this.audioContext.createGain();
            gain.gain.setValueAtTime(this.masterVolume * 0.5, this.audioContext.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.8);
            noise.connect(filter);
            filter.connect(gain);
            gain.connect(this.audioContext.destination);
            noise.start();
            noise.stop(this.audioContext.currentTime + 0.8);
        };
    }

    createBlackHolePullSound() {
        this.sounds.blackHolePull = () => {
            if (!this.audioContext || this.muted) return;
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(300, this.audioContext.currentTime);
            osc.frequency.exponentialRampToValueAtTime(50, this.audioContext.currentTime + 1.5);
            gain.gain.setValueAtTime(this.masterVolume * 0.3, this.audioContext.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 1.5);
            osc.connect(gain);
            gain.connect(this.audioContext.destination);
            osc.start();
            osc.stop(this.audioContext.currentTime + 1.5);
        };
    }

    createRopeDescendSound() {
        this.sounds.ropeDescend = () => {
            if (!this.audioContext || this.muted) return;
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();
            osc.type = 'square';
            osc.frequency.setValueAtTime(150, this.audioContext.currentTime);
            osc.frequency.linearRampToValueAtTime(120, this.audioContext.currentTime + 0.5);
            gain.gain.setValueAtTime(this.masterVolume * 0.15, this.audioContext.currentTime);
            gain.gain.linearRampToValueAtTime(this.masterVolume * 0.15, this.audioContext.currentTime + 0.5);
            gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.6);
            osc.connect(gain);
            gain.connect(this.audioContext.destination);
            osc.start();
            osc.stop(this.audioContext.currentTime + 0.6);
        };
    }

    createRopeAscendSound() {
        this.sounds.ropeAscend = () => {
            if (!this.audioContext || this.muted) return;
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();
            osc.type = 'square';
            osc.frequency.setValueAtTime(120, this.audioContext.currentTime);
            osc.frequency.linearRampToValueAtTime(180, this.audioContext.currentTime + 0.8);
            gain.gain.setValueAtTime(this.masterVolume * 0.15, this.audioContext.currentTime);
            gain.gain.linearRampToValueAtTime(this.masterVolume * 0.15, this.audioContext.currentTime + 0.8);
            gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.9);
            osc.connect(gain);
            gain.connect(this.audioContext.destination);
            osc.start();
            osc.stop(this.audioContext.currentTime + 0.9);
        };
    }
}
