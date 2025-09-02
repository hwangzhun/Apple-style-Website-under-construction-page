// --- i18n strings (6 languages) ---
const I18N = {
  'zh-CN': {
    pageTitle: '网站建设中...',
    title: '网站建设中...',
    subtitle: '我们正在打磨体验，很快见面。',
    infoTitle: '网站升级中',
    infoDesc: '我们正在进行例行维护与内容更新，以带来更顺滑、简洁且可靠的体验。'
  },
  'en': {
    pageTitle: 'Under Construction',
    title: 'Website under construction...',
    subtitle: 'We\'re polishing the experience. See you soon.',
    infoTitle: 'Site Upgrade in Progress',
    infoDesc: 'Routine maintenance and content updates are underway to deliver a smoother, simpler, and more reliable experience.'
  },
  'ja': {
    pageTitle: 'メンテナンス中...',
    title: 'ウェブサイトは現在建設中です...',
    subtitle: 'ただいま体験を磨いています。まもなく公開します。',
    infoTitle: 'サイトアップグレード中',
    infoDesc: 'よりスムーズでシンプル、信頼できる体験のため、定期メンテナンスと更新を実施しています。'
  },
  'ko': {
    pageTitle: '공사 중...',
    title: '웹사이트 제작 중...',
    subtitle: '더 나은 경험을 위해 다듬는 중입니다. 곧 만나요.',
    infoTitle: '사이트 업그레이드 진행 중',
    infoDesc: '더 부드럽고 단순하며 신뢰할 수 있는 경험을 위해 정기 점검과 업데이트를 진행하고 있습니다.'
  },
  'es': {
    pageTitle: 'En Construcción...',
    title: 'Sitio web en construcción...',
    subtitle: 'Estamos puliendo la experiencia. Nos vemos pronto.',
    infoTitle: 'Actualización del sitio en progreso',
    infoDesc: 'Mantenimiento rutinario y actualizaciones en curso para ofrecer una experiencia más fluida, simple y confiable.'
  },
  'fr': {
    pageTitle: 'En travaux...',
    title: 'Site Web en construction...',
    subtitle: 'Nous peaufinons l\'expérience. À très vite.',
    infoTitle: 'Mise à niveau du site en cours',
    infoDesc: 'Maintenance et mises à jour en cours pour une expérience plus fluide, simple et fiable.'
  }
};

// Elements
const titleEl = document.getElementById('titleText');
const subEl = document.getElementById('subtitleText');
const infoTitleEl = document.getElementById('infoTitle');
const infoDescEl = document.getElementById('infoDesc');
const langBtns = document.querySelectorAll('[data-lang]');
const textContent = document.getElementById('textContent');
const infoContent = document.getElementById('infoContent');
const loadingDots = document.getElementById('loadingDots');
const pageCard = document.getElementById('pageCard');
const loadingOverlay = document.getElementById('loadingOverlay');
const themeToggle = document.getElementById('themeToggle');

// Helper: set theme
function applyTheme(theme){
  if(theme === 'dark'){
    document.documentElement.setAttribute('data-theme','dark');
    themeToggle.setAttribute('aria-pressed','true');
    themeToggle.textContent = '☀️';
  } else {
    document.documentElement.removeAttribute('data-theme');
    themeToggle.setAttribute('aria-pressed','false');
    themeToggle.textContent = '🌙';
  }
  localStorage.setItem('uc-theme', theme);
}

// Determine initial theme: prefer saved, otherwise follow system; default 'light' if not available
(function initTheme(){
  const saved = localStorage.getItem('uc-theme');
  if(saved === 'dark' || saved === 'light') return applyTheme(saved);
  // no saved preference: follow system preference when available, else light
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(prefersDark ? 'dark' : 'light');
  // listen to system changes to update if user hasn't set a preference
  window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    const saved2 = localStorage.getItem('uc-theme');
    if(!saved2) applyTheme(e.matches ? 'dark' : 'light');
  });
})();

themeToggle.addEventListener('click', () => {
  const now = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  applyTheme(now);
});

// Loading overlay control
function hideLoading(){
  loadingOverlay.style.opacity = '0';
  loadingOverlay.style.pointerEvents = 'none';
  setTimeout(()=> loadingOverlay.remove(), 600);
}

// Compute a fixed min-height based on the longest localized content (so switching languages won't resize)
function computeMinHeight(){
  // create a temporary offscreen node to measure
  const temp = document.createElement('div');
  temp.style.position = 'absolute';
  temp.style.left = '-9999px';
  temp.style.top = '0';
  temp.style.width = getComputedStyle(pageCard).maxWidth || '640px';
  temp.style.padding = getComputedStyle(pageCard).padding;
  temp.style.boxSizing = 'border-box';
  temp.style.fontFamily = getComputedStyle(document.body).fontFamily;
  document.body.appendChild(temp);

  let maxH = 0;
  Object.keys(I18N).forEach(key => {
    temp.innerHTML = `
      <div style="padding:20px 12px 8px 12px; text-align:center;">
        <div style="height:72px; margin-bottom:8px;"></div>
        <h1 style="margin:6px 0 0; font-size:28px; font-weight:600">${I18N[key].title}</h1>
        <p style="margin:6px 0 0; color:var(--muted); font-size:15px">${I18N[key].subtitle}</p>
        <div style="height:18px"></div>
        <div style="height:6px; margin-bottom:18px;"></div>
        <div style="display:flex; gap:12px; align-items:flex-start; justify-content:center; text-align:center; padding:14px;">
          <div style="display:flex; gap:12px; align-items:center; justify-content:center; width:44px; height:44px; flex:0 0 44px;">
            <div style="width:8px; height:8px; border-radius:50%; background:var(--text); opacity:0.25;"></div>
            <div style="width:8px; height:8px; border-radius:50%; background:var(--text); opacity:0.25;"></div>
            <div style="width:8px; height:8px; border-radius:50%; background:var(--text); opacity:0.25;"></div>
            <div style="width:8px; height:8px; border-radius:50%; background:var(--text); opacity:0.25;"></div>
          </div>
          <div>
            <h3 style="margin:0 0 6px; font-size:16px">${I18N[key].infoTitle}</h3>
            <p style="margin:0; color:var(--muted)">${I18N[key].infoDesc}</p>
          </div>
        </div>
      </div>
    `;
    // force layout and measure
    const h = temp.getBoundingClientRect().height;
    if(h > maxH) maxH = h;
  });

  document.body.removeChild(temp);

  // Add some slack for padding, progress bar, language buttons, footer
  const slack = 160; // px - increased for better spacing
  const final = Math.ceil(maxH + slack);
  pageCard.style.minHeight = final + 'px';
}

// Language switch with fade animation
let langTransitioning = false;
function switchLanguage(code){
  if(langTransitioning) return;
  langTransitioning = true;
  // find closest key (normalize)
  const key = Object.keys(I18N).includes(code) ? code : (code.split('-')[0] || 'en');

  // fade out (only text content, not loading dots)
  textContent.classList.remove('fade-in');
  textContent.classList.add('fade-out');
  infoContent.classList.remove('fade-in');
  infoContent.classList.add('fade-out');

  setTimeout(()=>{
    // set texts
    titleEl.textContent = I18N[key].title;
    subEl.textContent = I18N[key].subtitle;
    infoTitleEl.textContent = I18N[key].infoTitle;
    infoDescEl.textContent = I18N[key].infoDesc;
    
    // update page title
    document.title = I18N[key].pageTitle;

    // fade in (only text content, not loading dots)
    textContent.classList.remove('fade-out');
    textContent.classList.add('fade-in');
    infoContent.classList.remove('fade-out');
    infoContent.classList.add('fade-in');

    // mark active pill
    document.querySelectorAll('[data-lang]').forEach(btn => {
      btn.classList.toggle('btn-dark', btn.getAttribute('data-lang') === key);
      btn.classList.toggle('btn-outline-secondary', btn.getAttribute('data-lang') !== key);
    });

    // store
    localStorage.setItem('uc-lang', key);
    langTransitioning = false;
  }, 260);
}

// Wire language buttons
document.querySelectorAll('[data-lang]').forEach(btn => {
  btn.addEventListener('click', ()=> switchLanguage(btn.getAttribute('data-lang')));
});

// init language: prefer stored, else navigator
(function initLang(){
  const saved = localStorage.getItem('uc-lang');
  if(saved && I18N[saved]){
    switchLanguage(saved);
  } else {
    const nav = (navigator.language || navigator.userLanguage || 'en').toLowerCase();
    const find = Object.keys(I18N).find(k => nav.startsWith(k.split('-')[0]));
    switchLanguage(find || 'en');
  }
})();

// compute min height on load and on resize (debounced)
window.addEventListener('load', ()=>{
  computeMinHeight();
  // hide loading overlay
  setTimeout(hideLoading, 420);
});

let rz; window.addEventListener('resize', ()=>{ clearTimeout(rz); rz = setTimeout(computeMinHeight, 180); });

// Accessibility: allow Shift+D to toggle theme (with smooth transition)
document.addEventListener('keydown', (e)=>{
  if(e.shiftKey && e.key.toLowerCase()==='d'){
    const now = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(now);
  }
});

// small enhancement: prevent abrupt initial layout flash by computing min-height ASAP
// run once synchronously if DOM already parsed
document.addEventListener('DOMContentLoaded', ()=>{
  try{ computeMinHeight(); }catch(e){ /* ignore */ }
});
