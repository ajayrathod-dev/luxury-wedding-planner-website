/* ═══════════════════════════════════════════════════════════
   WEDWINGZ — JavaScript
   Wedora-Style: clean hero, scroll effects, observers
   ═══════════════════════════════════════════════════════════ */

'use strict';

/* ─── Utility ────────────────────────────────────────────── */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ─── Element refs ───────────────────────────────────────── */
const navbar         = $('#navbar');
const heroContent    = $('#heroContent');
const heroImageCol   = $('#heroImageCol');
const hamburger      = $('#navHamburger');
const mobileMenu     = $('#mobileMenu');
const mobileClose    = $('#mobileClose');

/* ─── Helper: delay ─────────────────────────────────────── */
const wait = ms => new Promise(res => setTimeout(res, ms));

/* ═══════════════════════════════════════════════════════════
   1. NAVBAR SCROLL EFFECT
═══════════════════════════════════════════════════════════ */
function initNavbarScroll() {
  const handler = () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handler, { passive: true });
  handler();
}

/* ═══════════════════════════════════════════════════════════
   2. MOBILE MENU
═══════════════════════════════════════════════════════════ */
function initMobileMenu() {
  hamburger?.addEventListener('click', () => {
    mobileMenu?.classList.add('open');
  });

  mobileClose?.addEventListener('click', () => {
    mobileMenu?.classList.remove('open');
  });

  $$('.mobile-link', mobileMenu).forEach(link => {
    link.addEventListener('click', () => mobileMenu?.classList.remove('open'));
  });
}

/* ═══════════════════════════════════════════════════════════
   3. SCROLL-LINKED OPACITY ON HERO
═══════════════════════════════════════════════════════════ */
function initScrollParallax() {
  const heroEl = $('#hero');
  if (!heroEl) return;

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const heroH = heroEl.offsetHeight;
    const progress = Math.min(scrolled / heroH, 1);

    // Subtle content fade on deep scroll
    if (heroContent) {
      heroContent.style.opacity = 1 - progress * 0.35;
      heroContent.style.transform = `translateY(${scrolled * 0.08}px)`;
    }
  }, { passive: true });
}

/* ═══════════════════════════════════════════════════════════
   4. IMAGE HOVER ZOOM
═══════════════════════════════════════════════════════════ */
function initImageHover() {
  const heroImg = $('#heroImg');
  if (!heroImg) return;

  heroImageCol?.addEventListener('mouseenter', () => {
    heroImg.style.transform = 'scale(1.04)';
    heroImg.style.transition = 'transform 1.2s cubic-bezier(0.25,0.46,0.45,0.94)';
  });

  heroImageCol?.addEventListener('mouseleave', () => {
    heroImg.style.transform = 'scale(1)';
    heroImg.style.transition = 'transform 1.6s cubic-bezier(0.25,0.46,0.45,0.94)';
  });
}

/* ═══════════════════════════════════════════════════════════
   INIT
═══════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  initNavbarScroll();
  initMobileMenu();
  initScrollParallax();
  initImageHover();

  // About section observers
  initAboutObserver();
  initAboutParallax();
});


/* ═══════════════════════════════════════════════════════════
   ABOUT SECTION — INTERSECTION OBSERVER ORCHESTRATION
═══════════════════════════════════════════════════════════ */

/* ─── Easing helper for counters ────────────────────────── */
function easeOutQuart(t) {
  return 1 - Math.pow(1 - t, 4);
}

/* ─── Animated number counter ───────────────────────────── */
function animateCounter(el, target, duration = 1800, ringEl = null) {
  const circumference = 213.6; // 2π × 34
  const start = performance.now();

  function step(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = easeOutQuart(progress);
    const current = Math.round(easedProgress * target);

    el.textContent = current;

    // Animate SVG ring fill proportionally
    if (ringEl) {
      const offset = circumference - easedProgress * circumference;
      ringEl.style.strokeDashoffset = offset;
    }

    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target; // ensure final value is exact
  }

  requestAnimationFrame(step);
}

/* ─── Reveal the stats row ──────────────────────────────── */
function revealAboutStats() {
  const cards = $$('.astat-card');

  cards.forEach((card, i) => {
    setTimeout(() => {
      card.classList.add('revealed');

      // Start counter & ring after card appears
      setTimeout(() => {
        const target   = parseInt(card.dataset.target, 10);
        const numEl    = card.querySelector('.astat-number');
        const ringEl   = card.querySelector('.astat-ring__fill');

        if (numEl && !isNaN(target)) {
          // Longer duration for bigger numbers → feels more satisfying
          const dur = target > 100 ? 2200 : target > 20 ? 1800 : 1400;
          animateCounter(numEl, target, dur, ringEl);
        }
      }, 200);

    }, i * 160);
  });
}

/* ─── Full About reveal sequence ────────────────────────── */
function triggerAboutReveal() {
  const svgFrame  = $('#aboutSvgFrame');
  const imgMask   = $('#aboutImgMask');
  const quoteCard = $('#aboutQuoteCard');
  const aboutLabel = $('#aboutLabel');
  const abtLines  = [$('#abtL1'), $('#abtL2'), $('#abtL3')];
  const divider   = $('#aboutDivider');
  const paras     = $$('.about-p');
  const signature = $('#aboutSignature');
  const floralL   = $('#aboutFloralL');
  const floralR   = $('#aboutFloralR');

  // 1 — Draw SVG frame
  if (svgFrame) {
    svgFrame.classList.add('frame-visible');
    // Slight delay so opacity transition fires first
    setTimeout(() => svgFrame.classList.add('drawing'), 80);
  }

  // 2 — Image mask reveal (clip-path sweeps up)
  setTimeout(() => imgMask?.classList.add('revealed'), 300);

  // 3 — Quote card
  setTimeout(() => quoteCard?.classList.add('revealed'), 1600);

  // 4 — Label slides in
  setTimeout(() => aboutLabel?.classList.add('revealed'), 500);

  // 5 — Heading lines staggered
  abtLines.forEach((ln, i) => {
    setTimeout(() => ln?.classList.add('revealed'), 700 + i * 180);
  });

  // 6 — Divider
  setTimeout(() => divider?.classList.add('revealed'), 1200);

  // 7 — Paragraphs, one after another
  paras.forEach((p, i) => {
    setTimeout(() => p.classList.add('revealed'), 1350 + i * 220);
  });

  // 8 — Signature (last — most emotional beat)
  setTimeout(() => signature?.classList.add('revealed'), 2100);

  // 9 — Florals
  setTimeout(() => {
    floralL?.classList.add('revealed');
    floralR?.classList.add('revealed');
  }, 2300);
}

/* ─── IntersectionObserver wiring ───────────────────────── */
function initAboutObserver() {
  const aboutSection  = $('#about');
  const aboutStatsEl  = $('#aboutStats');
  if (!aboutSection) return;

  let sectionTriggered = false;
  let statsTriggered   = false;

  // Watch the main section (triggers at ~15% visibility)
  const sectionObs = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !sectionTriggered) {
          sectionTriggered = true;
          triggerAboutReveal();
          sectionObs.disconnect();
        }
      });
    },
    { threshold: 0.12 }
  );

  sectionObs.observe(aboutSection);

  // Watch the stats row separately (lower on the page)
  if (aboutStatsEl) {
    const statsObs = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !statsTriggered) {
            statsTriggered = true;
            revealAboutStats();
            statsObs.disconnect();
          }
        });
      },
      { threshold: 0.25 }
    );
    statsObs.observe(aboutStatsEl);
  }
}


/* ═══════════════════════════════════════════════════════════
   ABOUT SECTION — MOUSE PARALLAX
═══════════════════════════════════════════════════════════ */
function initAboutParallax() {
  const aboutSection = $('#about');
  if (!aboutSection) return;
  if (!window.matchMedia('(pointer: fine)').matches) return;

  const aboutImg     = $('#aboutImg');
  const aboutFloralL = $('#aboutFloralL');
  const aboutFloralR = $('#aboutFloralR');
  const svgFrame     = $('#aboutSvgFrame');

  // Parallax layers specific to about section
  const aboutLayers = [
    { el: aboutImg,     strength: 0.008, invertX: false, invertY: false, isImg: true },
    { el: aboutFloralL, strength: 0.018, invertX: true,  invertY: false, isImg: false },
    { el: aboutFloralR, strength: 0.014, invertX: false, invertY: true,  isImg: false },
    { el: svgFrame,     strength: 0.005, invertX: true,  invertY: true,  isImg: false },
  ].filter(l => l.el);

  let mx = 0, my = 0, cx = 0, cy = 0;

  aboutSection.addEventListener('mousemove', e => {
    const rect = aboutSection.getBoundingClientRect();
    mx = (e.clientX - rect.left - rect.width / 2)  / (rect.width  / 2);
    my = (e.clientY - rect.top  - rect.height / 2) / (rect.height / 2);
  }, { passive: true });

  aboutSection.addEventListener('mouseleave', () => {
    mx = 0; my = 0;
  }, { passive: true });

  (function tick() {
    cx += (mx - cx) * 0.07;
    cy += (my - cy) * 0.07;

    aboutLayers.forEach(({ el, strength, invertX, invertY, isImg }) => {
      const tx = cx * 120 * strength * (invertX ? -1 : 1);
      const ty = cy * 80  * strength * (invertY ? -1 : 1);

      if (isImg) {
        // For the actual image, apply on top of any existing scale
        const currentTransform = el.style.transform;
        // Only apply if the mask has been revealed (avoid fighting with mask animation)
        if ($('#aboutImgMask')?.classList.contains('revealed')) {
          el.style.transform = `scale(1) translate(${tx}px, ${ty}px)`;
        }
      } else {
        el.style.transform = `translate(${tx}px, ${ty}px)`;
      }
    });

    requestAnimationFrame(tick);
  })();
}


/* ═══════════════════════════════════════════════════════════
   SERVICES SECTION — INTERSECTION OBSERVER & REVEALS
═══════════════════════════════════════════════════════════ */

/* ─── Header reveal sequence ──────────────────────── */
function triggerSvcHeaderReveal() {
  const label   = $('#svcLabel');
  const hl1     = $('#svcHL1');
  const hl2     = $('#svcHL2');
  const desc    = $('#svcDesc');
  const divider = $('#svcDivider');

  setTimeout(() => label?.classList.add('revealed'),   0);
  setTimeout(() => hl1?.classList.add('revealed'),     200);
  setTimeout(() => hl2?.classList.add('revealed'),     400);
  setTimeout(() => desc?.classList.add('revealed'),    650);
  setTimeout(() => divider?.classList.add('revealed'), 880);
}

/* ─── Card grid reveal sequence ───────────────────── */
function triggerSvcGridReveal() {
  const cards = $$('.svc-card');
  const floralTL = $('#svcFloralTL');
  const floralBR = $('#svcFloralBR');

  cards.forEach((card, i) => {
    // Stagger in reading order — row by row feels most natural
    const row = Math.floor(i / 3);
    const col = i % 3;
    // Row-first stagger with slight col offset
    const delay = row * 180 + col * 100;

    setTimeout(() => {
      card.classList.add('revealed');
    }, delay);
  });

  // Florals last
  setTimeout(() => {
    floralTL?.classList.add('revealed');
    floralBR?.classList.add('revealed');
  }, 800);
}

/* ─── CTA reveal ─────────────────────────────────── */
function triggerSvcCtaReveal() {
  $('#svcCta')?.classList.add('revealed');
}

/* ─── IntersectionObserver wiring ─────────────────── */
function initServicesObserver() {
  const svcSection = $('#services');
  if (!svcSection) return;

  let headerDone = false;
  let gridDone   = false;
  let ctaDone    = false;

  // Header fires first (top of section)
  const headerObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !headerDone) {
        headerDone = true;
        triggerSvcHeaderReveal();
        headerObs.disconnect();
      }
    });
  }, { threshold: 0.15 });
  headerObs.observe($('#svcHeader') || svcSection);

  // Grid fires when user reaches the cards
  const gridObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !gridDone) {
        gridDone = true;
        triggerSvcGridReveal();
        gridObs.disconnect();
      }
    });
  }, { threshold: 0.08 });
  const svcGrid = $('#svcGrid');
  if (svcGrid) gridObs.observe(svcGrid);

  // CTA fires when bottom of section comes into view
  const ctaObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !ctaDone) {
        ctaDone = true;
        triggerSvcCtaReveal();
        ctaObs.disconnect();
      }
    });
  }, { threshold: 0.4 });
  const svcCta = $('#svcCta');
  if (svcCta) ctaObs.observe(svcCta);
}

// ── Register into init ──────────────────────────────
// Append to the existing DOMContentLoaded listener
document.addEventListener('DOMContentLoaded', () => {
  initServicesObserver();
  initPortfolioObserver();
  initPortfolioParallax();
  initLightbox();
  initExperiences();
  initWhyEterna();
  initJournal();
  initJourney();
  initLoveStories();
  initDestinations();
  initMomentsBoard();
  initFaqBoard();
  initInquiry();
  initFooter();
}, { once: false });

/* ═══════════════════════════════════════════════════════════
   PORTFOLIO & LIGHTBOX SECTION
   ═══════════════════════════════════════════════════════════ */

const weddingStories = [
  {
    couple: "Alexandra & James",
    location: "Paris, France",
    style: "Classic Opulence",
    img: "wed-palace.png",
    desc: "A regal celebration of love beneath gilded ceilings, where every detail whispered of timeless grandeur."
  },
  {
    couple: "Sofia & Marco",
    location: "Amalfi Coast, Italy",
    style: "Coastal Elegance",
    img: "wed-beach.png",
    desc: "A barefoot ceremony where the Mediterranean became their backdrop and the horizon their witness."
  },
  {
    couple: "Emma & William",
    location: "Cotswolds, England",
    style: "Garden Romance",
    img: "wed-garden.png",
    desc: "An enchanted English garden celebration where every petal and every moment told of quiet, enduring love."
  },
  {
    couple: "Isabella & Luca",
    location: "Santorini, Greece",
    style: "Mediterranean Luxe",
    img: "wed-resort.png",
    desc: "Against the backdrop of the infinite Aegean, two souls were joined in a ceremony as vast and timeless as the sea itself."
  }
];

const momentsStories = [
  {
    couple: "A Quiet Moment",
    location: "Florence, Italy",
    style: "Anticipation",
    img: "vogue-wedding.png",
    desc: "The morning preparation, filled with soft anticipation, quiet laughter, and the final touches before the vows."
  },
  {
    couple: "The First Look",
    location: "Amalfi, Italy",
    style: "First Look",
    img: "editorial-couple.png",
    desc: "That breathtaking instant when time stands completely still, and two souls lock eyes for the first time on their wedding day."
  },
  {
    couple: "Whispered Promises",
    location: "Paris, France",
    style: "Ceremony Vows",
    img: "wedding-hero.png",
    desc: "The sacred exchange of vows beneath cathedral arches, illuminated by hundreds of candles and emotional teary glances."
  },
  {
    couple: "The First Dance",
    location: "Lake Como, Italy",
    style: "First Dance",
    img: "hero-scene.png",
    desc: "Swept away under a cascading ceiling of glass lights, dancing their first steps as husband and wife into the starry night."
  },
  {
    couple: "Shared Joy",
    location: "Cotswolds, England",
    style: "Family Moments",
    img: "svc-guest.png",
    desc: "True emotional connections — family members shedding tears of happiness, clinking champagne glasses, and sharing quiet embrace."
  },
  {
    couple: "Grand Celebration",
    location: "Tuscany, Italy",
    style: "Reception Celebration",
    img: "svc-decor.png",
    desc: "The dining hall opens into a dreamscape of long banquet tables, blooming white garlands, and ambient warm candelabras."
  }
];

let currentStoryIndex = 0;

/* ─── Header Reveal sequence ──────────────────────── */
function triggerPortHeaderReveal() {
  const label    = $('#portLabel');
  const hl1      = $('#portHL1');
  const hl2      = $('#portHL2');
  const desc     = $('#portDesc');
  const divider  = $('#portHDivider');

  setTimeout(() => label?.classList.add('revealed'), 0);
  setTimeout(() => hl1?.classList.add('revealed'), 200);
  setTimeout(() => hl2?.classList.add('revealed'), 400);
  setTimeout(() => desc?.classList.add('revealed'), 650);
  setTimeout(() => divider?.classList.add('revealed'), 880);
}

/* ─── Grid reveal sequence ───────────────────── */
function triggerPortGridReveal() {
  const cards = $$('.port-card');
  const floralTL = $('#portFloralTL');
  const floralBR = $('#portFloralBR');
  const footer = $('#portFooter');

  cards.forEach((card, i) => {
    setTimeout(() => {
      card.classList.add('revealed');
    }, i * 220);
  });

  // Florals and footer reveal last
  setTimeout(() => {
    floralTL?.classList.add('revealed');
    floralBR?.classList.add('revealed');
    footer?.classList.add('revealed');
  }, cards.length * 220 + 200);
}

/* ─── Intersection Observer for Portfolio ─────────── */
function initPortfolioObserver() {
  const portSection = $('#weddings');
  if (!portSection) return;

  let headerDone = false;
  let gridDone   = false;

  const headerObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !headerDone) {
        headerDone = true;
        triggerPortHeaderReveal();
        headerObs.disconnect();
      }
    });
  }, { threshold: 0.15 });

  const portHeader = $('#portHeader');
  if (portHeader) headerObs.observe(portHeader);

  const gridObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !gridDone) {
        gridDone = true;
        triggerPortGridReveal();
        gridObs.disconnect();
      }
    });
  }, { threshold: 0.08 });

  const portGrid = $('#portGrid');
  if (portGrid) gridObs.observe(portGrid);
}

/* ─── Scroll-Driven Parallax effect ────────────────── */
function initPortfolioParallax() {
  const cards = $$('.port-card');
  if (cards.length === 0) return;

  // Track active cards currently in viewport to save recalculations
  const activeEntries = new Set();

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        activeEntries.add(entry.target);
      } else {
        activeEntries.delete(entry.target);
      }
    });
  }, { threshold: 0 });

  cards.forEach(card => obs.observe(card));

  const handleScroll = () => {
    const vh = window.innerHeight;
    
    activeEntries.forEach(card => {
      const img = card.querySelector('.port-img');
      if (!img) return;

      const factor = parseFloat(img.dataset.parallax) || 0;
      if (factor === 0) return;

      const rect = card.getBoundingClientRect();
      const cardCenter = rect.top + rect.height / 2;
      const viewportCenter = vh / 2;

      // Distance from center of viewport (-1 to 1)
      const relativePosition = (cardCenter - viewportCenter) / (vh / 2 + rect.height / 2);
      
      // Calculate translation pixels
      const translateY = relativePosition * 40 * factor;

      // Apply transform with CSS custom property to avoid overwrite on hover scale
      img.style.setProperty('--p-y', `${translateY}px`);
      img.style.transform = `scale(var(--s, 1)) translateY(var(--p-y, 0px))`;
    });
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  
  // Connect hover custom properties
  cards.forEach(card => {
    const img = card.querySelector('.port-img');
    if (!img) return;
    
    card.addEventListener('mouseenter', () => {
      img.style.setProperty('--s', '1.08');
    });
    card.addEventListener('mouseleave', () => {
      img.style.setProperty('--s', '1');
    });
  });
}

/* ─── Lightbox logic ────────────────────────────────── */
function initLightbox() {
  const lightbox = $('#lightbox');
  const lbClose = $('#lbClose');
  const lbPrev = $('#lbPrev');
  const lbNext = $('#lbNext');
  const lbBackdrop = $('#lbBackdrop');
  
  const lbImg = $('#lbImg');
  const lbStyle = $('#lbStyle');
  const lbNames = $('#lbNames');
  const lbLocation = $('#lbLocation');
  const lbDesc = $('#lbDesc');
  const lbCurrent = $('#lbCurrent');
  const lbThumbs = $('#lbThumbs');

  let activeSource = 'portfolio';

  if (!lightbox) return;

  const getActiveArray = () => activeSource === 'portfolio' ? weddingStories : momentsStories;

  // Open Lightbox
  const openLightbox = (index, source = 'portfolio') => {
    activeSource = source;
    currentStoryIndex = index;
    lightbox.removeAttribute('hidden');
    document.body.classList.add('locked');
    
    // Build thumbnails for this active source
    buildThumbnails();
    
    updateLightboxContent();
    
    // Accessibility: Set focus inside lightbox
    setTimeout(() => {
      lbClose?.focus();
    }, 100);
  };

  // Close Lightbox
  const closeLightbox = () => {
    lightbox.setAttribute('hidden', '');
    document.body.classList.remove('locked');
    
    // Focus back to initiating element
    if (activeSource === 'portfolio') {
      const initiatingCard = $(`#portCard${currentStoryIndex}`);
      initiatingCard?.focus();
    } else {
      const initiatingCard = $(`#moment${currentStoryIndex}`);
      initiatingCard?.focus();
    }
  };

  // Populate info & transition image
  const updateLightboxContent = () => {
    const stories = getActiveArray();
    const story = stories[currentStoryIndex];
    if (!story) return;

    // Fade out stage image
    lbImg.classList.remove('active');

    setTimeout(() => {
      lbImg.src = story.img;
      lbImg.alt = `${story.couple} — ${story.style} Wedding, ${story.location}`;
      lbStyle.textContent = story.style;
      lbNames.textContent = story.couple;
      lbLocation.innerHTML = `<span class="port-loc-icon">✦</span> ${story.location}`;
      lbDesc.textContent = story.desc;
      lbCurrent.textContent = currentStoryIndex + 1;
      
      const totalCountEl = $('#lbTotal');
      if (totalCountEl) totalCountEl.textContent = stories.length;

      // Update Active Thumbnail
      const thumbs = $$('.lb-thumb-item');
      thumbs.forEach((t, i) => {
        if (i === currentStoryIndex) {
          t.classList.add('active');
          t.setAttribute('aria-selected', 'true');
        } else {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        }
      });

      // Fade stage back in
      lbImg.onload = () => {
        lbImg.classList.add('active');
      };
    }, 250);
  };

  // Navigate Prev/Next
  const prevStory = () => {
    const stories = getActiveArray();
    currentStoryIndex = (currentStoryIndex - 1 + stories.length) % stories.length;
    updateLightboxContent();
  };

  const nextStory = () => {
    const stories = getActiveArray();
    currentStoryIndex = (currentStoryIndex + 1) % stories.length;
    updateLightboxContent();
  };

  // Generate Thumbnails dynamically
  const buildThumbnails = () => {
    lbThumbs.innerHTML = '';
    const stories = getActiveArray();
    stories.forEach((story, index) => {
      const thumb = document.createElement('div');
      thumb.className = 'lb-thumb-item';
      thumb.setAttribute('role', 'option');
      thumb.setAttribute('aria-selected', 'false');
      thumb.innerHTML = `<img src="${story.img}" alt="${story.couple} thumbnail" />`;
      thumb.addEventListener('click', () => {
        if (currentStoryIndex !== index) {
          currentStoryIndex = index;
          updateLightboxContent();
        }
      });
      lbThumbs.appendChild(thumb);
    });
  };

  // Event Listeners for Portfolio
  $$('.port-card').forEach((card, index) => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.port-view-btn')) return;
      openLightbox(index, 'portfolio');
    });

    card.setAttribute('tabindex', '0');
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(index, 'portfolio');
      }
    });
  });

  $$('.port-view-btn').forEach((btn, index) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      openLightbox(index, 'portfolio');
    });
  });

  // Event Listeners for Moments Wall
  $$('.moment-card').forEach((card, index) => {
    card.addEventListener('click', () => {
      openLightbox(index, 'moments');
    });

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(index, 'moments');
      }
    });
  });

  lbClose.addEventListener('click', closeLightbox);
  lbBackdrop.addEventListener('click', closeLightbox);
  lbPrev.addEventListener('click', prevStory);
  lbNext.addEventListener('click', nextStory);

  // Keyboard navigation & accessibility focus trap
  window.addEventListener('keydown', (e) => {
    if (lightbox.hasAttribute('hidden')) return;

    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowLeft') {
      prevStory();
    } else if (e.key === 'ArrowRight') {
      nextStory();
    } else if (e.key === 'Tab') {
      const focusables = lightbox.querySelectorAll('button, [tabindex="0"], [role="option"]');
      if (focusables.length === 0) return;
      const firstFocus = focusables[0];
      const lastFocus = focusables[focusables.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstFocus) {
          lastFocus.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastFocus) {
          firstFocus.focus();
          e.preventDefault();
        }
      }
    }
  });

  buildThumbnails();
}

/* ═══════════════════════════════════════════════════════════
   SIGNATURE EXPERIENCES SECTION
   ═══════════════════════════════════════════════════════════ */

/* ─── Header Reveal sequence ──────────────────────── */
function triggerExpHeaderReveal() {
  const label    = $('#expLabel');
  const hl1      = $('#expHL1');
  const hl2      = $('#expHL2');
  const desc     = $('#expDesc');
  const divider  = $('#expHDivider');
  const accordion = $('#expAccordion');

  setTimeout(() => label?.classList.add('revealed'), 0);
  setTimeout(() => hl1?.classList.add('revealed'), 200);
  setTimeout(() => hl2?.classList.add('revealed'), 400);
  setTimeout(() => desc?.classList.add('revealed'), 650);
  setTimeout(() => divider?.classList.add('revealed'), 880);
  setTimeout(() => accordion?.classList.add('revealed'), 1000);
}

/* ─── Intersection Observer for Experiences ─────────── */
function initExperiencesObserver() {
  const expSection = $('#experiences');
  if (!expSection) return;

  let headerDone = false;

  const headerObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !headerDone) {
        headerDone = true;
        triggerExpHeaderReveal();
        
        // Stagger floral ornaments reveal
        const floralTL = $('#expFloralTL');
        const floralBR = $('#expFloralBR');
        setTimeout(() => {
          floralTL?.classList.add('revealed');
          floralBR?.classList.add('revealed');
        }, 1200);

        headerObs.disconnect();
      }
    });
  }, { threshold: 0.12 });

  headerObs.observe(expSection);
}

/* ─── Accordion Toggle & Interactive Mechanics ─────── */
function initExperiencesAccordion() {
  const panels = $$('.exp-panel');
  if (panels.length === 0) return;

  const setActivePanel = (activePanel) => {
    panels.forEach(panel => {
      if (panel === activePanel) {
        panel.classList.add('active');
        panel.setAttribute('aria-expanded', 'true');
      } else {
        panel.classList.remove('active');
        panel.setAttribute('aria-expanded', 'false');
      }
    });
  };

  panels.forEach(panel => {
    // Desktop: hover to switch panels
    panel.addEventListener('mouseenter', () => {
      if (window.matchMedia('(pointer: fine)').matches) {
        setActivePanel(panel);
      }
    });

    // Desktop/Mobile click fallback
    panel.addEventListener('click', () => {
      setActivePanel(panel);
    });

    // Keyboard accessibility: Enter or Space expands focused panel
    panel.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setActivePanel(panel);
      }
    });
  });
}

/* ─── Accordion Parallax scroll logic ───────────────── */
function initExperiencesParallax() {
  const panels = $$('.exp-panel');
  const expSection = $('#experiences');
  if (!expSection || panels.length === 0) return;

  const handleScroll = () => {
    if (window.innerWidth <= 768) return;

    const vh = window.innerHeight;
    const rect = expSection.getBoundingClientRect();
    
    // Check if experiences section is visible in viewport
    if (rect.bottom < 0 || rect.top > vh) return;

    panels.forEach(panel => {
      const img = panel.querySelector('.exp-panel__bg');
      if (!img) return;

      const factor = parseFloat(img.dataset.expParallax) || 0.05;
      
      const sectionCenter = rect.top + rect.height / 2;
      const viewportCenter = vh / 2;
      const relativePosition = (sectionCenter - viewportCenter) / (vh / 2 + rect.height / 2);

      const translateY = relativePosition * 50 * factor;
      img.style.transform = `scale(var(--s, 1)) translateY(${translateY}px)`;
    });
  };

  window.addEventListener('scroll', handleScroll, { passive: true });

  panels.forEach(panel => {
    const img = panel.querySelector('.exp-panel__bg');
    if (!img) return;
    
    panel.addEventListener('mouseenter', () => {
      img.style.setProperty('--s', '1.05');
    });
    panel.addEventListener('mouseleave', () => {
      img.style.setProperty('--s', '1');
    });
  });
}

function initExperiences() {
  initExperiencesObserver();
  initExperiencesAccordion();
  initExperiencesParallax();
}

/* ═══════════════════════════════════════════════════════════
   WHY ETERNA SECTION
   ═══════════════════════════════════════════════════════════ */

/* ─── Header Reveal sequence ──────────────────────── */
function triggerWhyHeaderReveal() {
  const label    = $('#whyLabel');
  const hl1      = $('#whyHL1');
  const hl2      = $('#whyHL2');
  const desc     = $('#whyDesc');
  const divider  = $('#whyHDivider');

  setTimeout(() => label?.classList.add('revealed'), 0);
  setTimeout(() => hl1?.classList.add('revealed'), 200);
  setTimeout(() => hl2?.classList.add('revealed'), 400);
  setTimeout(() => desc?.classList.add('revealed'), 650);
  setTimeout(() => divider?.classList.add('revealed'), 880);
}

/* ─── Left Image & Trust Reveal sequence ──────────── */
function triggerWhyMediaReveal() {
  const frame      = $('#whyImgFrame');
  const mask       = $('#whyImgMask');
  const trustStrip = $('#whyTrustStrip');

  // Trigger vertical top-down clip-path reveal
  setTimeout(() => mask?.classList.add('revealed'), 0);
  
  // Trigger corner frame drawing
  setTimeout(() => frame?.classList.add('revealed'), 100);

  // Trigger horizontal trust strip slide-up reveal
  setTimeout(() => trustStrip?.classList.add('revealed'), 600);
}

/* ─── Right Features & Timeline Reveal sequence ────── */
function triggerWhyFeaturesReveal() {
  const timeline = $('#whyTimeline');
  const blocks = $$('.why-feature-block');

  // Scale timeline line down
  setTimeout(() => timeline?.classList.add('revealed'), 0);

  // Stagger blocks reveal one-by-one
  blocks.forEach((block, i) => {
    setTimeout(() => {
      block.classList.add('revealed');
    }, 300 + i * 220);
  });
}

/* ─── Intersection Observer for Why Choose Eterna ─── */
function initWhyEternaObserver() {
  const whySection = $('#why');
  if (!whySection) return;

  let mediaTriggered = false;
  let contentTriggered = false;

  // Observe the left media column
  const mediaObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !mediaTriggered) {
        mediaTriggered = true;
        triggerWhyMediaReveal();
        mediaObs.disconnect();
      }
    });
  }, { threshold: 0.12 });

  const mediaCol = $('#whyMediaCol');
  if (mediaCol) mediaObs.observe(mediaCol);

  // Observe the right content column
  const contentObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !contentTriggered) {
        contentTriggered = true;
        triggerWhyHeaderReveal();
        triggerWhyFeaturesReveal();
        
        // Reveal florals
        const floralTL = $('#whyFloralTL');
        const floralBR = $('#whyFloralBR');
        setTimeout(() => {
          floralTL?.classList.add('revealed');
          floralBR?.classList.add('revealed');
        }, 1300);

        contentObs.disconnect();
      }
    });
  }, { threshold: 0.12 });

  contentObs.observe(whySection);
}

function initWhyEterna() {
  initWhyEternaObserver();
}

/* ═══════════════════════════════════════════════════════════
   WEDDING INSPIRATION JOURNAL SECTION
   ═══════════════════════════════════════════════════════════ */

/* ─── Header Reveal sequence ──────────────────────── */
function triggerJournHeaderReveal() {
  const label    = $('#journLabel');
  const hl1      = $('#journHL1');
  const hl2      = $('#journHL2');
  const desc     = $('#journDesc');
  const divider  = $('#jouHDivider');

  setTimeout(() => label?.classList.add('revealed'), 0);
  setTimeout(() => hl1?.classList.add('revealed'), 200);
  setTimeout(() => hl2?.classList.add('revealed'), 400);
  setTimeout(() => desc?.classList.add('revealed'), 650);
  setTimeout(() => divider?.classList.add('revealed'), 880);
}

/* ─── Intersection Observer for Header & Florals ───── */
function initJournalObserver() {
  const journSection = $('#journal');
  if (!journSection) return;

  let headerDone = false;

  const headerObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !headerDone) {
        headerDone = true;
        triggerJournHeaderReveal();

        // Reveal florals
        const floralTL = $('#journFloralTL');
        const floralBR = $('#journFloralBR');
        setTimeout(() => {
          floralTL?.classList.add('revealed');
          floralBR?.classList.add('revealed');
        }, 1200);

        headerObs.disconnect();
      }
    });
  }, { threshold: 0.12 });

  headerObs.observe(journSection);
}

/* ─── Scroll-Linked Page Turn (Wipe) Engine ───────── */
function initJournalScrollEngine() {
  const track = $('#journScrollTrack');
  const page0 = $('#journPage0');
  const page1 = $('#journPage1');
  const page2 = $('#journPage2');

  if (!track || !page0 || !page1 || !page2) return;

  const pages = [page0, page1, page2];

  const handleScroll = () => {
    // Only apply sticky scroll mechanics on screens wider than 768px (desktop/tablet landscape)
    if (window.innerWidth <= 768) {
      // Clear inline styles if resizing from desktop to mobile
      pages.forEach(p => {
        p.style.clipPath = '';
        p.querySelector('.journal-page__content-col')?.style.setProperty('--ty', '0px');
      });
      return;
    }

    const rect = track.getBoundingClientRect();
    const startScroll = rect.top + window.scrollY; // absolute top y coordinates of track
    const trackHeight = rect.height;
    const viewportHeight = window.innerHeight;
    const scrollRange = trackHeight - viewportHeight;

    // Check if track is active in scrolling viewport
    let scrolledAmt = window.scrollY - startScroll;
    let progress = scrolledAmt / scrollRange;
    progress = Math.max(0, Math.min(progress, 1));

    // Page 2 Entry: wipes from p = 0.05 to p = 0.48
    let p2Factor = 0;
    if (progress > 0.05) {
      p2Factor = (progress - 0.05) / 0.43;
      p2Factor = Math.max(0, Math.min(p2Factor, 1));
    }
    const page1ClipPercent = 100 - p2Factor * 100;
    page1.style.clipPath = `inset(${page1ClipPercent}% 0 0 0)`;
    
    // Page 2 Content Text Lift
    const text2Lift = (1 - p2Factor) * 60;
    page1.querySelector('.journal-page__content-col').style.setProperty('--ty', `${text2Lift}px`);

    // Page 3 Entry: wipes from p = 0.52 to p = 0.95
    let p3Factor = 0;
    if (progress > 0.52) {
      p3Factor = (progress - 0.52) / 0.43;
      p3Factor = Math.max(0, Math.min(p3Factor, 1));
    }
    const page2ClipPercent = 100 - p3Factor * 100;
    page2.style.clipPath = `inset(${page2ClipPercent}% 0 0 0)`;

    // Page 3 Content Text Lift
    const text3Lift = (1 - p3Factor) * 60;
    page2.querySelector('.journal-page__content-col').style.setProperty('--ty', `${text3Lift}px`);

    // Manage aria-expanded active card attributes
    pages.forEach((p, idx) => {
      let isCurrent = false;
      if (idx === 0 && progress <= 0.3) isCurrent = true;
      else if (idx === 1 && progress > 0.3 && progress <= 0.75) isCurrent = true;
      else if (idx === 2 && progress > 0.75) isCurrent = true;

      if (isCurrent) {
        p.classList.add('active');
        p.setAttribute('aria-expanded', 'true');
      } else {
        p.classList.remove('active');
        p.setAttribute('aria-expanded', 'false');
      }
    });
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  // Fire once on load to establish positions
  handleScroll();
}

function initJournal() {
  initJournalObserver();
  initJournalScrollEngine();
}

/* ═══════════════════════════════════════════════════════════
   THE WEDDING JOURNEY SECTION
   ═══════════════════════════════════════════════════════════ */

/* ─── Header Reveal sequence ──────────────────────── */
function triggerJournTimelineHeaderReveal() {
  const label    = $('#jLabel');
  const hl1      = $('#jHL1');
  const hl2      = $('#jHL2');
  const desc     = $('#jDesc');
  const divider  = $('#jHDivider');

  setTimeout(() => label?.classList.add('revealed'), 0);
  setTimeout(() => hl1?.classList.add('revealed'), 200);
  setTimeout(() => hl2?.classList.add('revealed'), 400);
  setTimeout(() => desc?.classList.add('revealed'), 650);
  setTimeout(() => divider?.classList.add('revealed'), 880);
}

/* ─── Path & Milestone Nodes drawing timeline ─────── */
function triggerJourneyPathReveal() {
  const fillPath = $('#jPathFill');
  const container = $('#jCanvasContainer');
  const nodes = $$('.journ-node');

  if (window.innerWidth <= 768) {
    // Mobile: Animate vertical line height property
    if (container) {
      container.style.setProperty('--path-h', '100%');
    }
    // Stagger mobile nodes fading in
    nodes.forEach((node, i) => {
      setTimeout(() => {
        node.classList.add('revealed');
      }, 300 + i * 400);
    });
  } else {
    // Desktop: Animate SVG curve stroke-dashoffset
    if (fillPath) {
      fillPath.style.strokeDashoffset = '0';
    }
    // Stagger nodes along the path (matching horizontal sweep timing)
    nodes.forEach((node, i) => {
      setTimeout(() => {
        node.classList.add('revealed');
        // Briefly trigger pulsing dot animation when node blooms
        node.classList.add('active');
        setTimeout(() => node.classList.remove('active'), 2500);
      }, 500 + i * 550);
    });
  }
}

/* ─── Intersection Observer for Wedding Journey ────── */
function initJourneyObserver() {
  const journSection = $('#journey');
  if (!journSection) return;

  let timelineDone = false;

  const timelineObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !timelineDone) {
        timelineDone = true;
        triggerJournTimelineHeaderReveal();
        triggerJourneyPathReveal();

        // Reveal florals
        const floralTL = $('#jFloralTL');
        const floralBR = $('#jFloralBR');
        setTimeout(() => {
          floralTL?.classList.add('revealed');
          floralBR?.classList.add('revealed');
        }, 1300);

        timelineObs.disconnect();
      }
    });
  }, { threshold: 0.12 });

  timelineObs.observe(journSection);
}

/* ─── Parallax Scrolling for ornaments ────────────── */
function initJourneyParallax() {
  const florals = [$('#jFloralTL'), $('#jFloralBR')].filter(f => f);
  const journSection = $('#journey');
  if (!journSection || florals.length === 0) return;

  window.addEventListener('scroll', () => {
    if (window.innerWidth <= 768) return;

    const vh = window.innerHeight;
    const rect = journSection.getBoundingClientRect();

    if (rect.bottom < 0 || rect.top > vh) return;

    // Relative displacement
    const centerOffset = (rect.top + rect.height / 2 - vh / 2) / (vh / 2 + rect.height / 2);

    florals.forEach((fl, idx) => {
      const direction = idx === 0 ? -1 : 1;
      const translateY = centerOffset * 35 * direction;
      fl.style.transform = `translateY(${translateY}px) rotate(${idx === 0 ? '0deg' : '180deg'})`;
    });
  }, { passive: true });
}

function initJourney() {
  initJourneyObserver();
  initJourneyParallax();
}

/* ═══════════════════════════════════════════════════════════
   CLIENT LOVE STORIES SECTION
   ═══════════════════════════════════════════════════════════ */

/* ─── Header Reveal sequence ──────────────────────── */
function triggerStoriesHeaderReveal() {
  const label    = $('#storiesLabel');
  const hl1      = $('#storiesHL1');
  const hl2      = $('#storiesHL2');
  const desc     = $('#storiesDesc');
  const divider  = $('#storiesHDivider');

  setTimeout(() => label?.classList.add('revealed'), 0);
  setTimeout(() => hl1?.classList.add('revealed'), 200);
  setTimeout(() => hl2?.classList.add('revealed'), 400);
  setTimeout(() => desc?.classList.add('revealed'), 650);
  setTimeout(() => divider?.classList.add('revealed'), 880);
}

/* ─── Intersection Observer for Stories ─────────── */
function initStoriesObserver() {
  const storiesSection = $('#stories');
  if (!storiesSection) return;

  let headerDone = false;

  const headerObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !headerDone) {
        headerDone = true;
        triggerStoriesHeaderReveal();
        
        // Reveal florals
        const floralTL = $('#storiesFloralTL');
        const floralBR = $('#storiesFloralBR');
        setTimeout(() => {
          floralTL?.classList.add('revealed');
          floralBR?.classList.add('revealed');
        }, 1200);

        headerObs.disconnect();
      }
    });
  }, { threshold: 0.12 });

  headerObs.observe(storiesSection);

  // Individual story blocks observer
  const chapters = $$('.story-chapter');
  chapters.forEach(chap => {
    const chapObs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          chap.classList.add('revealed');
          chapObs.disconnect();
        }
      });
    }, { threshold: 0.15 });
    chapObs.observe(chap);
  });
}

/* ─── Button Toggle & Interactive mechanics ────────── */
function initStoriesInteractions() {
  const buttons = $$('.btn-read-story');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const chapter = btn.closest('.story-chapter');
      if (!chapter) return;

      const isExpanded = chapter.classList.contains('expanded');

      if (isExpanded) {
        chapter.classList.remove('expanded');
        btn.setAttribute('aria-expanded', 'false');
        btn.querySelector('.btn-read-text').textContent = 'Read Story';
      } else {
        chapter.classList.add('expanded');
        btn.setAttribute('aria-expanded', 'true');
        btn.querySelector('.btn-read-text').textContent = 'Close Story';
      }
    });
  });
}

/* ─── Parallax Scrolling for ornaments ────────────── */
function initStoriesParallax() {
  const florals = [$('#storiesFloralTL'), $('#storiesFloralBR')].filter(f => f);
  const storiesSection = $('#stories');
  if (!storiesSection || florals.length === 0) return;

  window.addEventListener('scroll', () => {
    if (window.innerWidth <= 992) return;

    const vh = window.innerHeight;
    const rect = storiesSection.getBoundingClientRect();

    if (rect.bottom < 0 || rect.top > vh) return;

    // Relative displacement
    const centerOffset = (rect.top + rect.height / 2 - vh / 2) / (vh / 2 + rect.height / 2);

    florals.forEach((fl, idx) => {
      const direction = idx === 0 ? -1 : 1;
      const translateY = centerOffset * 40 * direction;
      fl.style.transform = `translateY(${translateY}px) rotate(${idx === 0 ? '0deg' : '180deg'})`;
    });
  }, { passive: true });
}

function initLoveStories() {
  initStoriesObserver();
  initStoriesInteractions();
  initStoriesParallax();
}

/* ═══════════════════════════════════════════════════════════
   DREAM WEDDING DESTINATIONS SECTION
   ═══════════════════════════════════════════════════════════ */

const destinationsData = [
  {
    name: "Santorini",
    desc: "Perched on dramatic volcanic cliffs overlooking the infinite blue of the Aegean Sea, exchanging vows at the hour when the horizon melts into gold.",
    style: "Mediterranean Luxe",
    season: "May – October"
  },
  {
    name: "Udaipur",
    desc: "A majestic romance set against floating lake palaces and baroque architectural domes, where ancient royal heritage meets floating candlelight.",
    style: "Palace Grandeur",
    season: "October – March"
  },
  {
    name: "Tuscany",
    desc: "Amid rolling cypress hills, sun-drenched stone villas, and endless vineyards, gathering under pergolas of warm light for an intimate harvest feast.",
    style: "Rustic Elegance",
    season: "May – September"
  },
  {
    name: "Maldives",
    desc: "Vows exchanged on pure white sands surrounded by crystal turquoise lagoons. A private island sanctuary of absolute tropical purity and luxury.",
    style: "Barefoot Luxury",
    season: "November – April"
  },
  {
    name: "Paris",
    desc: "Under historic hand-carved ceilings and grand chandeliers, stepping into a legendary romance framed by wrought-iron balconies and classical gardens.",
    style: "Classic Aristocratic",
    season: "April – October"
  }
];

let currentDestIndex = 0;
let isDestTransitioning = false;

/* ─── Header Reveal sequence ──────────────────────── */
function triggerDestHeaderReveal() {
  const header = $('#destHeader');
  const navSidebar = $('#destNavSidebar');
  const cardCol = $('.dest-card-col');
  const indicator = $('#destIndicator');

  header?.classList.add('revealed');
  setTimeout(() => navSidebar?.classList.add('revealed'), 200);
  setTimeout(() => cardCol?.classList.add('revealed'), 400);
  setTimeout(() => indicator?.classList.add('revealed'), 600);
}

/* ─── Intersection Observer for Destinations ──────── */
function initDestinationsObserver() {
  const destSection = $('#destinations');
  if (!destSection) return;

  let revealed = false;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !revealed) {
        revealed = true;
        triggerDestHeaderReveal();
        observer.disconnect();
      }
    });
  }, { threshold: 0.12 });

  observer.observe(destSection);
}

/* ─── Scroll-pin cyclic transitions ───────────────── */
function initDestinationsScroll() {
  const scrollTrack = $('#destScrollTrack');
  const bgLayers = $$('.dest-bg-layer');
  const navBtns = $$('.dest-nav-btn');
  const infoCard = $('#destInfoCard');

  const updateDestination = (index) => {
    if (index === currentDestIndex || isDestTransitioning) return;
    isDestTransitioning = true;
    currentDestIndex = index;

    // 1. Update active sidebar tab button
    navBtns.forEach((btn, i) => {
      if (i === index) {
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
      } else {
        btn.classList.remove('active');
        btn.setAttribute('aria-selected', 'false');
      }
    });

    // 2. Update background layers
    bgLayers.forEach((layer, i) => {
      if (i === index) {
        layer.classList.add('active');
      } else {
        layer.classList.remove('active');
      }
    });

    // 3. Update info card content with slide-down/fade out stagger
    infoCard.classList.add('animating');

    setTimeout(() => {
      const data = destinationsData[index];
      if (data) {
        $('#destStyle').textContent = data.style;
        $('#destSeason').textContent = data.season;
        $('#destTitle').textContent = data.name;
        $('#destDesc').textContent = data.desc;
        $('#destExploreBtn').setAttribute('aria-label', `Explore wedding planning options in ${data.name}`);
      }

      // Lift animation back up
      infoCard.classList.remove('animating');
      isDestTransitioning = false;
    }, 450); // Match transition duration in CSS
  };

  // Scroll listener for sticky navigation
  window.addEventListener('scroll', () => {
    if (window.innerWidth <= 992 || !scrollTrack) return;

    const rect = scrollTrack.getBoundingClientRect();
    const scrollHeight = rect.height - window.innerHeight;
    
    // Check if we are active in the scroll track
    if (rect.top > 0 || rect.bottom < window.innerHeight) return;

    const scrolledAmount = -rect.top;
    const progress = Math.max(0, Math.min(1, scrolledAmount / scrollHeight));

    // Calculate index based on scroll progress (5 segments: 0-0.2, 0.2-0.4, 0.4-0.6, 0.6-0.8, 0.8-1.0)
    const index = Math.min(4, Math.floor(progress * 5));
    updateDestination(index);
  }, { passive: true });

  // Click handler on sidebar buttons
  navBtns.forEach((btn, i) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (window.innerWidth <= 992) {
        // Mobile: transition active background / text block directly
        updateDestination(i);
      } else {
        // Desktop: scroll the page to the exact scroll offset representing this slide
        const scrollHeight = scrollTrack.scrollHeight - window.innerHeight;
        const targetPercent = (i + 0.1) / 5; // mid point of the section scroll range
        const scrollTrackOffset = window.scrollY + scrollTrack.getBoundingClientRect().top;
        const targetScrollY = scrollTrackOffset + scrollHeight * targetPercent;

        window.scrollTo({
          top: targetScrollY,
          behavior: 'smooth'
        });
      }
    });
  });
}

/* ─── Cursor-Linked 3D Parallax ──────────────────── */
function initDestinationsParallax() {
  const canvas = $('#destStickyCanvas');
  const layers = $$('.dest-bg-layer');
  if (!canvas || layers.length === 0) return;

  let mx = 0, my = 0, cx = 0, cy = 0;

  canvas.addEventListener('mousemove', e => {
    if (window.innerWidth <= 992) return;
    const rect = canvas.getBoundingClientRect();
    mx = (e.clientX - rect.left - rect.width / 2)  / (rect.width  / 2);
    my = (e.clientY - rect.top  - rect.height / 2) / (rect.height / 2);
  }, { passive: true });

  canvas.addEventListener('mouseleave', () => {
    mx = 0; my = 0;
  }, { passive: true });

  (function tick() {
    cx += (mx - cx) * 0.05;
    cy += (my - cy) * 0.05;

    layers.forEach(layer => {
      const tx = cx * 20;
      const ty = cy * 12;
      layer.style.setProperty('--dest-px', `${tx}px`);
      layer.style.setProperty('--dest-py', `${ty}px`);
    });

    requestAnimationFrame(tick);
  })();
}

function initDestinations() {
  initDestinationsObserver();
  initDestinationsScroll();
  initDestinationsParallax();
}

/* ═══════════════════════════════════════════════════════════
   WEDDING MOMENTS WALL SECTION
   ═══════════════════════════════════════════════════════════ */

/* ─── Header Reveal sequence ──────────────────────── */
function triggerMomentsHeaderReveal() {
  const label    = $('#momentsLabel');
  const hl1      = $('#momentsHL1');
  const hl2      = $('#momentsHL2');
  const desc     = $('#momentsDesc');
  const divider  = $('#momentsHDivider');

  setTimeout(() => label?.classList.add('revealed'), 0);
  setTimeout(() => hl1?.classList.add('revealed'), 200);
  setTimeout(() => hl2?.classList.add('revealed'), 400);
  setTimeout(() => desc?.classList.add('revealed'), 650);
  setTimeout(() => divider?.classList.add('revealed'), 880);
}

/* ─── Intersection Observer for Moments Wall ──────── */
function initMomentsObserver() {
  const momentsSection = $('#moments');
  if (!momentsSection) return;

  let headerDone = false;

  const headerObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !headerDone) {
        headerDone = true;
        triggerMomentsHeaderReveal();
        
        // Reveal florals
        const floralTL = $('#momentsFloralTL');
        const floralBR = $('#momentsFloralBR');
        setTimeout(() => {
          floralTL?.classList.add('revealed');
          floralBR?.classList.add('revealed');
        }, 1200);

        headerObs.disconnect();
      }
    });
  }, { threshold: 0.12 });

  headerObs.observe(momentsSection);

  // Polaroid staggers observer
  const collage = $('#momentsCollage');
  if (collage) {
    let cardsDone = false;
    const cardsObs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !cardsDone) {
          cardsDone = true;
          const cards = $$('.moment-card');
          cards.forEach((card, i) => {
            setTimeout(() => {
              card.classList.add('revealed');
            }, i * 180);
          });
          cardsObs.disconnect();
        }
      });
    }, { threshold: 0.1 });
    cardsObs.observe(collage);
  }
}

/* ─── Parallax Scrolling for ornaments ────────────── */
function initMomentsParallax() {
  const florals = [$('#momentsFloralTL'), $('#momentsFloralBR')].filter(f => f);
  const momentsSection = $('#moments');
  if (!momentsSection || florals.length === 0) return;

  window.addEventListener('scroll', () => {
    if (window.innerWidth <= 992) return;

    const vh = window.innerHeight;
    const rect = momentsSection.getBoundingClientRect();

    if (rect.bottom < 0 || rect.top > vh) return;

    // Relative displacement
    const centerOffset = (rect.top + rect.height / 2 - vh / 2) / (vh / 2 + rect.height / 2);

    florals.forEach((fl, idx) => {
      const direction = idx === 0 ? -1 : 1;
      const translateY = centerOffset * 40 * direction;
      fl.style.transform = `translateY(${translateY}px) rotate(${idx === 0 ? '0deg' : '180deg'})`;
    });
  }, { passive: true });
}

function initMomentsBoard() {
  initMomentsObserver();
  initMomentsParallax();
}

/* ═══════════════════════════════════════════════════════════
   LUXURY FAQ SECTION
   ═══════════════════════════════════════════════════════════ */

function initFaqBoard() {
  const faqHeader = $('#faqHeader');
  const centerDivider = $('.faq-center-divider');
  const cards = $$('.faq-invitation');
  const section = $('#faq');
  
  if (!section) return;

  // Stagger reveal on scroll
  const faqObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        faqHeader?.classList.add('revealed');
        centerDivider?.classList.add('revealed');
        
        cards.forEach((card, i) => {
          setTimeout(() => {
            card.classList.add('revealed');
          }, i * 150);
        });
        
        // Show florals
        const florals = $$('.faq-floral');
        florals.forEach(f => f.classList.add('revealed'));
        
        faqObs.disconnect();
      }
    });
  }, { threshold: 0.1 });
  
  faqObs.observe(section);

  // Accordion Expand Toggle
  cards.forEach(card => {
    // Click toggle
    card.addEventListener('click', () => {
      const isExpanded = card.classList.contains('expanded');
      
      // Collapse all other cards first
      cards.forEach(otherCard => {
        if (otherCard !== card && otherCard.classList.contains('expanded')) {
          otherCard.classList.remove('expanded');
          otherCard.setAttribute('aria-expanded', 'false');
        }
      });
      
      if (isExpanded) {
        card.classList.remove('expanded');
        card.setAttribute('aria-expanded', 'false');
      } else {
        card.classList.add('expanded');
        card.setAttribute('aria-expanded', 'true');
      }
    });

    // Keyboard support (Space/Enter)
    card.addEventListener('keydown', (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        card.click();
      }
    });
  });
}

/* ═══════════════════════════════════════════════════════════
   LUXURY INQUIRY & CONTACT SECTION
   ═══════════════════════════════════════════════════════════ */

function initInquiry() {
  const section = $('#inquiry');
  const infoCol = $('#inquiryInfoCol');
  const envWrapper = $('#inquiryEnvWrapper');
  const form = $('#weddingInquiryForm');
  const successScreen = $('#inquirySuccess');
  
  if (!section) return;

  // Intersection Observer for 3D Invitation opening
  const inquiryObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        infoCol?.classList.add('revealed');
        envWrapper?.classList.add('revealed');
        
        // Staggered reveal of envelope open and card lift
        setTimeout(() => {
          envWrapper?.classList.add('opened');
        }, 600);

        // Show florals
        const florals = $$('.inquiry-floral');
        florals.forEach(f => f.classList.add('revealed'));
        
        inquiryObs.disconnect();
      }
    });
  }, { threshold: 0.15 });

  inquiryObs.observe(section);

  // Floating Labels Focus/Blur logic
  const inputs = $$('.inquiry-input');
  inputs.forEach(input => {
    // Focus
    input.addEventListener('focus', () => {
      input.closest('.inquiry-field-group')?.classList.add('has-value');
    });
    
    // Blur
    input.addEventListener('blur', () => {
      if (!input.value) {
        input.closest('.inquiry-field-group')?.classList.remove('has-value');
      }
    });

    // Initial check (in case of autofill)
    if (input.value) {
      input.closest('.inquiry-field-group')?.classList.add('has-value');
    }
  });

  // Form submission animation
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Simple verification
    let isValid = true;
    inputs.forEach(input => {
      if (input.hasAttribute('required') && !input.value.trim()) {
        isValid = false;
        input.closest('.inquiry-field-group').style.borderColor = 'rgba(255, 0, 0, 0.4)';
      } else {
        input.closest('.inquiry-field-group').removeAttribute('style');
      }
    });

    // Check email pattern
    const emailInput = $('#inqEmail');
    if (emailInput && emailInput.value) {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!regex.test(emailInput.value)) {
        isValid = false;
        emailInput.closest('.inquiry-field-group').style.borderColor = 'rgba(255, 0, 0, 0.4)';
      }
    }

    if (!isValid) return;

    // Trigger Success reveal sequence
    const submitBtn = $('#inquirySubmitBtn');
    if (submitBtn) submitBtn.disabled = true;

    // Fade out form fields
    const formGrid = $('.inquiry-form-grid');
    const formHeader = $('.inquiry-form-header');
    
    if (formGrid) formGrid.style.opacity = '0';
    if (formHeader) formHeader.style.opacity = '0';
    if (submitBtn) submitBtn.style.opacity = '0';

    setTimeout(() => {
      form.style.display = 'none';
      if (successScreen) {
        successScreen.removeAttribute('hidden');
        // Force layout repaint
        successScreen.offsetHeight;
        successScreen.classList.add('show');
      }
    }, 500);
  });
}

/* ═══════════════════════════════════════════════════════════
   PREMIUM MAGAZINE-STYLE FOOTER
   ═══════════════════════════════════════════════════════════ */

function initFooter() {
  const footer = $('#footer');
  const newsRow = $('#footerNewsRow');
  const grid = $('#footerGrid');
  const bottom = $('#footerBottom');
  const bttBtn = $('#backToTop');
  const newsForm = $('#footerNewsForm');
  const newsSuccess = $('#newsSuccess');

  if (!footer) return;

  // Stagger reveal scroll observer
  const footerObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        newsRow?.classList.add('revealed');
        grid?.classList.add('revealed');
        bottom?.classList.add('revealed');
        footerObs.disconnect();
      }
    });
  }, { threshold: 0.1 });

  footerObs.observe(footer);

  // Floating Back to Top Button scroll behavior
  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) {
      bttBtn?.removeAttribute('hidden');
      // Delay class for opacity animation
      setTimeout(() => {
        bttBtn?.classList.add('show');
      }, 20);
    } else {
      bttBtn?.classList.remove('show');
      // Wait for transition before hiding
      setTimeout(() => {
        if (!bttBtn?.classList.contains('show')) {
          bttBtn?.setAttribute('hidden', '');
        }
      }, 400);
    }
  }, { passive: true });

  // Scroll to Top action
  bttBtn?.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // Newsletter form submission
  newsForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const emailInput = $('#newsEmail');
    if (!emailInput || !emailInput.value.trim()) return;

    // Regex check
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(emailInput.value)) {
      emailInput.closest('.footer-news-field').style.borderColor = 'rgba(255, 0, 0, 0.4)';
      return;
    }

    emailInput.closest('.footer-news-field').removeAttribute('style');

    // Fade out input and button
    emailInput.style.opacity = '0';
    const submitBtn = $('.btn-news-submit');
    if (submitBtn) submitBtn.style.opacity = '0';

    setTimeout(() => {
      newsForm.style.display = 'none';
      if (newsSuccess) {
        newsSuccess.removeAttribute('hidden');
        newsSuccess.style.opacity = '1';
      }
    }, 400);
  });
}





