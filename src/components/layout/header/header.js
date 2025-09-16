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

// Условия для десктопа
const mediaQuery = window.matchMedia('(min-width: 62.061em)');

function initNavMenu() {
  if (!navMenu || !navMenuList || !navMenuBtn) return;

  let isActive = false;

  const handleClickToggle = () => {
    const isOpen = navMenu.classList.contains('_active');

    slideToggle(navMenuList, 300);

    if (isOpen) {
      setTimeout(() => {
        navMenu.classList.remove('_active');
      }, 300);
    } else {
      navMenu.classList.add('_active');
    }
  };

  const handleClickLink = (e) => {
    const link = e.target.closest('.nav-menu__link');
    if (!link) return;

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
    slideDown(navMenuList, 0); // Раскрыть список при отключении

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

  // Проверка при загрузке
  checkMedia(mediaQuery);

  // Слушаем изменение ширины
  mediaQuery.addEventListener('change', checkMedia);
}

window.addEventListener('load', initNavMenu);
