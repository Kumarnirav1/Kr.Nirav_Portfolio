(function () {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const body = document.body;
  const bootScreen = document.getElementById('boot-screen');
  const bootLog = document.getElementById('boot-log');
  const bootProgress = document.getElementById('boot-progress');
  const bootPercent = document.getElementById('boot-percent');
  const bootStatus = document.getElementById('boot-status');
  const skipBoot = document.getElementById('skip-boot');

  // Terminal-style startup sequence.
  const bootMessages = [
    'Loading profile and project index...',
    'Mounting cybersecurity toolkit...',
    'Indexing selected projects: 02 found',
    'Preparing skills and experience modules...',
    'Establishing secure connection to portfolio...'
  ];
  let bootTimer;
  let bootFinished = false;

  function finishBoot() {
    if (bootFinished) return;
    bootFinished = true;
    window.clearTimeout(bootTimer);
    bootProgress.style.width = '100%';
    bootPercent.textContent = '100%';
    bootStatus.textContent = 'SESSION READY';
    body.classList.remove('booting');
    body.classList.add('ready');
    bootScreen.classList.add('is-leaving');
    window.setTimeout(() => {
      bootScreen.setAttribute('aria-hidden', 'true');
      bootScreen.style.display = 'none';
    }, reduceMotion ? 0 : 700);
  }

  function runBootSequence() {
    if (!bootScreen || !bootLog || !bootProgress || !bootPercent || !bootStatus) {
      body.classList.remove('booting');
      body.classList.add('ready');
      return;
    }
    if (reduceMotion) {
      finishBoot();
      return;
    }

    let step = 0;
    function addBootLine() {
      if (bootFinished) return;
      if (step < bootMessages.length) {
        const line = document.createElement('li');
        line.textContent = bootMessages[step];
        bootLog.appendChild(line);
        step += 1;
        const percent = Math.round((step / bootMessages.length) * 100);
        bootProgress.style.width = `${percent}%`;
        bootPercent.textContent = `${percent}%`;
        bootTimer = window.setTimeout(addBootLine, 360);
      } else {
        bootStatus.textContent = 'ACCESS GRANTED';
        bootTimer = window.setTimeout(finishBoot, 550);
      }
    }
    bootTimer = window.setTimeout(addBootLine, 220);
  }

  if (skipBoot) skipBoot.addEventListener('click', finishBoot);
  runBootSequence();

  // Layered parallax. Each layer has its own depth value.
  const parallaxLayers = document.querySelectorAll('.parallax-layer[data-depth]');
  let ticking = false;

  function updateParallax() {
    if (reduceMotion) return;
    const scrollY = window.scrollY;
    parallaxLayers.forEach((layer) => {
      const depth = Number.parseFloat(layer.dataset.depth) || 0;
      layer.style.translate = `0 ${scrollY * depth * -0.28}px`;
    });
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }, { passive: true });
  updateParallax();

  // Reveal content as it enters the viewport, with a safe fallback.
  const revealElements = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          currentObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealElements.forEach((element) => observer.observe(element));
  } else {
    revealElements.forEach((element) => element.classList.add('visible'));
  }
})();
