/* ============================================================
   PORTFOLIO MEHRAN ULFATI — Script
   ============================================================ */

const OWNER_EMAIL = 'mehran.ict@gmail.com';

/* ---------- Tab Switching ---------- */
function switchTab(name){
  document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(l=>l.classList.remove('active'));

  const panel = document.getElementById('tab-'+name);
  const link  = document.querySelector(`.nav-item[data-tab="${name}"]`);
  if(panel) panel.classList.add('active');
  if(link)  link.classList.add('active');

  const nav = document.getElementById('mainNav');
  const toggle = document.getElementById('menuToggle');
  if(nav) nav.classList.remove('open');
  if(toggle) toggle.classList.remove('active');

  setTimeout(()=>{ observeReveals(); animateBars(); }, 80);
  window.scrollTo({top:0,behavior:'smooth'});
}

/* ---------- Typing Effect ---------- */
const roles = [
  'توسعه‌دهنده وب',
  'طراح سایت',
  'عاشق یادگیری',
  'سازنده پروژه‌های کاربردی'
];
let rIdx = 0, cIdx = 0, deleting = false;
const roleEl = document.getElementById('roleTyping');

function typeRole(){
  if(!roleEl) return;
  const cur = roles[rIdx];
  if(deleting){
    roleEl.textContent = cur.substring(0, --cIdx);
  } else {
    roleEl.textContent = cur.substring(0, ++cIdx);
  }
  let delay = deleting ? 45 : 95;
  if(!deleting && cIdx === cur.length){
    delay = 1800; deleting = true;
  } else if(deleting && cIdx === 0){
    deleting = false;
    rIdx = (rIdx + 1) % roles.length;
    delay = 400;
  }
  setTimeout(typeRole, delay);
}
typeRole();

/* ---------- Hamburger ---------- */
const toggle = document.getElementById('menuToggle');
const nav = document.getElementById('mainNav');
if(toggle) toggle.addEventListener('click',()=>{
  nav.classList.toggle('open');
  toggle.classList.toggle('active');
});

/* ---------- Toast ---------- */
function showToast(msg, type='info'){
  const toast = document.getElementById('toast');
  if(!toast) return;
  toast.textContent = msg;
  toast.style.borderColor = type==='success' ? 'rgba(34,197,94,.6)'
                        : type==='error'   ? 'rgba(239,68,68,.6)'
                        : 'rgba(251,191,36,.5)';
  toast.classList.add('show');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(()=> toast.classList.remove('show'), 4000);
}

/* ---------- Progress Bars ---------- */
function animateBars(){
  document.querySelectorAll('.tab.active .skill-fill, .tab.active .mini-fill').forEach(el=>{
    const w = el.dataset.w || 0;
    el.style.width = '0%';
    requestAnimationFrame(()=> setTimeout(()=>{ el.style.width = w + '%'; }, 80));
  });
}

/* ---------- Counters ---------- */
const counted = new WeakSet();
function animateCounters(){
  document.querySelectorAll('.tab.active [data-count]').forEach(el=>{
    if(counted.has(el)) return;
    counted.add(el);
    const target = parseInt(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const dur = 1500;
    const start = performance.now();
    function step(now){
      const p = Math.min((now - start) / dur, 1);
      const e = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.floor(e * target) + suffix;
      if(p < 1) requestAnimationFrame(step);
      else el.textContent = target + suffix;
    }
    requestAnimationFrame(step);
  });
}

/* ---------- Reveal Observer ---------- */
let observer;
function observeReveals(){
  if(!observer){
    observer = new IntersectionObserver(entries=>{
      entries.forEach(e=>{
        if(e.isIntersecting){
          e.target.classList.add('visible');
          observer.unobserve(e.target);
        }
      });
    },{ threshold: 0.12 });
  }
  document.querySelectorAll('.tab.active .reveal:not(.visible)').forEach(el=>{
    observer.observe(el);
  });
  animateCounters();
}

/* ---------- Contact Form (mailto) ---------- */
const contactForm = document.getElementById('contactForm');
if(contactForm){
  contactForm.addEventListener('submit', function(e){
    e.preventDefault();
    const name  = document.getElementById('cName').value.trim();
    const email = document.getElementById('cEmail').value.trim();
    const msg   = document.getElementById('cMsg').value.trim();
    const msgEl = document.getElementById('formMsg');

    if(!name || !email || !msg){
      msgEl.style.color = '#f87171';
      msgEl.textContent = '⚠️ لطفاً همه فیلدها را پر کنید';
      return;
    }

    /* Try FormSubmit silently */
    const fsForm = document.createElement('form');
    fsForm.action = 'https://formsubmit.co/' + OWNER_EMAIL;
    fsForm.method = 'POST';
    fsForm.style.display = 'none';
    [
      ['_subject', `📬 پیام جدید از ${name}`],
      ['_template', 'table'],
      ['_captcha', 'false'],
      ['نام', name],
      ['ایمیل', email],
      ['پیام', msg]
    ].forEach(([k,v])=>{
      const i = document.createElement('input');
      i.type = 'hidden'; i.name = k; i.value = v;
      fsForm.appendChild(i);
    });
    document.body.appendChild(fsForm);
    const fsData = new FormData(fsForm);
    fetch(fsForm.action, { method:'POST', body: fsData, headers:{Accept:'application/json'} })
      .catch(()=>{});

    /* Build mailto */
    const body =
      `پیام جدید از پورتفولیو\r\n` +
      `=====================================\r\n\r\n` +
      `👤 نام: ${name}\r\n` +
      `✉️ ایمیل: ${email}\r\n\r\n` +
      `📝 پیام:\r\n${msg}\r\n\r\n` +
      `=====================================\r\n`;

    const mailtoHref = `mailto:${OWNER_EMAIL}?subject=${encodeURIComponent('📬 پیام جدید از ' + name)}&body=${encodeURIComponent(body)}`;

    const choice = confirm(
      'پیام شما آماده است!\n\n' +
      'OK = ارسال از طریق ایمیل خودتان (مطمئن‌ترین راه)\n' +
      'Cancel = باز شدن واتساپ'
    );

    if(choice){
      window.location.href = mailtoHref;
      msgEl.style.color = '#22c55e';
      msgEl.textContent = '✅ ایمیل شما آماده ارسال شد!';
      showToast(`✅ ${name} عزیز، پیام آماده ارسال شد`, 'success');
      this.reset();
    } else {
      const wa = encodeURIComponent(
        `📬 پیام از پورتفولیو\n\n👤 ${name}\n✉️ ${email}\n\n${msg}`
      );
      window.open(`https://wa.me/93793220466?text=${wa}`, '_blank');
      msgEl.style.color = '#22c55e';
      msgEl.textContent = '✅ واتساپ باز شد!';
      showToast(`✅ واتساپ باز شد`, 'success');
      this.reset();
    }
  });
}

/* ---------- Year ---------- */
const yEl = document.getElementById('year');
if(yEl) yEl.textContent = new Date().getFullYear();

/* ---------- Init ---------- */
window.addEventListener('load', ()=>{
  observeReveals();
  animateBars();
  setTimeout(()=> showToast('👋 به پورتفولیوی من خوش آمدید!'), 900);
});