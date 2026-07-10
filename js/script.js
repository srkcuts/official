/* ============================================================
   SRK CUTS OFFICIAL — Interactions
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  gsap.registerPlugin(ScrollTrigger);

  /* ---------------- Theme toggle (dark / light) ---------------- */
  const root = document.documentElement;
  const themeButtons = document.querySelectorAll('.theme-toggle');

  const paintToggleIcons = () => {
    const isLight = root.getAttribute('data-theme') === 'light';
    themeButtons.forEach(btn => {
      const icon = btn.querySelector('i');
      const label = btn.querySelector('span');
      if (icon) icon.className = isLight ? 'fa-solid fa-moon' : 'fa-solid fa-sun';
      if (label) label.textContent = isLight ? 'Dark Mode' : 'Light Mode';
    });
  };

  const applyTheme = (theme) => {
    root.setAttribute('data-theme', theme);
    paintToggleIcons();
    try { localStorage.setItem('srk-theme', theme); } catch (e) {}
  };

  let savedTheme = 'dark';
  try { savedTheme = localStorage.getItem('srk-theme') || 'dark'; } catch (e) {}
  applyTheme(savedTheme);

  themeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      applyTheme(next);
    });
  });

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- Preloader-ish hero intro ---------------- */
  const heroTl = gsap.timeline({defaults:{ease:'power3.out'}});
  heroTl
    .from('.hero-eyebrow', {y:20, opacity:0, duration:.8}, 0.1)
    .from('.hero h1 span', {y:60, opacity:0, duration:1, stagger:.12}, 0.15)
    .from('.hero-sub', {y:30, opacity:0, duration:.9}, 0.65)
    .from('.hero-actions .magnetic', {y:24, opacity:0, duration:.7, stagger:.1}, 0.8)
    .from('.hero-scroll', {opacity:0, duration:1}, 1.1);

  /* ---------------- Navbar scroll state ---------------- */
  const navbar = document.querySelector('.navbar');
  const scrollProgress = document.querySelector('.scroll-progress');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
    const h = document.documentElement;
    const pct = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
    scrollProgress.style.width = pct + '%';
  });

  /* ---------------- Mobile drawer ---------------- */
  const hamburger = document.querySelector('.hamburger');
  const drawer = document.querySelector('.mobile-drawer');
  const drawerClose = document.querySelector('.drawer-close');
  hamburger?.addEventListener('click', () => drawer.classList.add('open'));
  drawerClose?.addEventListener('click', () => drawer.classList.remove('open'));
  drawer?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => drawer.classList.remove('open')));

  /* ---------------- Active nav link on scroll ---------------- */
  const sections = document.querySelectorAll('section[id]');
  const navA = document.querySelectorAll('.nav-links a, .mobile-nav a');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 140;
      if (window.scrollY >= top) current = sec.getAttribute('id');
    });
    navA.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  });

  /* ---------------- Section reveals ---------------- */
  if (!prefersReduced) {
    gsap.utils.toArray('.reveal').forEach((el, i) => {
      gsap.to(el, {
        opacity:1, y:0, duration:1, ease:'power3.out',
        scrollTrigger:{ trigger: el, start:'top 88%' }
      });
    });

    gsap.utils.toArray('.reveal-stagger').forEach(group => {
      const items = group.children;
      gsap.to(items, {
        opacity:1, y:0, duration:.9, stagger:.12, ease:'power3.out',
        scrollTrigger:{ trigger: group, start:'top 85%' }
      });
      gsap.set(items, {opacity:0, y:36});
    });
  } else {
    document.querySelectorAll('.reveal, .reveal-stagger *').forEach(el => { el.style.opacity=1; el.style.transform='none'; });
  }

  /* ---------------- Parallax hero image ---------------- */
  if (!prefersReduced) {
    gsap.to('.hero-bg img', {
      yPercent: 14, ease:'none',
      scrollTrigger:{ trigger:'.hero', start:'top top', end:'bottom top', scrub:true }
    });
  }

  /* ---------------- Counters ---------------- */
  const counters = document.querySelectorAll('.stat-num');
  counters.forEach(counter => {
    const target = +counter.dataset.count;
    ScrollTrigger.create({
      trigger: counter,
      start:'top 90%',
      once:true,
      onEnter:() => {
        gsap.fromTo(counter, {innerText:0}, {
          innerText:target,
          duration:2,
          ease:'power2.out',
          snap:{innerText:1},
          onUpdate: function(){ counter.innerText = Math.floor(counter.innerText) + '+'; }
        });
      }
    });
  });

  /* ---------------- Magnetic buttons ---------------- */
  if (!prefersReduced && window.matchMedia('(pointer:fine)').matches) {
    document.querySelectorAll('.magnetic').forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left - r.width/2;
        const y = e.clientY - r.top - r.height/2;
        gsap.to(btn, {x:x*0.25, y:y*0.35, duration:.4, ease:'power2.out'});
      });
      btn.addEventListener('mouseleave', () => gsap.to(btn, {x:0, y:0, duration:.5, ease:'elastic.out(1,0.4)'}));
    });
  }

  /* ---------------- Cursor glow ---------------- */
  const glow = document.querySelector('.cursor-glow');
  if (glow && window.matchMedia('(pointer:fine)').matches) {
    window.addEventListener('mousemove', e => {
      glow.style.opacity = 1;
      gsap.to(glow, {x:e.clientX, y:e.clientY, duration:.6, ease:'power3.out'});
    });
    document.addEventListener('mouseleave', () => glow.style.opacity = 0);
  }

  /* ---------------- Portfolio filter ---------------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.filter;
      portfolioItems.forEach(item => {
        const show = cat === 'all' || item.dataset.cat === cat;
        gsap.to(item, {
          opacity: show ? 1 : 0,
          scale: show ? 1 : .9,
          duration:.4,
          onStart:()=>{ if(show) item.style.display='block'; },
          onComplete:()=>{ if(!show) item.style.display='none'; }
        });
      });
    });
  });

  /* ---------------- Before / After slider ---------------- */
  const baWrap = document.querySelector('.ba-wrap');
  if (baWrap) {
    const afterWrap = baWrap.querySelector('.ba-after-wrap');
    const handle = baWrap.querySelector('.ba-handle');
    let dragging = false;

    const setPos = (clientX) => {
      const rect = baWrap.getBoundingClientRect();
      let pct = ((clientX - rect.left) / rect.width) * 100;
      pct = Math.max(0, Math.min(100, pct));
      afterWrap.style.width = pct + '%';
      handle.style.left = pct + '%';
    };

    handle.addEventListener('mousedown', () => dragging = true);
    window.addEventListener('mouseup', () => dragging = false);
    window.addEventListener('mousemove', (e) => { if (dragging) setPos(e.clientX); });

    handle.addEventListener('touchstart', () => dragging = true, {passive:true});
    window.addEventListener('touchend', () => dragging = false);
    window.addEventListener('touchmove', (e) => { if (dragging) setPos(e.touches[0].clientX); }, {passive:true});

    baWrap.addEventListener('click', (e) => setPos(e.clientX));
  }

  /* ---------------- Swiper: Testimonials ---------------- */
  if (document.querySelector('.testi-swiper')) {
    new Swiper('.testi-swiper', {
      slidesPerView:1,
      spaceBetween:24,
      loop:true,
      autoplay:{delay:4500, disableOnInteraction:false},
      pagination:{el:'.testi-pagination', clickable:true},
      breakpoints:{
        768:{slidesPerView:2},
        1100:{slidesPerView:3}
      }
    });
  }

  /* ---------------- Swiper: Portfolio (mobile carousel fallback not needed, grid used) --------- */

  /* ---------------- Newsletter / Contact form (demo only) ---------------- */
  document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"], .btn');
      if (btn) {
        const original = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-check"></i> Sent!';
        setTimeout(() => { btn.innerHTML = original; form.reset(); }, 2200);
      }
    });
  });

  /* ---------------- Floating image reveal on portfolio hover (tilt) --------------- */
  document.querySelectorAll('.portfolio-item').forEach(item => {
    item.addEventListener('mousemove', (e) => {
      const r = item.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      gsap.to(item, {rotateY: x*6, rotateX: -y*6, transformPerspective:800, duration:.5, ease:'power2.out'});
    });
    item.addEventListener('mouseleave', () => gsap.to(item, {rotateY:0, rotateX:0, duration:.6}));
  });

});
