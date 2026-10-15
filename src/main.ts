import './style.css';
import { startMesh } from './mesh';
import { awards, contact, education, experience, languages, projects, skillGroups, type Media, type Project } from './data';

const $ = <T extends HTMLElement = HTMLElement>(sel: string, root: ParentNode = document) => root.querySelector<T>(sel)!;
const $$ = <T extends HTMLElement = HTMLElement>(sel: string, root: ParentNode = document) => [...root.querySelectorAll<T>(sel)];
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = matchMedia('(pointer: fine)').matches;

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

const icons: Record<string, string> = {
  chip: '<path d="M9 3v2M15 3v2M9 19v2M15 19v2M3 9h2M3 15h2M19 9h2M19 15h2"/><rect x="5" y="5" width="14" height="14" rx="2"/><rect x="9" y="9" width="6" height="6" rx="1"/>',
  code: '<path d="m8 8-4 4 4 4M16 8l4 4-4 4M14 4l-4 16"/>',
  net: '<circle cx="12" cy="5" r="2"/><circle cx="5" cy="19" r="2"/><circle cx="19" cy="19" r="2"/><path d="M12 7v5M12 12l-5.5 5.5M12 12l5.5 5.5"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/>',
  linkedin: '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 10v7M8 7v.01M12 17v-4a2 2 0 0 1 4 0v4M12 10v7"/>',
  github: '<path d="M9 19c-4 1.5-4-2-6-2.5M15 21v-3.5a3 3 0 0 0-.8-2.3c2.7-.3 5.6-1.3 5.6-6a4.6 4.6 0 0 0-1.3-3.2 4.3 4.3 0 0 0-.1-3.2s-1-.3-3.3 1.3a11.4 11.4 0 0 0-6 0C6.8 2.5 5.8 2.8 5.8 2.8a4.3 4.3 0 0 0-.1 3.2A4.6 4.6 0 0 0 4.4 9.2c0 4.6 2.8 5.7 5.5 6a3 3 0 0 0-.8 2.3V21"/>',
  pin: '<path d="M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12z"/><circle cx="12" cy="9" r="2.5"/>',
  arrow: '<path d="M7 17 17 7M9 7h8v8"/>',
  play: '<path d="M8 5v14l11-7z"/>',
  cube: '<path d="m12 3 8 4.5v9L12 21l-8-4.5v-9z"/><path d="m12 12 8-4.5M12 12v9M12 12 4 7.5"/>',
  doc: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 14l3 3 3-3M12 10v7"/>',
  trophy: '<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0zM7 6H4a3 3 0 0 0 3 4M17 6h3a3 3 0 0 1-3 4"/>',
};
const icon = (name: string, cls = 'ico') =>
  `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name]}</svg>`;

/* ---------------- boot screen ---------------- */
function boot() {
  const el = $('#boot');
  if (reduced || sessionStorageGet('booted')) {
    el.remove();
    document.body.classList.add('ready');
    return;
  }
  const lines = [
    '> init clock ............ 80 MHz  [ok]',
    '> mount /portfolio ...... v2.0    [ok]',
    '> mesh.provision() ...... 9 nodes [ok]',
    '> hello, world_',
  ];
  const log = $('#bootLog');
  let i = 0;
  const tick = () => {
    if (i < lines.length) {
      log.textContent += (i ? '\n' : '') + lines[i++];
      setTimeout(tick, 170);
    } else {
      setTimeout(() => {
        el.classList.add('boot--done');
        document.body.classList.add('ready');
        setTimeout(() => el.remove(), 700);
      }, 220);
    }
  };
  tick();
  sessionStorageSet('booted', '1');
}
function sessionStorageGet(k: string) {
  try {
    return sessionStorage.getItem(k);
  } catch {
    return null;
  }
}
function sessionStorageSet(k: string, v: string) {
  try {
    sessionStorage.setItem(k, v);
  } catch {
    /* storage unavailable */
  }
}

/* ---------------- typewriter ---------------- */
function typer() {
  const el = $('#typer');
  const words = ['firmware for STM32.', 'BLE mesh networks.', 'automated test systems.', 'secure industrial networks.', 'PLC control systems.'];
  if (reduced) {
    el.textContent = words[0];
    return;
  }
  let w = 0;
  let c = 0;
  let deleting = false;
  const step = () => {
    const word = words[w];
    c += deleting ? -1 : 1;
    el.textContent = word.slice(0, c);
    let delay = deleting ? 35 : 70;
    if (!deleting && c === word.length) {
      deleting = true;
      delay = 1800;
    } else if (deleting && c === 0) {
      deleting = false;
      w = (w + 1) % words.length;
      delay = 300;
    }
    setTimeout(step, delay);
  };
  step();
}

/* ---------------- about: animated chip ---------------- */
function renderChip() {
  // One side's traces is built facing up, then rotated around the centre for the other three sides.
  const C = 200;
  const pins = [-45, -27, -9, 9, 27, 45];
  let traces = '';
  let pulses = '';
  let pads = '';
  pins.forEach((off, i) => {
    const x = C + off;
    const spread = off * 0.9;
    const bendY = 92 - Math.abs(off) * 0.25;
    const endY = 18 + ((i * 7) % 4) * 14;
    const d = `M${x} 112 V${bendY} L${x + spread} ${bendY - Math.abs(spread)} V${endY}`;
    traces += `<path d="${d}" />`;
    pads += `<rect x="${x - 3}" y="112" width="6" height="16" rx="1" /><circle cx="${x + spread}" cy="${endY - 6}" r="4.5" />`;
    const dur = (2.4 + ((i * 37) % 10) / 5).toFixed(2);
    const delay = (((i * 53) % 17) / 6).toFixed(2);
    pulses += `<path d="${d}" pathLength="100" style="animation-duration:${dur}s;animation-delay:-${delay}s" />`;
  });
  const side = (deg: number) =>
    `<g transform="rotate(${deg} ${C} ${C})"><g class="chip__traces">${traces}</g><g class="chip__pulses">${pulses}</g><g class="chip__pads">${pads}</g></g>`;

  $('#chip').innerHTML = `
    <defs>
      <linearGradient id="chipGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="var(--cyan)" /><stop offset="0.5" stop-color="#8fb8ff" /><stop offset="1" stop-color="var(--amber)" />
      </linearGradient>
      <radialGradient id="chipGlow"><stop offset="0" stop-color="var(--cyan)" stop-opacity="0.35" /><stop offset="1" stop-color="var(--cyan)" stop-opacity="0" /></radialGradient>
      <pattern id="chipGrid" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0H0V20" fill="none" stroke="rgba(255,255,255,0.05)" /></pattern>
    </defs>
    <rect width="400" height="400" fill="url(#chipGrid)" />
    <circle class="chip__glow" cx="200" cy="200" r="150" fill="url(#chipGlow)" />
    ${[0, 90, 180, 270].map(side).join('')}
    <rect class="chip__body" x="128" y="128" width="144" height="144" rx="14" />
    <rect x="128" y="128" width="144" height="144" rx="14" fill="none" stroke="url(#chipGrad)" stroke-width="2" />
    <circle cx="146" cy="146" r="4" class="chip__notch" />
    <text x="200" y="207" class="chip__initials">AA</text>
    <text x="200" y="236" class="chip__label">ALDULAIMI · MCU</text>
    <text x="200" y="252" class="chip__label chip__label--dim">ESP-FI · REV 2.0</text>
    <text x="22" y="386" class="chip__label chip__label--dim" text-anchor="start">U1</text>
    <text x="378" y="386" class="chip__label chip__label--dim" text-anchor="end">3V3</text>`;
}

/* ---------------- render sections ---------------- */
function renderSkills() {
  $('#skillGrid').innerHTML = skillGroups
    .map(
      (g, i) => `
      <article class="skill card reveal" style="--d:${i * 80}ms">
        <div class="skill__icon">${icon(g.icon)}</div>
        <h3>${g.title}</h3>
        <ul>${g.items.map((s) => `<li>${esc(s)}</li>`).join('')}</ul>
      </article>`,
    )
    .join('');

  const tags = ['STM32', 'nRF52', 'Zephyr', 'C', 'C++', 'Python', 'Modbus', 'BLE Mesh', 'Jenkins', 'Robot Framework', 'Docker', 'Grafana', 'ESXi', 'FortiGate', 'PLC', 'FreeRTOS', 'PCB', 'Unity', 'Linux', 'SQL'];
  const row = tags.map((t) => `<span>${t}</span><i>✦</i>`).join('');
  $('#marquee').innerHTML = row + row;
}

const cover = (p: Project) =>
  p.cover
    ? `<img src="${p.cover}" alt="" loading="lazy" />`
    : `<div class="glyph"><span>${p.glyph}</span></div>`;

function renderProjects() {
  $('#projectGrid').innerHTML = projects
    .map(
      (p, i) => `
      <article class="project card reveal ${p.featured ? 'project--featured' : ''}" data-cat="${esc(p.category)}" style="--d:${(i % 3) * 90}ms">
        <button class="project__hit" data-open="${p.id}" aria-label="Open ${esc(p.title)}"></button>
        <div class="project__media">${cover(p)}</div>
        <div class="project__body">
          <div class="project__meta mono"><span>${p.year}</span><span>${esc(p.category)}</span></div>
          <h3>${esc(p.title)}</h3>
          <p>${esc(p.short)}</p>
          <span class="project__more">Explore ${icon('arrow')}</span>
        </div>
      </article>`,
    )
    .join('');

  const cats = ['All', 'Embedded', 'Automation', 'Hackathon', 'Wireless', 'IoT', 'Cyber security'];
  const filters = $('#filters');
  filters.innerHTML = cats
    .map((c, i) => `<button role="tab" aria-selected="${i === 0}" class="filter ${i === 0 ? 'is-active' : ''}" data-filter="${c}">${c}</button>`)
    .join('');
  filters.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-filter]');
    if (!btn) return;
    $$('.filter', filters).forEach((b) => {
      b.classList.toggle('is-active', b === btn);
      b.setAttribute('aria-selected', String(b === btn));
    });
    const f = btn.dataset.filter!;
    $$('.project').forEach((card) => {
      const show = f === 'All' || card.dataset.cat!.includes(f);
      card.classList.toggle('is-hidden', !show);
    });
  });

  $('#projectGrid').addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLElement>('[data-open]');
    if (btn) openProject(btn.dataset.open!);
  });
}

function renderExperience() {
  $('#timeline').insertAdjacentHTML(
    'beforeend',
    experience
      .map(
        (x) => `
      <li class="tl reveal">
        <span class="tl__dot"></span>
        <p class="tl__period mono">${x.period}</p>
        <h3>${x.role} <span>@ ${x.org}</span></h3>
        <p>${x.body}</p>
      </li>`,
      )
      .join(''),
  );
  $('#education').innerHTML = education
    .map(
      (e) =>
        `<li${'ongoing' in e ? ' class="edu--now"' : ''}><span class="mono">${'ongoing' in e ? '<i class="pulse"></i>' : ''}${e.year}</span><div><strong>${e.degree}</strong><small>${e.school} · ${e.detail}</small></div></li>`,
    )
    .join('');
  $('#languages').innerHTML = languages
    .map(
      (l) => `<li><div class="langs__row"><span>${l.name}</span><span class="mono">${l.level}</span></div><div class="bar"><span style="--v:${l.value}%"></span></div></li>`,
    )
    .join('');
  $('#awards').innerHTML = awards
    .map((a) => `<li><a href="${a.href}" target="_blank" rel="noopener">${icon('trophy')}<div><strong>${a.title}</strong><small>${a.detail}</small></div></a></li>`)
    .join('');
}

function renderContact() {
  const items = [
    { ic: 'mail', label: contact.email, href: `mailto:${contact.email}`, copy: contact.email },
    { ic: 'phone', label: contact.phone, href: `tel:${contact.phone.replace(/\s/g, '')}` },
    { ic: 'linkedin', label: 'LinkedIn', href: contact.linkedin },
    { ic: 'github', label: 'GitHub', href: contact.github },
    { ic: 'pin', label: contact.location },
  ];
  $('#contactLinks').innerHTML = items
    .map((it) =>
      it.href
        ? `<a class="clink" href="${it.href}" ${it.href.startsWith('http') ? 'target="_blank" rel="noopener"' : ''} ${it.copy ? `data-copy="${it.copy}"` : ''}>${icon(it.ic)}<span>${it.label}</span></a>`
        : `<span class="clink">${icon(it.ic)}<span>${it.label}</span></span>`,
    )
    .join('');

  $('#contactLinks').addEventListener('click', async (e) => {
    const a = (e.target as HTMLElement).closest<HTMLElement>('[data-copy]');
    if (!a || !navigator.clipboard) return;
    e.preventDefault();
    try {
      await navigator.clipboard.writeText(a.dataset.copy!);
      toast('Email copied to clipboard');
    } catch {
      location.href = `mailto:${a.dataset.copy}`;
    }
  });

  const form = $<HTMLFormElement>('#contactForm');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.classList.add('was-validated');
      toast('Please fill in every field');
      return;
    }
    const data = new FormData(form);
    const subject = `Portfolio message from ${data.get('name')}`;
    const body = `${data.get('message')}\n\n— ${data.get('name')} (${data.get('email')})`;
    location.href = `mailto:${contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    toast('Opening your email app…');
    form.reset();
    form.classList.remove('was-validated');
  });
}

/* ---------------- project modal ---------------- */
const modal = $<HTMLDialogElement>('#modal');

function mediaHtml(m: Media) {
  if (m.kind === 'image')
    return `<figure class="gallery__item"><button class="zoom" data-zoom="${m.src}" aria-label="Enlarge: ${esc(m.caption)}"><img src="${m.src}" alt="${esc(m.caption)}" loading="lazy" /></button><figcaption>${esc(m.caption)}</figcaption></figure>`;
  if (m.kind === 'video')
    return `<figure class="gallery__item gallery__item--wide"><video src="${m.src}" controls preload="metadata" playsinline></video><figcaption>${esc(m.caption)}</figcaption></figure>`;
  return `<figure class="gallery__item gallery__item--wide">
      <div class="model" data-model="${m.src}">
        <img src="${m.poster}" alt="" />
        <button class="btn btn--primary model__load">${icon('cube')} Load interactive 3D model</button>
        <p class="mono model__size">~14 MB</p>
      </div>
      <figcaption>${esc(m.caption)}</figcaption></figure>`;
}

function openProject(id: string) {
  const p = projects.find((x) => x.id === id);
  if (!p) return;
  const idx = projects.indexOf(p);
  const next = projects[(idx + 1) % projects.length];
  $('#modalBody').innerHTML = `
    <button class="modal__close" data-close aria-label="Close">×</button>
    <header class="modal__head">
      <p class="project__meta mono"><span>${p.year}</span><span>${esc(p.category)}</span><span>${esc(p.context)}</span></p>
      <h2 id="modalTitle">${esc(p.title)}</h2>
    </header>
    <div class="modal__grid">
      <div class="modal__text">
        ${p.summary.map((s) => `<p>${esc(s)}</p>`).join('')}
        ${(p.sections ?? []).map((s) => `<h3>${esc(s.title)}</h3><p>${esc(s.body)}</p>`).join('')}
        ${
          p.links?.length
            ? `<div class="modal__links">${p.links
                .map((l) => `<a class="btn btn--ghost btn--small" href="${l.href}" ${l.download ? 'download' : 'target="_blank" rel="noopener"'}>${icon(l.download ? 'doc' : 'arrow')} ${esc(l.label)}</a>`)
                .join('')}</div>`
            : ''
        }
      </div>
      <aside class="modal__tech">
        <h3 class="mono">Stack</h3>
        <ul>${p.tech.map((t) => `<li><strong>${esc(t.name)}</strong>${t.note ? `<small>${esc(t.note)}</small>` : ''}</li>`).join('')}</ul>
      </aside>
    </div>
    <div class="gallery">${p.media.map(mediaHtml).join('')}</div>
    <footer class="modal__foot">
      <button class="btn btn--ghost btn--small" data-next="${next.id}">Next: ${esc(next.title)} →</button>
    </footer>`;
  modal.showModal();
  modal.scrollTop = 0;
  document.documentElement.classList.add('locked');
  history.replaceState(null, '', `#project/${p.id}`);
}

function closeModal() {
  $$<HTMLVideoElement>('video', modal).forEach((v) => v.pause());
  modal.close();
}

modal.addEventListener('close', () => {
  document.documentElement.classList.remove('locked');
  $('#modalBody').innerHTML = '';
  if (location.hash.startsWith('#project/')) history.replaceState(null, '', '#work');
});
modal.addEventListener('click', async (e) => {
  const t = e.target as HTMLElement;
  if (t === modal || t.closest('[data-close]')) return closeModal();
  const nextBtn = t.closest<HTMLElement>('[data-next]');
  if (nextBtn) {
    $$<HTMLVideoElement>('video', modal).forEach((v) => v.pause());
    return openProject(nextBtn.dataset.next!);
  }
  const zoom = t.closest<HTMLElement>('[data-zoom]');
  if (zoom) return openLightbox(zoom.dataset.zoom!);
  const load = t.closest('.model__load');
  if (load) {
    const box = load.closest<HTMLElement>('.model')!;
    box.classList.add('is-loading');
    load.innerHTML = 'Loading 3D engine…';
    await import('@google/model-viewer');
    box.innerHTML = `<model-viewer src="${box.dataset.model}" camera-controls auto-rotate camera-orbit="30deg 75deg auto" shadow-intensity="1" exposure="1.05" environment-image="neutral" ar alt="3D model of the test rack" style="width:100%;height:100%;--poster-color:transparent"></model-viewer>`;
    box.classList.remove('is-loading');
    box.classList.add('is-live');
  }
});

/* ---------------- lightbox ---------------- */
const lightbox = $('#lightbox');
function openLightbox(src: string) {
  $<HTMLImageElement>('#lightboxImg').src = src;
  lightbox.hidden = false;
  requestAnimationFrame(() => lightbox.classList.add('is-open'));
}
function closeLightbox() {
  lightbox.classList.remove('is-open');
  setTimeout(() => (lightbox.hidden = true), 250);
}
lightbox.addEventListener('click', closeLightbox);
addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !lightbox.hidden) {
    e.preventDefault();
    closeLightbox();
  }
});

/* ---------------- toast ---------------- */
let toastTimer = 0;
function toast(msg: string) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('is-on');
  clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => t.classList.remove('is-on'), 2400);
}

/* ---------------- scroll effects ---------------- */
function scrollFx() {
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add('in');
          io.unobserve(en.target);
        }
      }),
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
  );
  $$('.reveal').forEach((el) => io.observe(el));

  // counters
  const cio = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      const el = en.target as HTMLElement;
      const target = Number(el.dataset.count);
      const start = performance.now();
      const dur = reduced ? 0 : 1400;
      const tick = (now: number) => {
        const k = dur ? Math.min(1, (now - start) / dur) : 1;
        el.textContent = String(Math.round(target * (1 - Math.pow(1 - k, 3))));
        if (k < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      cio.unobserve(el);
    });
  });
  $$('[data-count]').forEach((el) => cio.observe(el));

  // active nav link
  const links = $$<HTMLAnchorElement>('#navLinks a');
  const sio = new IntersectionObserver(
    (entries) =>
      entries.forEach((en) => {
        if (en.isIntersecting) links.forEach((l) => l.classList.toggle('is-active', l.hash === `#${en.target.id}`));
      }),
    { rootMargin: '-45% 0px -50% 0px' },
  );
  $$('main section[id]').forEach((s) => sio.observe(s));

  const nav = $('#nav');
  const progress = $('#progress');
  const timeline = $('#timeline');
  const fill = $('#timelineFill');
  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = scrollY;
      const max = document.documentElement.scrollHeight - innerHeight;
      progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
      nav.classList.toggle('nav--scrolled', y > 40);
      const r = timeline.getBoundingClientRect();
      const k = Math.min(1, Math.max(0, (innerHeight * 0.6 - r.top) / r.height));
      fill.style.transform = `scaleY(${k})`;
      ticking = false;
    });
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ---------------- pointer effects ---------------- */
function pointerFx() {
  if (!finePointer || reduced) return;
  const glow = $('#glow');
  addEventListener('pointermove', (e) => {
    glow.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    glow.classList.add('is-on');
  });

  // spotlight on cards
  document.addEventListener('pointermove', (e) => {
    const card = (e.target as HTMLElement).closest<HTMLElement>('.card');
    if (!card) return;
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${e.clientX - r.left}px`);
    card.style.setProperty('--my', `${e.clientY - r.top}px`);
  });

  // magnetic buttons
  $$('.magnetic').forEach((b) => {
    b.addEventListener('pointermove', (e) => {
      const r = b.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) * 0.25;
      const y = (e.clientY - r.top - r.height / 2) * 0.35;
      b.style.transform = `translate(${x}px, ${y}px)`;
    });
    b.addEventListener('pointerleave', () => (b.style.transform = ''));
  });

  // portrait tilt
  const tilt = $('#tilt');
  tilt.addEventListener('pointermove', (e) => {
    const r = tilt.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    tilt.style.transform = `perspective(900px) rotateY(${px * 14}deg) rotateX(${-py * 14}deg) scale(1.02)`;
    tilt.style.setProperty('--sx', `${(px + 0.5) * 100}%`);
    tilt.style.setProperty('--sy', `${(py + 0.5) * 100}%`);
  });
  tilt.addEventListener('pointerleave', () => (tilt.style.transform = ''));
}

/* ---------------- mobile nav ---------------- */
function mobileNav() {
  const toggle = $('#navToggle');
  const nav = $('#nav');
  const set = (open: boolean) => {
    nav.classList.toggle('nav--open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  };
  toggle.addEventListener('click', () => set(!nav.classList.contains('nav--open')));
  $$('#navLinks a').forEach((a) => a.addEventListener('click', () => set(false)));
}

/* ---------------- init ---------------- */
boot();
renderChip();
renderSkills();
renderProjects();
renderExperience();
renderContact();
typer();
scrollFx();
pointerFx();
mobileNav();
startMesh($<HTMLCanvasElement>('#mesh'));
$('#year').textContent = String(new Date().getFullYear());

const deep = location.hash.match(/^#project\/(.+)$/);
if (deep) openProject(deep[1]);
