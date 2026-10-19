(() => {
  const video = document.getElementById('bgVideo');
  const musicButton = document.getElementById('musicControl');
  const keys = { time: 'kely-video-time', muted: 'kely-video-muted' };

  function updateMusicButton() {
    musicButton.textContent = video.muted ? '🔇' : '🎵';
    musicButton.title = video.muted ? 'Activar música' : 'Silenciar música';
    musicButton.setAttribute('aria-label', musicButton.title);
  }

  function restorePlayback() {
    const savedTime = Number(sessionStorage.getItem(keys.time));
    const savedMuted = sessionStorage.getItem(keys.muted);
    video.muted = savedMuted === null ? true : savedMuted === 'true';
    if (Number.isFinite(savedTime) && savedTime > 0) video.currentTime = savedTime;
    video.play().catch(() => {
      video.muted = true;
      updateMusicButton();
    });
    updateMusicButton();
  }

  function savePlayback() {
    sessionStorage.setItem(keys.time, String(video.currentTime || 0));
    sessionStorage.setItem(keys.muted, String(video.muted));
  }

  musicButton.addEventListener('click', () => {
    if (video.muted) {
      video.muted = false;
      video.play().catch(() => {
        video.muted = true;
        updateMusicButton();
      });
    } else {
      video.muted = true;
    }
    updateMusicButton();
  });
  window.addEventListener('pagehide', savePlayback);
  window.addEventListener('beforeunload', savePlayback);
  if (video.readyState >= 1) restorePlayback();
  else video.addEventListener('loadedmetadata', restorePlayback, { once: true });

  const flowerLayer = document.querySelector('.lilac-fall-layer');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const pageCard = document.querySelector('.page-card');
  if (pageCard && !reducedMotion) {
    let tiltFrame = 0;
    pageCard.addEventListener('pointermove', event => {
      if (event.pointerType !== 'mouse') return;
      const bounds = pageCard.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - .5;
      const y = (event.clientY - bounds.top) / bounds.height - .5;
      cancelAnimationFrame(tiltFrame);
      tiltFrame = requestAnimationFrame(() => {
        pageCard.style.setProperty('--card-tilt-x', `${-y * 3}deg`);
        pageCard.style.setProperty('--card-tilt-y', `${x * 3}deg`);
      });
    });
    pageCard.addEventListener('pointerleave', () => {
      cancelAnimationFrame(tiltFrame);
      pageCard.style.setProperty('--card-tilt-x', '0deg');
      pageCard.style.setProperty('--card-tilt-y', '0deg');
    });
  }

  if (flowerLayer && !reducedMotion) {
    const dropFlower = () => {
      const flower = document.createElement('span');
      flower.className = 'falling-flower';
      flower.style.setProperty('--left', `${Math.random() * 100}vw`);
      flower.style.setProperty('--size', `${14 + Math.random() * 24}px`);
      flower.style.setProperty('--duration', `${9 + Math.random() * 8}s`);
      flower.style.setProperty('--drift', `${Math.random() * 120 - 60}px`);
      flowerLayer.appendChild(flower);
      window.setTimeout(() => flower.remove(), 18000);
    };
    for (let index = 0; index < 12; index++) window.setTimeout(dropFlower, index * 260);
    window.setInterval(dropFlower, 950);
  }

  document.addEventListener('pointerdown', event => {
    if (reducedMotion) return;
    const flash = document.createElement('span');
    flash.className = 'flower-pop';
    flash.style.left = `${event.clientX - 16}px`;
    flash.style.top = `${event.clientY - 16}px`;
    flash.style.setProperty('--x', `${Math.random() * 110 - 55}px`);
    flash.style.setProperty('--y', `${Math.random() * 110 - 55}px`);
    document.body.appendChild(flash);
    window.setTimeout(() => flash.remove(), 700);
  }, { passive: true });

  document.querySelectorAll('.photo-flipper').forEach(button => {
    button.addEventListener('click', () => {
      const flipped = button.closest('.memory-photo').classList.toggle('is-flipped');
      button.setAttribute('aria-pressed', String(flipped));
    });
  });

  function confetti(amount = 55) {
    const symbols = ['💜', '✨', '🎉', '🌸', '✦'];
    for (let index = 0; index < amount; index++) {
      const piece = document.createElement('span');
      piece.className = 'page-confetti';
      piece.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      piece.style.left = `${Math.random() * 100}vw`;
      piece.style.setProperty('--drift', `${Math.random() * 220 - 110}px`);
      piece.style.setProperty('--fall', `${2.4 + Math.random() * 2}s`);
      piece.style.animationDelay = `${Math.random() * .5}s`;
      piece.style.fontSize = `${14 + Math.random() * 16}px`;
      document.body.appendChild(piece);
      window.setTimeout(() => piece.remove(), 5200);
    }
  }

  function typeText(target, text, done) {
    if (reducedMotion) {
      target.textContent = text;
      done();
      return;
    }
    let index = 0;
    const typeNext = () => {
      target.textContent = text.slice(0, ++index);
      if (index < text.length) window.setTimeout(typeNext, 34);
      else done();
    };
    typeNext();
  }

  const envelope = document.getElementById('wishEnvelope');
  if (envelope) {
    envelope.addEventListener('click', () => {
      if (envelope.classList.contains('is-open')) return;
      envelope.classList.add('is-open');
      envelope.setAttribute('aria-expanded', 'true');
      const letter = document.getElementById('typedLetter');
      typeText(letter, 'Gracias por existir de una forma tan bonita, Kely. Siempre habrá un lugar especial para ti en mis mejores recuerdos.', () => {
        document.getElementById('wishList').classList.remove('hidden');
        document.getElementById('wishGarden').classList.remove('hidden');
      });
    });
  }

  const gardenWishes = [
    'Regálate tiempo para todo aquello que te hace feliz.',
    'Ojalá tus planes encuentren el camino perfecto.',
    'Nunca te falten abrazos que se sientan como hogar.',
    'Colecciona viajes, canciones y anécdotas inolvidables.',
    'No olvides la huella tan linda que dejas en los demás.',
    'Brinda por las sorpresas que aún están por llegar.'
  ];
  const garden = document.getElementById('gardenFlowers');
  if (garden) {
    gardenWishes.forEach((wish, index) => {
      const flower = document.createElement('button');
      flower.type = 'button';
      flower.className = 'garden-flower';
      flower.setAttribute('aria-label', `Descubrir el deseo ${index + 1}`);
      flower.addEventListener('click', () => {
        if (flower.classList.contains('is-picked')) return;
        flower.classList.add('is-picked');
        document.getElementById('gardenResult').textContent = wish;
        if (garden.querySelectorAll('.garden-flower.is-picked').length === gardenWishes.length) {
          window.setTimeout(() => {
            document.getElementById('allWishes').classList.remove('hidden');
            confetti(75);
          }, 480);
        }
      });
      garden.appendChild(flower);
    });
  }

  const cakeButton = document.getElementById('cakeButton');
  if (cakeButton) {
    cakeButton.addEventListener('click', () => {
      const cake = document.getElementById('birthdayCake');
      if (cake.classList.contains('is-blown')) return;
      cake.classList.add('is-blown');
      document.getElementById('birthdayReveal').classList.add('is-visible');
      cakeButton.setAttribute('aria-label', 'Las velas están apagadas');
      confetti(85);
    });
  }
})();
