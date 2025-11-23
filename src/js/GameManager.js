import { phases } from './levels.js';
import { ArcadeGame } from './ArcadeGame.js';
import { RescueGame } from './RescueGame.js';
import { AudioManager } from './AudioManager.js';

export class GameManager {
  constructor() {
    this.currentLevelIndex = 0;
    this.score = 0;
    this.mistakes = 0;
    this.gameActive = false;
    this.ui = {
      app: document.getElementById('app'),
      container: document.getElementById('game-container'),
      loading: document.getElementById('loading-screen'),
      hud: document.getElementById('hud'),
      questionPanel: document.getElementById('question-panel')
    };
    this.arcade = null;
    this.phases = phases;
    this.unlockedPhases = phases.map(p => p.id);
    this.currentPhase = null;
    this.audioManager = new AudioManager();
    this.starCanvas = null;
    this.starAnimationId = null;
  }

  init() {
    setTimeout(() => {
      this.ui.loading.classList.add('hidden');
      this.renderStartScreen();
    }, 1500);
  }

  // -------------------------------------------------------------------
  // Start screen (INSERT COIN)
  renderStartScreen() {
    this.createStarField();
    this.ui.container.innerHTML = `
      <div class="start-screen">
        <h1 class="glitch" data-text="HEMOGLOBINA ZERO">HEMOGLOBINA<br>ZERO</h1>
        <p class="subtitle">MISSÃO DE RESGATE</p>
        <div class="instructions">
          <p>OBJETIVO: RESPONDER PERGUNTAS SOBRE ANEMIA</p>
          <p>MECÂNICA: DESTRUIR ASTEROIDES E RESGATAR ASTRONAUTAS</p>
          <p>TEMA: ANEMIA E HEMOGLOBINA</p>
        </div>
        <div style="margin-bottom: 20px; color: var(--neon-yellow); font-size: 12px;">CRÉDITO 01</div>
        <button id="start-btn" class="btn pulse">INSERIR FICHA / INICIAR</button>
      </div>
    `;
    const startBtn = document.getElementById('start-btn');
    startBtn.addEventListener('mouseenter', () => this.audioManager.playSound('beep'));
    startBtn.addEventListener('click', async () => {
      await this.audioManager.init();
      this.audioManager.playSound('click');
      this.audioManager.startAmbient();
      if (this.starAnimationId) cancelAnimationFrame(this.starAnimationId);
      this.showLevelSelection();
    });
  }

  // -------------------------------------------------------------------
  // Level selection screen
  showLevelSelection() {
    this.createStarField();
    this.ui.container.innerHTML = `
      <div class="level-selection-modal">
        <h2 style="color: var(--neon-blue); text-shadow: 0 0 10px var(--neon-blue);">SELECIONAR MISSÃO</h2>
        <div class="level-grid">
          ${this.phases.map(phase => {
      const locked = !this.unlockedPhases.includes(phase.id);
      return `
              <div class="level-card ${locked ? 'locked' : ''}" data-id="${phase.id}">
                ${locked ? '<div class="lock-icon">🔒</div>' : ''}
                <h3>${phase.name}</h3>
                <p>${locked ? 'BLOQUEADO' : `${phase.levels.length} PERGUNTAS`}</p>
              </div>`;
    }).join('')}
        </div>
        <button id="back-btn" class="btn back-btn">VOLTAR</button>
      </div>
    `;
    document.querySelectorAll('.level-card').forEach(card => {
      card.addEventListener('click', () => {
        const id = parseInt(card.dataset.id);
        console.log('Level card clicked, id:', id);
        if (this.unlockedPhases.includes(id)) {
          console.log('Starting game for phase', id);
          this.startGame(id);
        } else {
          console.log('Phase locked:', id);
        }
      });
    });
    document.getElementById('back-btn').addEventListener('click', () => {
      console.log('Back button clicked, returning to start screen');
      this.renderStartScreen();
    });
  }

  // -------------------------------------------------------------------
  // Start a specific phase (called from level selection)
  startGame(phaseId) {
    this.currentPhase = this.phases.find(p => p.id === phaseId);

    // Check if this phase has been visited in this session
    const visitedPhasesKey = 'visitedPhases';
    const visitedPhases = JSON.parse(sessionStorage.getItem(visitedPhasesKey) || '[]');

    if (visitedPhases.includes(phaseId)) {
      // Skip intro if already visited
      this.actuallyStartGame(phaseId);
    } else {
      // Show intro for first-time visit
      visitedPhases.push(phaseId);
      sessionStorage.setItem(visitedPhasesKey, JSON.stringify(visitedPhases));
      this.showStoryIntro(phaseId);
    }
  }

  // -------------------------------------------------------------------
  // Star‑Wars style story intro (crawl) – Portuguese text
  showStoryIntro(phaseId) {
    const stories = {
      1: {
        title: "CRISE DE ASTEROIDES",
        text: `Sua tripulação entrou em um perigoso campo de asteroides enquanto transportava suprimentos para anêmicos críticos.

O sistema de navegação falhou e os asteroides estão se aproximando rapidamente.

Você deve responder corretamente às perguntas sobre anemia para destruir os asteroides e salvar sua tripulação.

Uma resposta errada significa destruição certa...`
      },
      2: {
        title: "RESGATE DO BURACO NEGRO",
        text: `Um enorme buraco negro apareceu próximo à estação de saúde intergaláctica, puxando astronautas para sua gravidade.

Você está pilotando a nave de resgate HEMO-1, equipada com um sistema de cabo de emergência.

Responda corretamente às perguntas para acionar a corda de resgate e salvar os astronautas.

Falhar significa que eles serão perdidos para sempre no horizonte de eventos do buraco negro...`
      }
    };
    const story = stories[phaseId];
    this.ui.container.innerHTML = `
      <div class="story-intro">
        <div class="crawl-container">
          <div class="crawl-text">
            <h1>${story.title}</h1>
            <p>${story.text.replace(/\n/g, '<br>')}</p>
          </div>
        </div>
        <button id="start-mission-btn" class="btn pulse" style="display:none; margin-top:20px;">INICIAR MISSÃO</button>
      </div>
    `;

    // Start subtle space ambient sound
    this.audioManager.startIntroAmbient();

    // Show button after 30s (matched to CSS animation duration)
    setTimeout(() => {
      const btn = document.getElementById('start-mission-btn');
      if (btn) btn.style.display = 'inline-block';
    }, 30000);
    document.getElementById('start-mission-btn').addEventListener('click', () => {
      this.audioManager.playSound('click');
      this.audioManager.stopIntroAmbient(); // Stop intro ambient
      this.actuallyStartGame(phaseId);
    });
  }

  // -------------------------------------------------------------------
  // Initialize the actual gameplay after intro
  actuallyStartGame(phaseId) {
    this.removeStarField();
    this.currentPhase = this.phases.find(p => p.id === phaseId);
    this.currentLevelIndex = 0;
    this.score = 0;
    this.mistakes = 0;
    this.gameActive = true;
    this.ui.container.innerHTML = `
      <canvas id="game-canvas"></canvas>
      <div id="hud" class="hud">
        <div class="score">SCORE: <span id="score-val">0</span></div>
        <div style="font-size: 12px; margin-top: 5px; color: var(--neon-blue);">
          ${this.currentPhase.name}
        </div>
      </div>
      <div id="question-panel" class="question-panel hidden"></div>
    `;
    if (this.currentPhase.id === 1) {
      this.arcade = new ArcadeGame('game-canvas', () => this.showQuestion(), () => this.showEndScreen(false), this.audioManager);
    } else {
      this.arcade = new RescueGame('game-canvas', () => this.showQuestion(), () => this.showEndScreen(false), this.audioManager);
    }
    this.arcade.start();
    setTimeout(() => this.arcade.spawnObstacle(), 2000);
  }

  // -------------------------------------------------------------------
  // Show a question during gameplay
  showQuestion() {
    const level = this.currentPhase.levels[this.currentLevelIndex];
    if (!level) { this.showEndScreen(true); return; }
    const panel = document.getElementById('question-panel');
    panel.innerHTML = `
      <div class="panel-content">
        <h2>${this.currentPhase.id === 2 ? 'ASTRONAUTA EM PERIGO!' : 'ALERTA DE COLISÃO!'}</h2>
        <p class="description">${level.description}</p>
        ${this.renderLevelData(level)}
        <div class="options-grid">
          ${level.options.map(opt => `<button class="option-btn" data-id="${opt.id}">${opt.text}</button>`).join('')}
        </div>
        <div id="feedback-area" class="hidden"></div>
      </div>
    `;
    panel.classList.remove('hidden');
    this.attachEvents(level);
  }

  renderLevelData(level) {
    if (!level.data) return '';
    return `
      <div class="data-panel">
        <ul>
          ${Object.entries(level.data).map(([k, v]) => `<li><strong>${k.toUpperCase()}:</strong> ${v}</li>`).join('')}
        </ul>
      </div>
    `;
  }

  attachEvents(level) {
    const panel = document.getElementById('question-panel');
    const buttons = panel.querySelectorAll('.option-btn');
    const feedback = panel.querySelector('#feedback-area');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        this.disableAllButtons();
        const opt = level.options.find(o => o.id === btn.dataset.id);
        if (opt && opt.correct) {
          btn.classList.add('correct');
          this.audioManager.playSound('correctAnswer'); // Play correct sound
          this.handleSuccess(feedback, level.successMessage);
        } else {
          btn.classList.add('wrong');
          this.audioManager.playSound('wrongAnswer'); // Play wrong sound
          const correctBtn = Array.from(buttons).find(b => {
            const o = level.options.find(o => o.id === b.dataset.id);
            return o && o.correct;
          });
          if (correctBtn) correctBtn.classList.add('correct');
          this.mistakes++;
          this.handleFail(feedback, level.failMessage);
        }
      });
    });
  }

  handleSuccess(feedback, msg) {
    setTimeout(() => {
      document.getElementById('question-panel').classList.add('hidden');
      this.score += 100;
      this.updateScore();
      this.arcade.destroyCurrentObstacle(() => this.nextLevel());
    }, 1500);
  }

  handleFail(feedback, msg) {
    setTimeout(() => {
      document.getElementById('question-panel').classList.add('hidden');
      this.arcade.triggerImpact();
    }, 2000);
  }

  nextLevel() {
    this.currentLevelIndex++;
    if (this.currentLevelIndex >= this.currentPhase.levels.length) {
      this.handlePhaseComplete();
    } else {
      this.arcade.spawnObstacle();
    }
  }

  updateScore() {
    document.getElementById('score-val').textContent = this.score;
  }

  disableAllButtons() {
    document.querySelectorAll('.option-btn').forEach(b => b.disabled = true);
  }

  handlePhaseComplete() {
    const nextId = this.currentPhase.id + 1;
    const nextPhase = this.phases.find(p => p.id === nextId);
    if (nextPhase && !this.unlockedPhases.includes(nextId)) this.unlockedPhases.push(nextId);
    setTimeout(() => this.showEndScreen(true), 1000);
  }

  // -------------------------------------------------------------------
  // End screen (victory / game over)
  showEndScreen(victory) {
    if (this.arcade) { this.arcade.stop(); this.arcade = null; }
    this.createStarField();
    const color = victory ? 'var(--neon-green)' : 'var(--neon-red)';
    const title = victory ? 'MISSÃO CUMPRIDA' : 'FIM DE JOGO';
    const msg = victory ? 'SETOR LIMPO. BOM TRABALHO, CADETE.' : 'MISSÃO FALHOU. PACIENTE CRÍTICO.';
    this.ui.container.innerHTML = `
      <div class="end-screen">
        <h1 style="color: ${color}; text-shadow: 4px 4px 0 #444;">${title}</h1>
        <p>${msg}</p>
        <div class="final-score">PONTUAÇÃO<br><span style="font-size: 32px;">${this.score}</span></div>
        <button id="restart-btn" class="btn pulse">${victory ? 'PRÓXIMA MISSÃO' : 'TENTAR NOVAMENTE'}</button>
      </div>
    `;

    // Play appropriate sound
    if (victory) {
      this.audioManager.playSound('victory');
    } else {
      this.audioManager.playSound('defeat');
    }

    document.getElementById('restart-btn').addEventListener('click', () => {
      this.audioManager.playSound('click');
      this.showLevelSelection(); // Go back to level selection, not start screen
    });
  }

  // -------------------------------------------------------------------
  // Star field helpers (background)
  createStarField() {
    const existing = document.querySelector('.stars');
    if (existing) existing.remove();
    const container = document.createElement('div');
    container.className = 'stars';
    const canvas = document.createElement('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    container.appendChild(canvas);
    document.body.insertBefore(container, document.body.firstChild);
    this.starCanvas = canvas;
    const ctx = canvas.getContext('2d');
    const stars = [];
    for (let i = 0; i < 200; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5,
        speed: Math.random() * 0.5 + 0.1,
        opacity: Math.random()
      });
    }
    const animate = () => {
      ctx.fillStyle = 'rgba(0,0,0,0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      stars.forEach(st => {
        ctx.beginPath();
        ctx.arc(st.x, st.y, st.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${st.opacity})`;
        ctx.fill();
        st.y += st.speed;
        if (st.y > canvas.height) { st.y = 0; st.x = Math.random() * canvas.width; }
        st.opacity += (Math.random() - 0.5) * 0.1;
        st.opacity = Math.max(0.3, Math.min(1, st.opacity));
      });
      this.starAnimationId = requestAnimationFrame(animate);
    };
    animate();
  }

  removeStarField() {
    if (this.starAnimationId) { cancelAnimationFrame(this.starAnimationId); this.starAnimationId = null; }
    const container = document.querySelector('.stars');
    if (container) container.remove();
    this.starCanvas = null;
  }
}
