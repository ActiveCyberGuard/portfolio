/* ═══════════════════════════════════════════════════════
   Al-Amin Portfolio — script.js  (Ultra v2)
═══════════════════════════════════════════════════════ */
'use strict';

document.addEventListener('DOMContentLoaded', () => {

/* ─────────────────────────────────────────────
   1. LOADER
───────────────────────────────────────────── */
const loader = document.getElementById('loader');
window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('gone'), 1000);
});

/* ─────────────────────────────────────────────
   2. CUSTOM CURSOR
───────────────────────────────────────────── */
const dot  = document.querySelector('.cursor-dot');
const ring = document.querySelector('.cursor-ring');
let mx = -200, my = -200, rx = -200, ry = -200;

document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
});

(function trackRing() {
    rx += (mx - rx) * .13;
    ry += (my - ry) * .13;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(trackRing);
})();

document.querySelectorAll('a, button, .proj-card, .info-card, .cmethod, .pill').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('big'));
    el.addEventListener('mouseleave', () => ring.classList.remove('big'));
});

/* ─────────────────────────────────────────────
   3. PARTICLE CANVAS
───────────────────────────────────────────── */
const cvs = document.getElementById('canvas');
const ctx = cvs.getContext('2d');

function resize() { cvs.width = innerWidth; cvs.height = innerHeight; }
resize();
window.addEventListener('resize', resize);

const PTS = [];
const N = 70;

class Pt {
    constructor() { this.init(true); }
    init(rand) {
        this.x  = Math.random() * cvs.width;
        this.y  = rand ? Math.random() * cvs.height : cvs.height + 5;
        this.vx = (Math.random() - .5) * .35;
        this.vy = -(Math.random() * .45 + .1);
        this.r  = Math.random() * 1.6 + .5;
        this.a  = Math.random() * .55 + .1;
        this.hue= Math.random() > .55 ? '#e93b67' : '#b0c4c3';
    }
    step() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.y < -8) this.init(false);
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = this.hue;
        ctx.globalAlpha = this.a;
        ctx.fill();
    }
}

for (let i = 0; i < N; i++) PTS.push(new Pt());

function connectPts() {
    for (let i = 0; i < PTS.length; i++) {
        for (let j = i + 1; j < PTS.length; j++) {
            const dx = PTS[i].x - PTS[j].x;
            const dy = PTS[i].y - PTS[j].y;
            const d  = Math.sqrt(dx*dx + dy*dy);
            if (d < 110) {
                ctx.beginPath();
                ctx.moveTo(PTS[i].x, PTS[i].y);
                ctx.lineTo(PTS[j].x, PTS[j].y);
                ctx.strokeStyle = '#e93b67';
                ctx.globalAlpha = (1 - d / 110) * .07;
                ctx.lineWidth = .6;
                ctx.stroke();
            }
        }
    }
}

(function loop() {
    ctx.clearRect(0, 0, cvs.width, cvs.height);
    ctx.globalAlpha = 1;
    PTS.forEach(p => { p.step(); p.draw(); });
    connectPts();
    requestAnimationFrame(loop);
})();

/* ─────────────────────────────────────────────
   4. NAVBAR SCROLL + ACTIVE LINK
───────────────────────────────────────────── */
const nav = document.getElementById('nav');
const allSections = document.querySelectorAll('section, header');
const navAs = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', scrollY > 50);

    // active link
    let active = '';
    allSections.forEach(s => {
        if (scrollY >= s.offsetTop - 130) active = s.id;
    });
    navAs.forEach(a => {
        a.classList.remove('active-link');
        if (a.getAttribute('href') === '#' + active) a.classList.add('active-link');
    });
});

/* ─────────────────────────────────────────────
   5. HAMBURGER
───────────────────────────────────────────── */
const burger   = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');

burger.addEventListener('click', () => {
    burger.classList.toggle('open');
    navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
        burger.classList.remove('open');
        navLinks.classList.remove('open');
    });
});

/* ─────────────────────────────────────────────
   6. TYPEWRITER
───────────────────────────────────────────── */
const roles = [
    'Full-Stack Developer',
    'Frontend Engineer',
    'Vue & React Expert',
    'UI / UX Enthusiast',
    'Problem Solver 🚀'
];
const tw = document.getElementById('typewriter');
let ri = 0, ci = 0, del = false;

function type() {
    const cur = roles[ri];
    tw.textContent = del ? cur.slice(0, --ci) : cur.slice(0, ++ci);
    if (!del && ci === cur.length)  { del = true;  setTimeout(type, 1800); return; }
    if (del && ci === 0)            { del = false; ri = (ri + 1) % roles.length; }
    setTimeout(type, del ? 45 : 75);
}
setTimeout(type, 600);

/* ─────────────────────────────────────────────
   7. SCROLL REVEAL
───────────────────────────────────────────── */
const revEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
const revObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.classList.add('visible');
            revObs.unobserve(e.target);
        }
    });
}, { threshold: 0.12 });
revEls.forEach(el => revObs.observe(el));

/* ─────────────────────────────────────────────
   8. STAT COUNTER (hero)
───────────────────────────────────────────── */
function animateCount(el) {
    const target = parseInt(el.dataset.count, 10);
    let current = 0;
    const step = Math.ceil(target / 40);
    const t = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = current;
        if (current >= target) clearInterval(t);
    }, 40);
}

const statObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.querySelectorAll('.stat-num').forEach(animateCount);
            statObs.unobserve(e.target);
        }
    });
}, { threshold: .5 });
const heroWrap = document.querySelector('.hero-stats');
if (heroWrap) statObs.observe(heroWrap);

/* ─────────────────────────────────────────────
   9. SKILL PROGRESS BARS
───────────────────────────────────────────── */
const progObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            const fill = e.target.querySelector('.prog-fill');
            const num  = e.target.querySelector('.prog-label span');
            const pct  = parseInt(e.target.dataset.pct, 10);
            fill.style.width = pct + '%';

            let c = 0;
            const t = setInterval(() => {
                c = Math.min(c + 2, pct);
                if (num) num.textContent = c + '%';
                if (c >= pct) clearInterval(t);
            }, 18);

            progObs.unobserve(e.target);
        }
    });
}, { threshold: .4 });
document.querySelectorAll('.prog-item').forEach(el => progObs.observe(el));

/* ─────────────────────────────────────────────
   10. PROJECT CARD 3D TILT
───────────────────────────────────────────── */
document.querySelectorAll('.proj-card').forEach(card => {
    card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2)  / (r.width  / 2);
        const y = (e.clientY - r.top  - r.height / 2) / (r.height / 2);
        card.style.transform = `perspective(700px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-8px)`;
    });
    card.addEventListener('mouseleave', () => {
        card.style.transition = 'transform .6s var(--ease)';
        card.style.transform  = '';
        setTimeout(() => card.style.transition = '', 600);
    });
    card.addEventListener('mouseenter', () => {
        card.style.transition = 'transform .08s, box-shadow .4s, border-color .4s';
    });
});

/* ─────────────────────────────────────────────
   11. CONTACT FORM
───────────────────────────────────────────── */
const form   = document.getElementById('contactForm');
const formOk = document.getElementById('formOk');

if (form) {
    form.addEventListener('submit', e => {
        e.preventDefault();
        const btn = form.querySelector('.submit-btn');
        const origHtml = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Sending…';
        btn.disabled  = true;
        btn.style.opacity = '.7';

        setTimeout(() => {
            btn.innerHTML   = origHtml;
            btn.disabled    = false;
            btn.style.opacity = '';
            form.reset();
            formOk.style.display = 'flex';
            setTimeout(() => formOk.style.display = 'none', 4500);
        }, 1600);
    });
}

/* ─────────────────────────────────────────────
   12. SMOOTH SCROLL
───────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        const t = document.querySelector(a.getAttribute('href'));
        if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
    });
});

/* ─────────────────────────────────────────────
   13. FORM INPUT — floating label glow
───────────────────────────────────────────── */
document.querySelectorAll('.form-field input, .form-field textarea').forEach(inp => {
    inp.addEventListener('focus', () => {
        inp.closest('.form-field').querySelector('label').style.color = '#e93b67';
    });
    inp.addEventListener('blur', () => {
        inp.closest('.form-field').querySelector('label').style.color = '';
    });
});

/* ─────────────────────────────────────────────
   14. PARALLAX — subtle hero photo shift
───────────────────────────────────────────── */
const photoFrame = document.querySelector('.photo-frame');
if (photoFrame) {
    window.addEventListener('mousemove', e => {
        const px = (e.clientX / innerWidth  - .5) * 14;
        const py = (e.clientY / innerHeight - .5) * 10;
        photoFrame.style.transform = `translate(${px}px, ${py}px)`;
    });
}

/* ─────────────────────────────────────────────
   15. PILL STAGGER ANIMATION on scroll
───────────────────────────────────────────── */
document.querySelectorAll('.skill-box').forEach(box => {
    const pills = box.querySelectorAll('.pill');
    const pillObs = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
            pills.forEach((p, i) => {
                p.style.opacity = '0';
                p.style.transform = 'translateX(-16px)';
                setTimeout(() => {
                    p.style.transition = 'opacity .45s ease, transform .45s ease';
                    p.style.opacity = '1';
                    p.style.transform = '';
                }, i * 80);
            });
            pillObs.unobserve(box);
        }
    }, { threshold: .3 });
    pillObs.observe(box);
});

console.log('%c🚀 Al-Amin Portfolio v2 Loaded', 'color:#e93b67;font-size:14px;font-weight:900;background:#0d0e10;padding:6px 12px;border-radius:4px;');

}); // end DOMContentLoaded