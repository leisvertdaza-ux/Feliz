(() => {
  const storageKeys = {
    time: 'kely-video-time',
    muted: 'kely-video-muted'
  };
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const video = document.getElementById('bgVideo');

  function restoreVideo(muteFallback) {
    if (!video) return;
    const savedTime = Number(sessionStorage.getItem(storageKeys.time));
    const savedMute = sessionStorage.getItem(storageKeys.muted);
    const muted = savedMute === null ? (muteFallback ?? video.muted) : savedMute === 'true';
    const applyState = () => {
      if (Number.isFinite(savedTime) && savedTime > 0) video.currentTime = savedTime;
      video.muted = muted;
      video.play().catch(() => {
        video.muted = true;
        updateMusicButton();
      });
      updateMusicButton();
    };

    if (video.readyState >= 1) applyState();
    else video.addEventListener('loadedmetadata', applyState, { once: true });
  }

  function saveVideo() {
    if (!video) return;
    sessionStorage.setItem(storageKeys.time, String(video.currentTime || 0));
    sessionStorage.setItem(storageKeys.muted, String(video.muted));
  }

  function updateMusicButton() {
    const button = document.getElementById('musicControl');
    if (!button || !video) return;
    button.textContent = video.muted ? '🔇' : '🎵';
    button.title = video.muted ? 'Activar música' : 'Pausar música';
    button.setAttribute('aria-label', button.title);
  }

  function addPointerTilt(element, limit) {
    if (reducedMotion) return;
    let frame = 0;
    element.addEventListener('pointermove', event => {
      if (event.pointerType !== 'mouse') return;
      const bounds = element.getBoundingClientRect();
      const horizontal = (event.clientX - bounds.left) / bounds.width - .5;
      const vertical = (event.clientY - bounds.top) / bounds.height - .5;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        element.style.setProperty('--card-tilt-x', `${-vertical * limit}deg`);
        element.style.setProperty('--card-tilt-y', `${horizontal * limit}deg`);
      });
    });
    element.addEventListener('pointerleave', () => {
      cancelAnimationFrame(frame);
      element.style.setProperty('--card-tilt-x', '0deg');
      element.style.setProperty('--card-tilt-y', '0deg');
    });
  }

  function makeFallLayer() {
    if (reducedMotion) return;
    const layer = document.createElement('div');
    layer.className = 'lilac-fall-layer';
    layer.setAttribute('aria-hidden', 'true');
    document.body.appendChild(layer);

    const dropFlower = () => {
      const flower = document.createElement('span');
      flower.className = 'lilac-fall';
      flower.style.setProperty('--left', `${Math.random() * 100}vw`);
      flower.style.setProperty('--size', `${14 + Math.random() * 22}px`);
      flower.style.setProperty('--opacity', `${.38 + Math.random() * .52}`);
      flower.style.setProperty('--duration', `${8 + Math.random() * 8}s`);
      flower.style.setProperty('--drift', `${Math.random() * 150 - 75}px`);
      layer.appendChild(flower);
      window.setTimeout(() => flower.remove(), 17000);
    };

    for (let index = 0; index < 12; index++) window.setTimeout(dropFlower, index * 280);
    window.setInterval(dropFlower, 850);
  }

  function createSparkle(x, y, symbol) {
    if (reducedMotion) return;
    const sparkle = document.createElement('span');
    sparkle.className = 'lilac-cursor';
    sparkle.textContent = symbol || ['✦', '✧', '✨'][Math.floor(Math.random() * 3)];
    sparkle.style.left = `${x}px`;
    sparkle.style.top = `${y}px`;
    sparkle.style.setProperty('--size', `${12 + Math.random() * 14}px`);
    sparkle.style.setProperty('--drift', `${Math.random() * 34 - 17}px`);
    document.body.appendChild(sparkle);
    window.setTimeout(() => sparkle.remove(), 850);
  }

  function makeClickFlash(x, y) {
    if (reducedMotion) return;
    const flash = document.createElement('span');
    flash.className = 'lilac-flash';
    flash.style.setProperty('--x', `${x - 7}px`);
    flash.style.setProperty('--y', `${y - 7}px`);
    document.body.appendChild(flash);
    window.setTimeout(() => flash.remove(), 700);
  }

  function launchTransition(destination) {
    saveVideo();
    const overlay = document.createElement('div');
    overlay.className = 'lilac-transition';
    overlay.setAttribute('aria-hidden', 'true');
    if (!reducedMotion) {
      for (let index = 0; index < 24; index++) {
        const flower = document.createElement('span');
        const angle = Math.random() * Math.PI * 2;
        const distance = 100 + Math.random() * Math.max(innerWidth, innerHeight) * .65;
        flower.className = 'transition-flower';
        flower.style.setProperty('--size', `${18 + Math.random() * 30}px`);
        flower.style.setProperty('--x', `${Math.cos(angle) * distance}px`);
        flower.style.setProperty('--y', `${Math.sin(angle) * distance}px`);
        flower.style.setProperty('--rotate', `${Math.random() * 360}deg`);
        flower.style.setProperty('--delay', `${Math.random() * .12}s`);
        overlay.appendChild(flower);
      }
    }
    document.body.appendChild(overlay);
    requestAnimationFrame(() => overlay.classList.add('is-leaving'));
    window.setTimeout(() => { window.location.href = destination; }, reducedMotion ? 80 : 820);
  }

  function guardDoubleClick(event) {
    if (document.body.classList.contains('scene-mode') ||
        event.target.closest('.scene-panel, .final-overlay, .lilac-transition')) {
      event.stopImmediatePropagation();
      event.preventDefault();
    }
  }

  restoreVideo();
  window.addEventListener('pagehide', saveVideo);
  window.addEventListener('beforeunload', saveVideo);
  document.addEventListener('dblclick', guardDoubleClick, true);

  if (window.location.hash === '#inicio') {
    const cover = document.getElementById('coverScreen');
    const muteFallback = video?.muted;
    if (cover) cover.classList.add('cover-hidden');
    if (typeof window.enterMainPage === 'function') window.enterMainPage();
    restoreVideo(muteFallback);
    window.setTimeout(updateMusicButton, 0);
  }

  makeFallLayer();
  document.querySelectorAll('.wish-card').forEach(card => addPointerTilt(card, 8));
  if (!reducedMotion) {
    document.addEventListener('pointermove', event => {
      if (Math.random() < .42) createSparkle(event.clientX, event.clientY);
    }, { passive: true });
    document.addEventListener('pointerdown', event => makeClickFlash(event.clientX, event.clientY), { passive: true });
  }

  const destinations = {
    envelopeScene: 'deseo.html',
    memoriesScene: 'recuerdos.html',
    closingScene: 'mensaje.html'
  };
  document.addEventListener('click', event => {
    const card = event.target.closest('.wish-card[data-scene-target]');
    if (!card) return;
    const destination = destinations[card.dataset.sceneTarget];
    if (!destination) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    launchTransition(destination);
  }, true);
})();
