import { slideUp, slideDown, slideToggle} from "@js/common/functions.js"
import './header.scss'

// const navMenu = document.querySelector('.nav-menu');
// const navMenuList = document.querySelector('.nav-menu__list');
// const navMenuBtn = document.querySelector('.nav-menu__btn');

// if (navMenu && navMenuList && navMenuBtn) {
//   slideUp(navMenuList, 0);

//   navMenuBtn.addEventListener('click', function () {
//     const isOpen = navMenu.classList.contains('_active');

//     slideToggle(navMenuList, 300);

//     if (isOpen) {
//       setTimeout(() => {
//         navMenu.classList.remove('_active');
//       }, 300);
//     } else {
//       navMenu.classList.add('_active');
//     }
//   });

//   navMenuList.addEventListener('click', function (e) {
//     const link = e.target.closest('.nav-menu__link');
//     if (!link) return;

//     slideUp(navMenuList, 300);
//     setTimeout(() => {
//       navMenu.classList.remove('_active');
//     }, 300);
//   });
//  document.addEventListener('click', function (e) {
//     const isClickInside = e.target.closest('.nav-menu');
//     const isClickOnBtn = e.target.closest('.nav-menu__btn');

//     if (!isClickInside && !isClickOnBtn && navMenu.classList.contains('_active')) {
//       slideUp(navMenuList, 300);
//       setTimeout(() => {
//         navMenu.classList.remove('_active');
//       }, 300);
//     }
//   });
// }


const navMenu = document.querySelector('.nav-menu');
const navMenuList = document.querySelector('.nav-menu__list');
const navMenuBtn = document.querySelector('.nav-menu__btn');

const mediaQuery = window.matchMedia('(min-width: 62.061em)');

// отключаем watcherCallback после клика
let isManualNav = false;
let manualTargetId = null;
let manualNavTimeout = null;


function initNavMenu() {
  if (!navMenu || !navMenuList || !navMenuBtn) return;

  let isActive = false;



  const handleClickToggle = () => {
    const isOpen = navMenu.classList.contains('_active');

    slideToggle(navMenuList, 300);


    if (isOpen) {
      setTimeout(() => {
        navMenu.classList.remove('_active');
        navMenuList.style.minWidth = '';
      }, 300);
    } else {
      navMenu.classList.add('_active');
    }

  };

  const handleClickLink = (e) => {
    const link = e.target.closest('.nav-menu__link');
    if (!link) return;

    // Устанавливаем флаг ручного клика и целевой ID
     const selector = link.dataset.flsScrollto;
    if (selector) {
      const targetSection = document.querySelector(selector);
      if (targetSection) {
        isManualNav = true;
        manualTargetId = targetSection.id || null;
      }
    }

    const btnTextSpan = navMenuBtn.querySelector('span');
    if (btnTextSpan) {
      btnTextSpan.textContent = link.textContent.trim();
    }

    slideUp(navMenuList, 300);
    setTimeout(() => {
      navMenu.classList.remove('_active');
    }, 300);
  };

  const handleClickOutside = (e) => {
    const isClickInside = e.target.closest('.nav-menu');
    const isClickOnBtn = e.target.closest('.nav-menu__btn');

    if (!isClickInside && !isClickOnBtn && navMenu.classList.contains('_active')) {
      slideUp(navMenuList, 300);
      setTimeout(() => {
        navMenu.classList.remove('_active');
        // navMenuList.style.minWidth = '';
      }, 300);
    }
  };

  function enable() {
    if (isActive) return;
    isActive = true;

    slideUp(navMenuList, 0);

    navMenuBtn.addEventListener('click', handleClickToggle);
    navMenuList.addEventListener('click', handleClickLink);
    document.addEventListener('click', handleClickOutside);
  }

  function disable() {
    if (!isActive) return;
    isActive = false;

    navMenu.classList.remove('_active');
    slideDown(navMenuList, 0);

    navMenuBtn.removeEventListener('click', handleClickToggle);
    navMenuList.removeEventListener('click', handleClickLink);
    document.removeEventListener('click', handleClickOutside);
  }

  function checkMedia(e) {
    if (e.matches) {
      enable();
    } else {
      disable();
    }
  }


  // Слушаем событие, когда секция попадает во viewport (обрабатывается в твоём pageNavigation)
  document.addEventListener('watcherCallback', (e) => {
    if (!mediaQuery.matches || !e.detail || !e.detail.entry.isIntersecting) return;

    const target = e.detail.entry.target;

    // Проверка — если цель совпала с ручным переходом, сбрасываем флаг
    if (isManualNav && manualTargetId && target.id === manualTargetId) {
      isManualNav = false;
      manualTargetId = null;
    }

    if (isManualNav) return;

    // Обновление текста в кнопке
    let currentLink = null;
    if (target.id) {
      currentLink = document.querySelector(`[data-fls-scrollto="#${target.id}"]`);
    } else {
      for (const cls of target.classList) {
        currentLink = document.querySelector(`[data-fls-scrollto=".${cls}"]`);
        if (currentLink) break;
      }
    }

    if (currentLink && navMenuBtn) {
      const btnSpan = navMenuBtn.querySelector('span');
      if (btnSpan) {
        btnSpan.textContent = currentLink.textContent.trim();
      }
    }
  });

  // Обработчик всех кликов по data-fls-scrollto вне .nav-menu__list
  document.addEventListener('click', (e) => {
    const el = e.target.closest('[data-fls-scrollto]');
    if (!el) return;

    // Пропускаем, если клик был по пункту навигации
    if (el.closest('.nav-menu__list')) return;

    const selector = el.dataset.flsScrollto;
    if (!selector) return;

    const target = document.querySelector(selector);
    if (!target) return;

    // Если цель не имеет data-fls-watcher="navigator" — сбрасываем флаг
    if (!target.hasAttribute('data-fls-watcher') || target.dataset.flsWatcher !== 'navigator') {
      isManualNav = true;
      manualTargetId = target.id || null;

      clearTimeout(manualNavTimeout);
      manualNavTimeout = setTimeout(() => {
        isManualNav = false;
        manualTargetId = null;
      }, 800);
    }

  });


  checkMedia(mediaQuery);

  mediaQuery.addEventListener('change', checkMedia);
}

window.addEventListener('load', initNavMenu);
