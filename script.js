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
  const isMobile = window.innerWidth <= 640;
  
  // 创建临时测量容器，完全复制pageCard的结构和样式
  const temp = document.createElement('div');
  temp.style.position = 'absolute';
  temp.style.left = '-9999px';
  temp.style.top = '0';
  temp.style.visibility = 'hidden';
  
  // 使用pageCard的实际宽度，而不是maxWidth
  const pageCardRect = pageCard.getBoundingClientRect();
  temp.style.width = pageCardRect.width + 'px';
  temp.style.padding = getComputedStyle(pageCard).padding;
  temp.style.boxSizing = 'border-box';
  temp.style.fontFamily = getComputedStyle(document.body).fontFamily;
  temp.style.fontSize = getComputedStyle(document.body).fontSize;
  temp.style.lineHeight = getComputedStyle(document.body).lineHeight;
  temp.style.borderRadius = getComputedStyle(pageCard).borderRadius;
  temp.style.display = 'flex';
  temp.style.flexDirection = 'column';
  
  // 复制所有相关的CSS变量
  const computedStyle = getComputedStyle(document.documentElement);
  temp.style.setProperty('--text', computedStyle.getPropertyValue('--text'));
  temp.style.setProperty('--muted', computedStyle.getPropertyValue('--muted'));
  temp.style.setProperty('--card-bg', computedStyle.getPropertyValue('--card-bg'));
  temp.style.setProperty('--glass-shadow', computedStyle.getPropertyValue('--glass-shadow'));
  
  document.body.appendChild(temp);

  let maxH = 0;
  let heightDetails = {}; // 记录每种语言的高度详情
  
  Object.keys(I18N).forEach(key => {
    // 使用实际的响应式字体大小
    const titleFontSize = isMobile ? '22px' : '28px';
    const subtitleFontSize = isMobile ? '14px' : '15px';
    const infoTitleFontSize = isMobile ? '15px' : '16px';
    const infoDescFontSize = isMobile ? '13px' : '14px';
    
    // 创建完整的pageCard结构
    temp.innerHTML = `
      <!-- Controls -->
      <div style="position:absolute; right:18px; top:18px; display:flex; gap:8px; align-items:center;">
        <button style="width:40px; height:36px; border-radius:10px; display:inline-flex; align-items:center; justify-content:center;">🌙</button>
      </div>

      <!-- Hero Section -->
      <div style="display:flex; flex-direction:column; align-items:center; gap:8px; padding:20px 12px 8px 12px; text-align:center;">
        <span style="width:72px; height:72px; border-radius:18px; display:inline-block; background:url('https://cdn.jsdelivr.net/gh/hwangzhun/Apple-style-Website-under-construction-page@main/Settings.svg') center/contain no-repeat; background-size:60%;"></span>
        <div>
          <h1 style="margin:6px 0 0; font-size:${titleFontSize}; font-weight:600; line-height:1.3">${I18N[key].title}</h1>
          <p style="margin:0; color:var(--muted); font-size:${subtitleFontSize}; line-height:1.5">${I18N[key].subtitle}</p>
        </div>
        
        <!-- Progress Bar -->
        <div style="margin-top:18px; width:100%; max-width:640px; margin-left:auto; margin-right:auto;">
          <div style="height:6px; border-radius:999px; background:linear-gradient(90deg, rgba(0, 0, 0, 0.06), rgba(0, 0, 0, 0.03)); overflow:hidden;">
            <div style="height:100%; width:50%; border-radius:999px; background:linear-gradient(90deg, #007aff, #00c6ff); transform:translateX(-100%);"></div>
          </div>
        </div>
      </div>

      <!-- Info Card -->
      <div style="margin-top:30px; border-radius:14px; padding:14px; background:transparent; display:flex; gap:12px; align-items:flex-start; box-shadow:none; justify-content:center; text-align:center;">
        <div style="flex:0 0 44px; display:flex; gap:12px; align-items:center; justify-content:center; margin-bottom:20px;">
          <div style="width:8px; height:8px; border-radius:50%; background:var(--text); opacity:0.25;"></div>
          <div style="width:8px; height:8px; border-radius:50%; background:var(--text); opacity:0.25;"></div>
          <div style="width:8px; height:8px; border-radius:50%; background:var(--text); opacity:0.25;"></div>
          <div style="width:8px; height:8px; border-radius:50%; background:var(--text); opacity:0.25;"></div>
        </div>
        <div>
          <h3 style="margin:0 0 6px; font-size:${infoTitleFontSize}; line-height:1.3">${I18N[key].infoTitle}</h3>
          <p style="margin:0; color:var(--muted); font-size:${infoDescFontSize}; line-height:1.5">${I18N[key].infoDesc}</p>
        </div>
      </div>

      <!-- Language Buttons -->
      <div style="display:flex; flex-wrap:wrap; gap:8px; justify-content:center; margin-top:auto; margin-bottom:18px;">
        <button style="border-radius:999px; padding:6px 12px; font-size:14px;">中文</button>
        <button style="border-radius:999px; padding:6px 12px; font-size:14px;">English</button>
        <button style="border-radius:999px; padding:6px 12px; font-size:14px;">日本語</button>
        <button style="border-radius:999px; padding:6px 12px; font-size:14px;">한국어</button>
        <button style="border-radius:999px; padding:6px 12px; font-size:14px;">Español</button>
        <button style="border-radius:999px; padding:6px 12px; font-size:14px;">Français</button>
      </div>

      <!-- Footer -->
      <footer style="margin-top:0; text-align:center; color:var(--muted); font-size:13px; padding-top:0;">© 2025 Hwangzhun</footer>
    `;
    
    // 强制布局并测量
    const h = temp.getBoundingClientRect().height;
    heightDetails[key] = h;
    if(h > maxH) maxH = h;
  });

  document.body.removeChild(temp);

  // 设置计算出的最大高度
  const final = Math.ceil(maxH);
  pageCard.style.minHeight = final + 'px';
  
  // 输出详细的高度信息用于调试
  console.log(`=== 高度计算完成 (${isMobile ? '移动端' : '桌面端'}) ===`);
  console.log(`测量容器宽度: ${pageCardRect.width}px`);
  console.log(`视口宽度: ${window.innerWidth}px`);
  console.log('各语言高度详情:');
  Object.entries(heightDetails).forEach(([lang, height]) => {
    console.log(`  ${lang}: ${Math.ceil(height)}px`);
  });
  console.log(`最大高度: ${final}px`);
  console.log(`设置的最小高度: ${final}px`);
  console.log('========================');
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

// 优化的 resize 监听器
let resizeTimeout;
let lastWidth = window.innerWidth;

window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    // 只有在宽度变化时才重新计算（避免移动端滚动触发）
    if (Math.abs(window.innerWidth - lastWidth) > 10) {
      computeMinHeight();
      lastWidth = window.innerWidth;
    }
  }, 250); // 增加延迟，避免频繁触发
});

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
