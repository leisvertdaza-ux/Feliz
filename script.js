// ==========================================
// 1. FECHA DEL CUMPLEAÑOS DE KELY (20 de Octubre)
// ==========================================
const targetDate = new Date(2026, 9, 20, 0, 0, 0); 

function updateCountdown() {
  const now = new Date();
  const difference = targetDate - now;

  if (difference <= 0) {
    document.getElementById('timer').innerText = "¡¡¡FELIZ 19 CUMPLEAÑOS KELY!!! 💜🥳🎉";
    return;
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((difference / 1000 / 60) % 60);
  const seconds = Math.floor((difference / 1000) % 60);

  document.getElementById('timer').innerText = 
    `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

setInterval(updateCountdown, 1000);
updateCountdown();

// ==========================================
// 2. TOGGLE CON DOBLE CLIC (MOSTRAR / OCULTAR + ANIMACIÓN)
// ==========================================
let isVisible = false;

function enterMainPage() {
  const coverScreen = document.getElementById('coverScreen');
  coverScreen.classList.add('cover-hidden');
  toggleCard();
}

function enableVideoAudio() {
  const bgVideo = document.getElementById('bgVideo');
  const button = document.getElementById('musicControl');
  bgVideo.defaultMuted = false;
  bgVideo.muted = false;
  bgVideo.volume = 1;
  const playback = bgVideo.play();
  playback.then(() => {
    button.innerText = '🎵';
    button.title = 'Pausar música';
    button.setAttribute('aria-label', 'Pausar música');
  }).catch(() => {
    button.innerText = '🔇';
    button.title = 'Activar música';
    button.setAttribute('aria-label', 'Activar música');
  });
}

function toggleCard() {
  const mainCard = document.getElementById('mainCard');
  const hintText = document.getElementById('hintText');
  const bgVideo = document.getElementById('bgVideo');

  if (!isVisible) {
    // Reproducir audio del video al interactuar
    enableVideoAudio();

    mainCard.classList.remove('hidden');
    hintText.innerText = "✨ Haz doble clic para ocultar ✨";
    isVisible = true;

    // Iniciar la animación del árbol desde cero al abrir
    initTreeAnimation();
  } else {
    mainCard.classList.add('hidden');
    hintText.innerText = "✨ Haz doble clic en la pantalla ✨";
    isVisible = false;
  }
}

// ==========================================
// 3. ANIMACIÓN DEL ÁRBOL (CRECIMIENTO + CORAZONES VOLANDO)
// ==========================================
const canvas = document.getElementById('treeCanvas');
const ctx = canvas.getContext('2d');

const lilacColors = ['#ea80fc', '#e1bee7', '#ce93d8', '#ba68c8', '#ab47bc', '#8e24aa', '#d81b60', '#f48fb1'];
const leafCount = 1800;
let leaves = [];
let trunkScale = 0; // Progreso del crecimiento del tronco (0 a 1)
let animationFrameId = null;
let treeCompleted = false;

function prepareLeaves() {
  leaves = [];

  const branchPaths = [
    [210, 280, 150, 230], [150, 230, 110, 180],
    [170, 245, 135, 205], [135, 205, 115, 155],
    [210, 260, 270, 210], [270, 210, 310, 170],
    [250, 225, 285, 185], [285, 185, 300, 135],
    [210, 240, 205, 180], [205, 180, 210, 130],
    [210, 190, 180, 155], [180, 155, 175, 115],
    [150, 225, 120, 230], [120, 230, 90, 210],
    [150, 225, 125, 195], [125, 195, 105, 185],
    [130, 200, 140, 160], [140, 160, 150, 140],
    [115, 155, 85, 145], [85, 145, 70, 120],
    [115, 155, 120, 125], [120, 125, 110, 105],
    [170, 245, 155, 210], [155, 210, 160, 180],
    [270, 200, 300, 220], [300, 220, 330, 200],
    [270, 200, 295, 175], [295, 175, 320, 160],
    [280, 185, 270, 150], [270, 150, 260, 130],
    [300, 135, 330, 125], [330, 125, 345, 100],
    [300, 135, 300, 105], [300, 105, 315, 85],
    [250, 225, 250, 190], [250, 190, 235, 165],
    [205, 165, 180, 145], [180, 145, 155, 135],
    [208, 150, 235, 125], [235, 125, 245, 95],
    [110, 180, 95, 160], [90, 210, 65, 205],
    [105, 185, 85, 170], [70, 120, 55, 105],
    [70, 120, 75, 95], [110, 105, 95, 85],
    [110, 105, 115, 80], [160, 180, 145, 160],
    [310, 170, 325, 150], [330, 200, 350, 185],
    [320, 160, 340, 145], [345, 100, 360, 80],
    [345, 100, 350, 75], [315, 85, 330, 65],
    [315, 85, 310, 60], [235, 165, 225, 140],
    [210, 130, 195, 110], [210, 130, 225, 110],
    [155, 135, 135, 120], [155, 135, 145, 110],
    [245, 95, 260, 75], [245, 95, 240, 70]
  ];

  const branchTargets = [];
  const isInsideHeart = (x, y) => {
    const normalizedX = (x - 210) / 16;
    const normalizedY = (170 - y) / 16;
    return Math.pow(normalizedX * normalizedX + normalizedY * normalizedY - 1, 3)
      - normalizedX * normalizedX * Math.pow(normalizedY, 3) <= 0;
  };

  branchPaths.forEach(([startX, startY, endX, endY]) => {
    const deltaX = endX - startX;
    const deltaY = endY - startY;
    const length = Math.hypot(deltaX, deltaY);
    const normalX = -deltaY / length;
    const normalY = deltaX / length;

    for (let step = 1; step <= 4; step++) {
      const progress = step / 5;
      const centerX = startX + deltaX * progress;
      const centerY = startY + deltaY * progress;

      [-8, 0, 8].forEach(offset => {
        const target = {
          x: centerX + normalX * offset + (Math.random() * 4 - 2),
          y: centerY + normalY * offset + (Math.random() * 4 - 2)
        };

        if (isInsideHeart(target.x, target.y)) {
          branchTargets.push(target);
        }
      });
    }
  });

  for (let i = 0; i < leafCount; i++) {
    let targetX;
    let targetY;

    if (i < branchTargets.length) {
      targetX = branchTargets[i].x;
      targetY = branchTargets[i].y;
    } else {
      const angle = Math.random() * Math.PI * 2;
      const fill = Math.sqrt(Math.random());
      const heartX = 16 * Math.pow(Math.sin(angle), 3);
      const heartY = 13 * Math.cos(angle) - 5 * Math.cos(angle * 2)
        - 2 * Math.cos(angle * 3) - Math.cos(angle * 4);

      // Completar la copa con una silueta de corazón rellena
      targetX = 210 + heartX * 7.2 * fill;
      targetY = 175 - heartY * 7.2 * fill;
    }
    
    // Posición inicial fuera del canvas (volando hacia adentro)
    const startX = Math.random() < 0.5 ? -100 : 520;
    const startY = Math.random() * 420 - 50;

    leaves.push({
      x: startX,
      y: startY,
      targetX: targetX,
      targetY: targetY,
      size: Math.random() * 0.8 + 0.75,
      color: lilacColors[Math.floor(Math.random() * lilacColors.length)],
      speed: Math.random() * 0.025 + 0.012,
      progress: 0
    });
  }
}

function drawHeart(x, y, size, color) {
  ctx.save();
  ctx.beginPath();
  ctx.translate(x, y);
  ctx.scale(size, size);
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(-5, -5, -10, 2, 0, 10);
  ctx.bezierCurveTo(10, 2, 5, -5, 0, 0);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.restore();
}

function drawGrowingTrunk(scale) {
  ctx.save();
  // Animación de crecimiento escalando desde la base
  ctx.translate(210, 400);
  ctx.scale(1, scale);
  ctx.translate(-210, -400);

  ctx.strokeStyle = '#4a148c';
  ctx.fillStyle = '#4a148c';

  // 1. TRONCO PRINCIPAL
  ctx.beginPath();
  ctx.moveTo(198, 400);
  ctx.lineTo(222, 400);
  ctx.lineTo(216, 220);
  ctx.lineTo(204, 220);
  ctx.fill();

  // Mantener todas las ramas dentro de la silueta del corazón
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(210, 300);
  ctx.bezierCurveTo(190, 275, 92, 225, 92, 145);
  ctx.bezierCurveTo(92, 90, 155, 65, 210, 125);
  ctx.bezierCurveTo(265, 65, 328, 90, 328, 145);
  ctx.bezierCurveTo(328, 225, 230, 275, 210, 300);
  ctx.clip();

  // 2. RAMAS PRINCIPALES (Gruesas)
  ctx.lineWidth = 6;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  // Rama izquierda principal
  ctx.moveTo(210, 280);
  ctx.quadraticCurveTo(150, 230, 110, 180);
  ctx.moveTo(170, 245);
  ctx.quadraticCurveTo(135, 205, 115, 155);
  // Rama derecha principal
  ctx.moveTo(210, 260);
  ctx.quadraticCurveTo(270, 210, 310, 170);
  ctx.moveTo(250, 225);
  ctx.quadraticCurveTo(285, 185, 300, 135);
  // Rama central
  ctx.moveTo(210, 240);
  ctx.quadraticCurveTo(205, 180, 210, 130);
  ctx.moveTo(210, 190);
  ctx.quadraticCurveTo(180, 155, 175, 115);
  ctx.stroke();

  // 3. RAMAS SECUNDARIAS (Medianas)
  ctx.lineWidth = 4;
  ctx.beginPath();
  // Sub-ramas de la izquierda
  ctx.moveTo(150, 225);
  ctx.quadraticCurveTo(120, 230, 90, 210);
  ctx.moveTo(150, 225);
  ctx.quadraticCurveTo(125, 195, 105, 185);
  ctx.moveTo(130, 200);
  ctx.quadraticCurveTo(140, 160, 150, 140);
  ctx.moveTo(115, 155);
  ctx.quadraticCurveTo(85, 145, 70, 120);
  ctx.moveTo(115, 155);
  ctx.quadraticCurveTo(120, 125, 110, 105);
  ctx.moveTo(170, 245);
  ctx.quadraticCurveTo(155, 210, 160, 180);
  // Sub-ramas de la derecha
  ctx.moveTo(270, 200);
  ctx.quadraticCurveTo(300, 220, 330, 200);
  ctx.moveTo(270, 200);
  ctx.quadraticCurveTo(295, 175, 320, 160);
  ctx.moveTo(280, 185);
  ctx.quadraticCurveTo(270, 150, 260, 130);
  ctx.moveTo(300, 135);
  ctx.quadraticCurveTo(330, 125, 345, 100);
  ctx.moveTo(300, 135);
  ctx.quadraticCurveTo(300, 105, 315, 85);
  ctx.moveTo(250, 225);
  ctx.quadraticCurveTo(250, 190, 235, 165);
  // Sub-ramas de la copa central
  ctx.moveTo(205, 165);
  ctx.quadraticCurveTo(180, 145, 155, 135);
  ctx.moveTo(208, 150);
  ctx.quadraticCurveTo(235, 125, 245, 95);
  ctx.stroke();

  // 4. RAMITAS FINAS (Detalles en las puntas)
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.moveTo(110, 180);
  ctx.lineTo(95, 160);
  ctx.moveTo(90, 210);
  ctx.lineTo(65, 205);
  ctx.moveTo(105, 185);
  ctx.lineTo(85, 170);
  ctx.moveTo(70, 120);
  ctx.lineTo(55, 105);
  ctx.moveTo(70, 120);
  ctx.lineTo(75, 95);
  ctx.moveTo(110, 105);
  ctx.lineTo(95, 85);
  ctx.moveTo(110, 105);
  ctx.lineTo(115, 80);
  ctx.moveTo(160, 180);
  ctx.lineTo(145, 160);
  ctx.moveTo(310, 170);
  ctx.lineTo(325, 150);
  ctx.moveTo(330, 200);
  ctx.lineTo(350, 185);
  ctx.moveTo(320, 160);
  ctx.lineTo(340, 145);
  ctx.moveTo(345, 100);
  ctx.lineTo(360, 80);
  ctx.moveTo(345, 100);
  ctx.lineTo(350, 75);
  ctx.moveTo(315, 85);
  ctx.lineTo(330, 65);
  ctx.moveTo(315, 85);
  ctx.lineTo(310, 60);
  ctx.moveTo(235, 165);
  ctx.lineTo(225, 140);
  ctx.moveTo(210, 130);
  ctx.lineTo(195, 110);
  ctx.moveTo(210, 130);
  ctx.lineTo(225, 110);
  ctx.moveTo(155, 135);
  ctx.lineTo(135, 120);
  ctx.moveTo(155, 135);
  ctx.lineTo(145, 110);
  ctx.moveTo(245, 95);
  ctx.lineTo(260, 75);
  ctx.moveTo(245, 95);
  ctx.lineTo(240, 70);
  ctx.stroke();
  ctx.restore();

  ctx.restore();
}

function initTreeAnimation() {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }

  trunkScale = 0;
  treeCompleted = false;
  document.querySelector('.tree-stage')?.classList.remove('tree-complete');
  prepareLeaves();

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 1. Crecer el tronco progresivamente
    if (trunkScale < 1) {
      trunkScale += 0.03;
      if (trunkScale > 1) trunkScale = 1;
    }

    drawGrowingTrunk(trunkScale);

    // 2. Hacer volar los corazones hacia el árbol cuando el tronco ya haya empezado a crecer
    if (trunkScale > 0.4) {
      leaves.forEach(leaf => {
        if (leaf.progress < 1) {
          leaf.progress += leaf.speed;
        }

        const currentX = leaf.x + (leaf.targetX - leaf.x) * leaf.progress;
        const currentY = leaf.y + (leaf.targetY - leaf.y) * leaf.progress;

        drawHeart(currentX, currentY, leaf.size, leaf.color);
      });

      if (!treeCompleted && leaves.every(leaf => leaf.progress >= 1)) {
        treeCompleted = true;
        document.querySelector('.tree-stage')?.classList.add('tree-complete');
        launchMiniConfetti(10);
      }
    }

    animationFrameId = requestAnimationFrame(animate);
  }

  animate();
}

// ==========================================
// 4. MEJORAS: MÚSICA, PARTÍCULAS Y DETALLE FINAL
// ==========================================
let musicEnabled = true;

function toggleMusic(event) {
  if (event) event.stopPropagation();
  const bgVideo = document.getElementById('bgVideo');
  const button = document.getElementById('musicControl');

  if (bgVideo.muted) {
    enableVideoAudio();
    musicEnabled = true;
  } else {
    bgVideo.muted = true;
    musicEnabled = false;
    button.innerText = '🔇';
    button.title = 'Activar música';
    button.setAttribute('aria-label', 'Activar música');
  }
}

function createFloatingParticle() {
  const container = document.getElementById('floatingParticles');
  if (!container) return;

  const particle = document.createElement('span');
  particle.className = 'particle';
  const symbols = ['💜', '✨', '♡', '✦', '🌸'];
  particle.innerText = symbols[Math.floor(Math.random() * symbols.length)];
  particle.style.left = Math.random() * 100 + 'vw';
  particle.style.fontSize = (Math.random() * 12 + 10) + 'px';
  particle.style.animationDuration = (Math.random() * 7 + 7) + 's';
  particle.style.setProperty('--drift', (Math.random() * 140 - 70) + 'px');
  container.appendChild(particle);

  setTimeout(() => particle.remove(), 15000);
}

setInterval(createFloatingParticle, 900);
for (let i = 0; i < 8; i++) setTimeout(createFloatingParticle, i * 350);

function openFinalMessage(event) {
  if (event) event.stopPropagation();
  const overlay = document.getElementById('finalOverlay');
  overlay.classList.add('show');
  launchMiniConfetti(22);
}

function closeFinalMessage(event) {
  if (event) event.stopPropagation();
  document.getElementById('finalOverlay').classList.remove('show');
}

function openEnvelope(event) {
  if (event) event.stopPropagation();
  const envelope = document.getElementById('memoryEnvelope');
  const message = document.getElementById('envelopeMessage');
  const isOpen = envelope.classList.toggle('open');
  envelope.setAttribute('aria-expanded', String(isOpen));
  message.classList.toggle('visible', isOpen);
  if (isOpen) launchMiniConfetti(12);
}

function triggerFinalSurprise(event) {
  if (event) event.stopPropagation();
  launchMiniConfetti(38);
  const burst = document.createElement('div');
  burst.className = 'birthday-burst';
  burst.innerHTML = '✨ Siempre brilla, Kely 💜<br><small>Tu día merece muchos deseos bonitos</small>';
  document.body.appendChild(burst);
  setTimeout(() => burst.remove(), 3800);
}

let activeSceneId = null;
let sceneTransitionTimer = null;
let sceneScrollPosition = 0;

function resetSceneAnimation(panel) {
  panel.classList.remove('scene-active', 'scene-leaving');
  void panel.offsetWidth;
  panel.classList.add('scene-active');
}

function switchScene(sceneId, event) {
  if (event) event.stopPropagation();
  const panel = document.getElementById(sceneId);
  const experience = document.querySelector('.experience-additions');
  const mainCard = document.getElementById('mainCard');
  if (!panel || !experience || !mainCard) return;

  window.clearTimeout(sceneTransitionTimer);
  sceneScrollPosition = window.scrollY;
  const currentPanel = activeSceneId ? document.getElementById(activeSceneId) : null;
  currentPanel?.classList.remove('scene-active');
  currentPanel?.classList.add('scene-leaving');
  document.body.classList.add('scene-mode');
  mainCard.classList.remove('hidden');
  activeSceneId = sceneId;

  sceneTransitionTimer = window.setTimeout(() => {
    document.querySelectorAll('.scene-panel').forEach(scene => {
      if (scene !== panel) scene.classList.remove('scene-active', 'scene-leaving');
    });
    resetSceneAnimation(panel);
    window.scrollTo(0, sceneScrollPosition);
    if (sceneId === 'closingScene') launchMiniConfetti(18);
  }, 340);
}

function returnToMainScene(event) {
  if (event) event.stopPropagation();
  window.clearTimeout(sceneTransitionTimer);
  document.querySelectorAll('.scene-panel').forEach(panel => panel.classList.remove('scene-active', 'scene-leaving'));
  document.body.classList.remove('scene-mode');
  activeSceneId = null;
  window.scrollTo(0, sceneScrollPosition);
}

const revealItems = document.querySelectorAll('.reveal-on-scroll');
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.16 });
  revealItems.forEach(item => revealObserver.observe(item));
} else {
  revealItems.forEach(item => item.classList.add('is-visible'));
}

function launchMiniConfetti(amount = 35) {
  const symbols = ['💜', '✨', '🎉', '🌸', '♡'];
  for (let i = 0; i < amount; i++) {
    const piece = document.createElement('span');
    piece.className = 'confetti-piece';
    piece.innerText = symbols[Math.floor(Math.random() * symbols.length)];
    piece.style.left = Math.random() * 100 + 'vw';
    piece.style.setProperty('--x', (Math.random() * 240 - 120) + 'px');
    piece.style.setProperty('--fall', (Math.random() * 2 + 2.5) + 's');
    piece.style.animationDelay = (Math.random() * .7) + 's';
    document.body.appendChild(piece);
    setTimeout(() => piece.remove(), 4500);
  }
}

// Cuando llegue el cumpleaños, se celebra automáticamente una sola vez.
let birthdayCelebrated = false;
const originalUpdateCountdown = updateCountdown;
updateCountdown = function() {
  originalUpdateCountdown();
  const difference = targetDate - new Date();
  if (difference <= 0 && !birthdayCelebrated) {
    birthdayCelebrated = true;
    const burst = document.createElement('div');
    burst.className = 'birthday-burst';
    burst.innerHTML = '🎂 ¡FELIZ CUMPLEAÑOS, KELY! 💜<br><small>✨ 19 años ✨</small>';
    document.body.appendChild(burst);
    launchMiniConfetti(55);
    setTimeout(() => burst.remove(), 3800);
  }
};
updateCountdown();
