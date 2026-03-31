// ============================================================
// Portfolio — main.js (Final)
// ============================================================

gsap.registerPlugin(ScrollTrigger);

// ── Global flags ─────────────────────────────────────────
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isMobile  = () => window.innerWidth < 768;
const isTouch   = window.matchMedia('(pointer: coarse)').matches;

const EASE = {
  smooth: 'power3.out',
  settle: 'power2.out',
};

// ── Lenis smooth scroll ──────────────────────────────────
const lenis = new Lenis({
  duration:        prefersReducedMotion ? 0 : 1.1,
  easing:          (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smooth:          !prefersReducedMotion,
  smoothTouch:     false,
  touchMultiplier: 2,
});
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => { lenis.raf(time * 1000); });
gsap.ticker.lagSmoothing(0);

// ============================================================
// 1. SCROLL PROGRESS BAR
// ============================================================
const initScrollProgress = () => {
  const fill = document.getElementById('scroll-progress-fill');
  if (!fill) return;
  const update = () => {
    const s = typeof lenis.scroll === 'number' ? lenis.scroll : window.scrollY;
    const l = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    fill.style.transform = `scaleY(${Math.min(1, Math.max(0, s / l))})`;
  };
  lenis.on('scroll', update);
  window.addEventListener('resize', update);
  update();
};

// ============================================================
// 2. MOUSE TRAIL — time-stamped squares that follow the cursor.
//    Each point carries a creation timestamp.
//    The render loop ONLY draws points younger than LIFETIME ms,
//    and removes the rest. This means the trail appears when the
//    mouse moves and fully disappears when the mouse is still —
//    no persistent trace left on screen.
// ============================================================
const initMouseTrail = () => {
  if (isMobile() || isTouch) return;

  const canvas = document.createElement('canvas');
  canvas.id = 'mouse-trail-canvas';
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  const BASE_SIZE = 5;
  const LIFETIME  = 420;   // ms — how long a point lives after creation
  const MIN_DIST  = 4;     // px — minimum mouse movement to record a new point

  let w, h;
  // Each point: { x, y, born } where born = Date.now() at creation
  const points = [];
  let mouseX = -9999, mouseY = -9999;
  let prevX  = -9999, prevY  = -9999;
  let running = true;
  let rafId;

  const resize = () => {
    w = canvas.width  = window.innerWidth;
    h = canvas.height = window.innerHeight;
  };
  window.addEventListener('resize', resize);
  resize();

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    // Record point only if mouse has actually moved MIN_DIST pixels
    const dx = mouseX - prevX;
    const dy = mouseY - prevY;
    if (Math.sqrt(dx * dx + dy * dy) >= MIN_DIST) {
      points.unshift({ x: mouseX, y: mouseY, born: Date.now() });
      // Cap array so memory doesn't grow unbounded on fast movement
      if (points.length > 60) points.length = 60;
      prevX = mouseX;
      prevY = mouseY;
    }
  }, { passive: true });

  document.addEventListener('mouseleave', () => {
    mouseX = -9999; mouseY = -9999;
  });

  const render = () => {
    if (!running) return;
    ctx.clearRect(0, 0, w, h);

    const now = Date.now();

    // Remove points older than LIFETIME — this is what makes the trail disappear
    // when the mouse stops. We iterate from the tail (oldest first).
    while (points.length && now - points[points.length - 1].born > LIFETIME) {
      points.pop();
    }

    // Draw surviving points. t=1 at head (youngest), t=0 at tail (about to expire).
    const len = points.length;
    points.forEach((pt, i) => {
      // Age-based fade: 1 = just created, 0 = at LIFETIME boundary
      const age  = (now - pt.born) / LIFETIME;  // 0 → 1
      const t    = 1 - age;                      // 1 → 0
      // Also position-based falloff so head looks bigger
      const pos  = 1 - i / Math.max(len, 1);
      const alpha = t * pos * 0.82;
      if (alpha < 0.01) return;
      const size = BASE_SIZE * (0.28 + t * 0.72);
      // Alternate green / blue per square
      ctx.fillStyle = (i % 3 !== 0)
        ? `rgba(74,222,128,${alpha.toFixed(3)})`
        : `rgba(37,99,235,${alpha.toFixed(3)})`;
      ctx.fillRect(
        Math.round(pt.x - size * 0.5),
        Math.round(pt.y - size * 0.5),
        Math.round(size),
        Math.round(size)
      );
    });

    rafId = requestAnimationFrame(render);
  };

  rafId = requestAnimationFrame(render);

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { running = false; cancelAnimationFrame(rafId); }
    else                 { running = true;  rafId = requestAnimationFrame(render); }
  });
};

// ============================================================
// 3. HERO ROLE CYCLE
// ============================================================
const HERO_ROLES = ['Application Developer', 'System Thinker', 'UI Engineer'];
let roleIdx = 0;

const initHeroRoles = () => {
  const el = document.getElementById('hero-role');
  if (!el || prefersReducedMotion) return;
  // Start cycling 5 s after preloader completes (~4.5 s) so the first
  // role has settled and visitors have read it.
  setTimeout(() => {
    setInterval(() => {
      roleIdx = (roleIdx + 1) % HERO_ROLES.length;
      gsap.timeline()
        .to(el, { opacity: 0, y: -10, duration: 0.28, ease: 'power2.in' })
        .add(() => { el.textContent = HERO_ROLES[roleIdx]; })
        .fromTo(el, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.4, ease: EASE.smooth });
    }, 2800);
  }, 5200);
};

// ============================================================
// 4. PRELOADER → HERO ENTRANCE
//
//    The name "Ahmed Kabeer" is in the DOM as real HTML text.
//    GSAP sets it to opacity:0 / y:50 right before the animation
//    begins (preloader canvas is covering it anyway).
//    When the loader lifts, the hero content animates in.
// ============================================================
const initPreloader = () => {
  const loader    = document.querySelector('.loader');
  const loaderBar = document.querySelector('.loader-progress');
  const loaderTxt = document.querySelector('.loader-text');
  if (!loader) return;

  // ── Initial hidden states (preloader is still covering the page) ──
  gsap.set('.hero-name',      { opacity: 0, y: 50 });
  gsap.set('#hero-role',      { opacity: 0, y: 14 });
  gsap.set('.hero-statement', { opacity: 0, y: 20 });
  gsap.set('.nav-content',    { opacity: 0, y: -16 });

  const tl = gsap.timeline({ defaults: { ease: EASE.smooth } });

  tl
    // Loader name slides up
    .to(loaderTxt, { y: 0, duration: 1, ease: 'power4.out' })
    // Progress bar fills
    .to(loaderBar, { width: '100%', duration: 1.3, ease: 'expo.inOut' }, '-=0.4')
    // Name exits upward
    .to(loaderTxt, { y: -80, opacity: 0, duration: 0.65, ease: 'power4.in' })
    // Loader panel lifts off screen
    .to(loader, {
      yPercent: -100,
      duration: 1.0,
      ease: 'expo.inOut',
      onComplete: () => { loader.style.display = 'none'; },
    }, '-=0.28')
    // Navbar fades in
    .to('.nav-content',    { opacity: 1, y: 0,  duration: 0.75, ease: EASE.settle }, '-=0.5')
    // Hero name slides up (this is the reveal everyone sees)
    .to('.hero-name',      { opacity: 1, y: 0,  duration: 0.85, ease: 'power4.out' }, '-=0.6')
    // Role text
    .to('#hero-role',      { opacity: 1, y: 0,  duration: 0.55, ease: EASE.settle }, '-=0.5')
    // Statement
    .to('.hero-statement', { opacity: 1, y: 0,  duration: 0.55, ease: EASE.settle }, '-=0.42');
};

// ============================================================
// 5. PROJECTS — scroll-pinned panels, image crossfade,
//               synchronised text swap
//
//    Per-image copy data lives here in JS — not in the DOM —
//    so the HTML proj-micro holds only ONE slot that JS swaps.
//
//    EcoWatt (3 images): 3 text slides
//    Storiq   (2 images): 2 text slides
//
//    Static elements (title, problem, focus, tech, repo link)
//    are ALWAYS visible once the panel pins — no scroll animation.
//    Only the .proj-micro slot changes with each image.
// ============================================================
const PROJECT_SLIDES = {
  ecowatt: [
    {
      heading: 'Dashboard',
      body:    'High-signal home dashboard with a slab predictor alert. Tells users exactly how many units to the next rate jump — before it happens.',
    },
    {
      heading: 'Savings',
      body:    'Behaviour-linked savings view. Badges and streaks make energy discipline feel rewarding. Shows real ₹ saved — not vague percentage tips.',
    },
    {
      heading: 'Cost Calculator',
      body:    'Appliance-level cost math per KSEB slab. Enter appliance, quantity, duration — get an honest ₹ estimate, not a guess from a generic database.',
    },
  ],
  storiq: [
    {
      heading: 'Story Feed',
      body:    'Consent-first pipelines pull only from approved accounts. No algorithmic surprise — just the accounts you actually chose to follow.',
    },
    {
      heading: 'Regional Support',
      body:    'Full multilingual support including Malayalam. Stories preserve their original voice and context even after summarisation.',
    },
  ],
};

const initProjects = () => {
  const panels = gsap.utils.toArray('.project-panel');

  // Section divider wipe-in
  gsap.to('.section-divider', {
    scaleX: 1, ease: EASE.settle,
    scrollTrigger: {
      trigger: '#projects',
      start: 'top 72%', end: 'top 38%',
      scrub: 1,
    },
  });

  panels.forEach((panel) => {
    const key      = panel.dataset.project;
    const slides   = PROJECT_SLIDES[key] || [];
    const shots    = Array.from(panel.querySelectorAll('.project-fade-shot'));
    const shotCount = shots.length;

    // DOM refs for the dynamic micro slot
    const microHead = panel.querySelector('.micro-heading');
    const microBody = panel.querySelector('.micro-body');

    // ── Seed the micro slot with slide[0] content ──
    if (microHead && slides[0]) microHead.textContent = slides[0].heading;
    if (microBody && slides[0]) microBody.textContent = slides[0].body;

    // ── Static text elements: NO scroll-triggered animation ──
    // They must be visible the instant the panel pins.
    const staticEls = [
      panel.querySelector('.proj-meta'),
      panel.querySelector('.proj-title'),
      panel.querySelector('.proj-problem'),
      panel.querySelector('.proj-feature'),
      panel.querySelector('.proj-tech'),
      panel.querySelector('.proj-micro'),
      panel.querySelector('.proj-cta'),
    ].filter(Boolean);
    gsap.set(staticEls, { opacity: 1, y: 0, clearProps: 'all' });

    // ── Images ─────────────────────────────────────────────
    // autoAlpha sets BOTH opacity AND visibility — more reliable
    // than opacity alone and avoids CSS specificity conflicts.
    // We only hide shots[1+]; shots[0] starts fully visible.
    // This guarantees the first image shows immediately at pin,
    // even if ScrollTrigger hasn't ticked yet.
    shots.forEach((shot, i) => {
      if (i === 0) {
        gsap.set(shot, { autoAlpha: 1, scale: 1 });
      } else {
        gsap.set(shot, { autoAlpha: 0, scale: 1 });
      }
    });

    // ── Scroll distance — gives each image generous time ──
    const scrollPx = Math.round(window.innerHeight * (shotCount >= 3 ? 1.9 : 1.5));

    // ── Scrub timeline 0 → 1 ──────────────────────────
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger:             panel,
        start:               'top top',
        end:                 `+=${scrollPx}`,
        pin:                 true,
        pinSpacing:          true,
        scrub:               1.5,
        anticipatePin:       1,
        invalidateOnRefresh: true,
      },
    });

    if (!prefersReducedMotion && shotCount >= 2) {
      const SEG  = 1 / shotCount;
      const FADE = Math.min(SEG * 0.22, 0.09);

      // Helper: smooth text swap with micro-fade
      const swapText = (slideIdx) => {
        const slide = slides[slideIdx];
        if (!slide || !microHead || !microBody) return;
        gsap.killTweensOf([microHead, microBody]);
        gsap.to([microHead, microBody], {
          opacity: 0, y: 4, duration: 0.14, ease: 'power2.in',
          onComplete: () => {
            microHead.textContent = slide.heading;
            microBody.textContent = slide.body;
            gsap.fromTo([microHead, microBody],
              { opacity: 0, y: 4 },
              { opacity: 1, y: 0, duration: 0.20, ease: 'power2.out' }
            );
          },
        });
      };

      shots.forEach((shot, i) => {
        const segStart = i * SEG;
        const segEnd   = segStart + SEG;

        if (i === 0) {
          // First image: already visible at pin. Scale up across its window,
          // then crossfade out at the transition point.
          tl.to(shot, { scale: 1.04, ease: 'none', duration: SEG - FADE }, segStart);
          tl.to(shot, { autoAlpha: 0, scale: 1, duration: FADE, ease: 'power2.inOut' }, segEnd - FADE);
        } else if (i < shotCount - 1) {
          // Middle images: fade in → scale → fade out
          tl.fromTo(shot,
            { autoAlpha: 0, scale: 0.98 },
            { autoAlpha: 1, scale: 1,    duration: FADE, ease: 'power2.out' },
            segStart);
          tl.to(shot, { scale: 1.04, ease: 'none', duration: SEG - FADE * 2 }, segStart + FADE);
          tl.to(shot, { autoAlpha: 0, scale: 1, duration: FADE, ease: 'power2.inOut' }, segEnd - FADE);
        } else {
          // Last image: fade in, scale up, hold to timeline end
          tl.fromTo(shot,
            { autoAlpha: 0, scale: 0.98 },
            { autoAlpha: 1, scale: 1,    duration: FADE, ease: 'power2.out' },
            segStart);
          tl.to(shot, { scale: 1.04, ease: 'none', duration: SEG - FADE }, segStart + FADE);
        }

        // Trigger text swap at the midpoint of each image's fade-in
        // (i === 0 already seeded above, so only swap for i > 0)
        if (i > 0) {
          const swapAt = segStart + FADE * 0.5;
          const capturedIdx = i; // closure capture
          tl.add(() => swapText(capturedIdx), swapAt);
        }
      });
    }
  });
};

// ============================================================
// 6. SKILLS — single pill set, JS-only data source
//
//    SKILLS_LIST is the sole truth for skill names.
//    Only #skills-pills is ever populated — once — during init.
//    No cloud nodes, no fallback, no data-spans in HTML.
//    It is therefore IMPOSSIBLE for pills to appear twice.
// ============================================================
const SKILLS_LIST = [
  { text: 'Flutter',                weight: 1.35 },
  { text: 'Dart',                   weight: 1.28 },
  { text: 'Firebase',               weight: 1.22 },
  { text: 'UI/UX Engineering',      weight: 1.32 },
  { text: 'System Design',          weight: 1.30 },
  { text: 'API Architecture',       weight: 1.26 },
  { text: 'Performance Optimization', weight: 1.24 },
];

const SKILL_DETAILS = {
  Flutter: [
    'Built production apps with modular UI architecture.',
    'Optimised state updates to keep interactions smooth.',
    'Tuned rendering for stable 60 fps motion.',
  ],
  Dart: [
    'Wrote maintainable logic for UI + domain layers.',
    'Used patterns that reduce coupling across features.',
    'Prepared code for scalable refactors.',
  ],
  Firebase: [
    'Designed data sync flows with predictable state.',
    'Modelled data for offline-tolerant UX.',
    'Kept security boundaries explicit and readable.',
  ],
  'UI/UX Engineering': [
    'Translated design intent into production interaction.',
    'Built layout systems that scale across screens.',
    'Improved clarity with hierarchy and motion pacing.',
  ],
  'System Design': [
    'Mapped flows into clean layers and contracts.',
    'Reduced complexity by separating concerns.',
    'Designed for evolution, not one-off features.',
  ],
  'API Architecture': [
    'Crafted consistent endpoints and payload contracts.',
    'Made integration predictable for client teams.',
    'Handled errors and edge cases with intent.',
  ],
  'Performance Optimization': [
    'Profiled UI bottlenecks and fixed hot paths.',
    'Decreased re-render and layout thrash.',
    'Kept motion lightweight using easing + throttling.',
  ],
};

const initSkills = () => {
  const pillsHost   = document.getElementById('skills-pills');
  const detailTitle = document.getElementById('skills-detail-title');
  const bulletsList = document.getElementById('skills-detail-bullets');
  if (!pillsHost || !detailTitle || !bulletsList) return;

  let activeIdx  = 0;
  let cycleTimer = null;

  // ── Update detail card with opacity crossfade ──
  const setDetail = (name, instant = false) => {
    const bullets = SKILL_DETAILS[name] || [];
    const apply = () => {
      detailTitle.textContent = name;
      bulletsList.innerHTML   = '';
      bullets.forEach((b) => {
        const li = document.createElement('li');
        li.textContent = b;
        bulletsList.appendChild(li);
      });
    };
    if (instant || prefersReducedMotion) { apply(); return; }
    gsap.killTweensOf([detailTitle, bulletsList]);
    gsap.to([detailTitle, bulletsList], {
      opacity: 0, y: 5, duration: 0.14, ease: 'power2.in',
      onComplete: () => {
        apply();
        gsap.fromTo([detailTitle, bulletsList],
          { opacity: 0, y: 5 },
          { opacity: 1, y: 0, duration: 0.20, ease: 'power2.out' }
        );
      },
    });
  };

  // ── Build pills array ──
  const pills = [];

  const applyActive = (idx) => {
    pills.forEach((p, i) => p.classList.toggle('skill-pill--active', i === idx));
    setDetail(SKILLS_LIST[idx].text);
  };

  const restartCycle = () => {
    clearInterval(cycleTimer);
    cycleTimer = setInterval(() => {
      activeIdx = (activeIdx + 1) % SKILLS_LIST.length;
      applyActive(activeIdx);
    }, 2600);
  };

  // ── Populate pills ONCE from SKILLS_LIST ──
  // Clear any residual HTML (insurance against accidental edits)
  pillsHost.innerHTML = '';

  SKILLS_LIST.forEach(({ text }, i) => {
    const btn = document.createElement('button');
    btn.type        = 'button';
    btn.className   = 'skill-pill';
    btn.textContent = text;
    btn.addEventListener('click', () => {
      activeIdx = i;
      applyActive(i);
      restartCycle();
    });
    pillsHost.appendChild(btn);
    pills.push(btn);
  });

  // Seed first state instantly (no animation on page load)
  setDetail(SKILLS_LIST[0].text, true);
  applyActive(0);
  restartCycle();

  // ── Skills title scroll reveal ──
  gsap.set('.skills-title', { opacity: 0, y: 28 });
  gsap.to('.skills-title', {
    opacity: 1, y: 0,
    scrollTrigger: {
      trigger: '#skills',
      start: 'top 78%', end: 'top 50%',
      scrub: 0.7,
    },
  });

  // Detail card + pills fade in on first viewport entry
  gsap.set(['#skills-detail', '#skills-pills'], { opacity: 0, y: 16 });
  ScrollTrigger.create({
    trigger: '#skills',
    start: 'top 76%',
    once: true,
    onEnter: () => gsap.to(['#skills-detail', '#skills-pills'], {
      opacity: 1, y: 0,
      duration: 0.7, stagger: 0.1, ease: EASE.smooth,
    }),
  });
};

// ============================================================
// 7. SECTION REVEALS — projects header + contact
// ============================================================
const initSectionReveals = () => {
  if (prefersReducedMotion) return;

  // "Selected Work" header
  const projectHeader = gsap.utils.toArray('#projects .overflow-hidden > *');
  if (projectHeader.length) {
    gsap.set(projectHeader, { opacity: 0, y: 22 });
    ScrollTrigger.create({
      trigger: '#projects', start: 'top 78%', once: true,
      onEnter: () => gsap.to(projectHeader, {
        opacity: 1, y: 0, duration: 0.7, stagger: 0.08, ease: EASE.smooth,
      }),
    });
  }

  // Contact headline + sub
  const contactParts = gsap.utils.toArray('.contact-headline, .contact-sub');
  if (contactParts.length) {
    gsap.set(contactParts, { opacity: 0, y: 20 });
    ScrollTrigger.create({
      trigger: '#contact', start: 'top 72%', once: true,
      onEnter: () => gsap.to(contactParts, {
        opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: EASE.settle,
      }),
    });
  }
};

// ============================================================
// 8. MAGNETIC HOVER
// ============================================================
const initMagneticEffects = () => {
  if (isMobile() || isTouch) return;
  document.querySelectorAll('.magnetic-btn, .hover-magnetic').forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left  - r.width  / 2;
      const y = e.clientY - r.top   - r.height / 2;
      gsap.to(el, { x: x * 0.28, y: y * 0.28, duration: 0.42, ease: 'power3.out' });
    });
    el.addEventListener('mouseleave', () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.35)' });
    });
  });
};

// ============================================================
// BOOT
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  // Force scroll top before any ScrollTrigger calculations
  window.scrollTo(0, 0);

  initScrollProgress();
  initMouseTrail();
  initHeroRoles();
  initMagneticEffects();
  initProjects();
  initSkills();
  initSectionReveals();

  // Small delay so GSAP registers all ScrollTrigger instances
  // before the preloader starts (avoids race with ScrollTrigger.refresh)
  setTimeout(initPreloader, 90);
});