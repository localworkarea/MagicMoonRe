(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) return;
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) processPreload(link);
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") continue;
      for (const node of mutation.addedNodes) if (node.tagName === "LINK" && node.rel === "modulepreload") processPreload(node);
    }
  }).observe(document, {
    childList: true,
    subtree: true
  });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials") fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep) return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
const isMobile = { Android: function() {
  return navigator.userAgent.match(/Android/i);
}, BlackBerry: function() {
  return navigator.userAgent.match(/BlackBerry/i);
}, iOS: function() {
  return navigator.userAgent.match(/iPhone|iPad|iPod/i);
}, Opera: function() {
  return navigator.userAgent.match(/Opera Mini/i);
}, Windows: function() {
  return navigator.userAgent.match(/IEMobile/i);
}, any: function() {
  return isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows();
} };
function addLoadedAttr() {
  if (!document.documentElement.hasAttribute("data-fls-preloader-loading")) {
    window.addEventListener("load", function() {
      setTimeout(function() {
        document.documentElement.setAttribute("data-fls-loaded", "");
      }, 0);
    });
  }
}
function getHash() {
  if (location.hash) {
    return location.hash.replace("#", "");
  }
}
let slideUp = (target, duration = 500, showmore = 0) => {
  if (!target.classList.contains("--slide")) {
    target.classList.add("--slide");
    target.style.transitionProperty = "height, margin, padding";
    target.style.transitionDuration = duration + "ms";
    target.style.height = `${target.offsetHeight}px`;
    target.offsetHeight;
    target.style.overflow = "hidden";
    target.style.height = showmore ? `${showmore}px` : `0px`;
    target.style.paddingTop = 0;
    target.style.paddingBottom = 0;
    target.style.marginTop = 0;
    target.style.marginBottom = 0;
    window.setTimeout(() => {
      target.hidden = !showmore ? true : false;
      !showmore ? target.style.removeProperty("height") : null;
      target.style.removeProperty("padding-top");
      target.style.removeProperty("padding-bottom");
      target.style.removeProperty("margin-top");
      target.style.removeProperty("margin-bottom");
      !showmore ? target.style.removeProperty("overflow") : null;
      target.style.removeProperty("transition-duration");
      target.style.removeProperty("transition-property");
      target.classList.remove("--slide");
      document.dispatchEvent(new CustomEvent("slideUpDone", {
        detail: {
          target
        }
      }));
    }, duration);
  }
};
let slideDown = (target, duration = 500, showmore = 0) => {
  if (!target.classList.contains("--slide")) {
    target.classList.add("--slide");
    target.hidden = target.hidden ? false : null;
    showmore ? target.style.removeProperty("height") : null;
    let height = target.offsetHeight;
    target.style.overflow = "hidden";
    target.style.height = showmore ? `${showmore}px` : `0px`;
    target.style.paddingTop = 0;
    target.style.paddingBottom = 0;
    target.style.marginTop = 0;
    target.style.marginBottom = 0;
    target.offsetHeight;
    target.style.transitionProperty = "height, margin, padding";
    target.style.transitionDuration = duration + "ms";
    target.style.height = height + "px";
    target.style.removeProperty("padding-top");
    target.style.removeProperty("padding-bottom");
    target.style.removeProperty("margin-top");
    target.style.removeProperty("margin-bottom");
    window.setTimeout(() => {
      target.style.removeProperty("height");
      target.style.removeProperty("overflow");
      target.style.removeProperty("transition-duration");
      target.style.removeProperty("transition-property");
      target.classList.remove("--slide");
      document.dispatchEvent(new CustomEvent("slideDownDone", {
        detail: {
          target
        }
      }));
    }, duration);
  }
};
let slideToggle = (target, duration = 500) => {
  if (target.hidden) {
    return slideDown(target, duration);
  } else {
    return slideUp(target, duration);
  }
};
let bodyLockStatus = true;
let bodyLockToggle = (delay = 500) => {
  if (document.documentElement.hasAttribute("data-fls-scrolllock")) {
    bodyUnlock(delay);
  } else {
    bodyLock(delay);
  }
};
let bodyUnlock = (delay = 500) => {
  if (bodyLockStatus) {
    const lockPaddingElements = document.querySelectorAll("[data-fls-lp]");
    setTimeout(() => {
      lockPaddingElements.forEach((lockPaddingElement) => {
        lockPaddingElement.style.paddingRight = "";
      });
      document.body.style.paddingRight = "";
      document.documentElement.removeAttribute("data-fls-scrolllock");
    }, delay);
    bodyLockStatus = false;
    setTimeout(function() {
      bodyLockStatus = true;
    }, delay);
  }
};
let bodyLock = (delay = 500) => {
  if (bodyLockStatus) {
    const lockPaddingElements = document.querySelectorAll("[data-fls-lp]");
    const lockPaddingValue = window.innerWidth - document.body.offsetWidth + "px";
    lockPaddingElements.forEach((lockPaddingElement) => {
      lockPaddingElement.style.paddingRight = lockPaddingValue;
    });
    document.body.style.paddingRight = lockPaddingValue;
    document.documentElement.setAttribute("data-fls-scrolllock", "");
    bodyLockStatus = false;
    setTimeout(function() {
      bodyLockStatus = true;
    }, delay);
  }
};
function uniqArray(array) {
  return array.filter((item, index, self) => self.indexOf(item) === index);
}
const gotoBlock = (targetBlock, noHeader = false, speed = 500, offsetTop = 0) => {
  const targetBlockElement = document.querySelector(targetBlock);
  if (targetBlockElement) {
    let headerItem = "";
    let headerItemHeight = 0;
    if (noHeader) {
      headerItem = "header.header";
      const headerElement = document.querySelector(headerItem);
      if (!headerElement.classList.contains("--header-scroll")) {
        headerElement.style.cssText = `transition-duration: 0s;`;
        headerElement.classList.add("--header-scroll");
        headerItemHeight = headerElement.offsetHeight;
        headerElement.classList.remove("--header-scroll");
        setTimeout(() => {
          headerElement.style.cssText = ``;
        }, 0);
      } else {
        headerItemHeight = headerElement.offsetHeight;
      }
    }
    if (document.documentElement.hasAttribute("data-fls-menu-open")) {
      bodyUnlock();
      document.documentElement.removeAttribute("data-fls-menu-open");
    }
    let targetBlockElementPosition = targetBlockElement.getBoundingClientRect().top + scrollY;
    targetBlockElementPosition = headerItemHeight ? targetBlockElementPosition - headerItemHeight : targetBlockElementPosition;
    targetBlockElementPosition = offsetTop ? targetBlockElementPosition - offsetTop : targetBlockElementPosition;
    window.scrollTo({
      top: targetBlockElementPosition,
      behavior: "smooth"
    });
  }
};
function menuInit() {
  document.addEventListener("click", function(e) {
    if (bodyLockStatus && e.target.closest("[data-fls-menu]")) {
      bodyLockToggle();
      document.documentElement.toggleAttribute("data-fls-menu-open");
    }
  });
}
document.querySelector("[data-fls-menu]") ? window.addEventListener("load", menuInit) : null;
const navMenu = document.querySelector(".nav-menu");
const navMenuList = document.querySelector(".nav-menu__list");
const navMenuBtn = document.querySelector(".nav-menu__btn");
const mediaQuery = window.matchMedia("(min-width: 62.061em)");
let isManualNav = false;
let manualTargetId = null;
let manualNavTimeout = null;
function initNavMenu() {
  if (!navMenu || !navMenuList || !navMenuBtn) return;
  let isActive = false;
  const handleClickToggle = () => {
    const isOpen = navMenu.classList.contains("_active");
    slideToggle(navMenuList, 300);
    if (isOpen) {
      setTimeout(() => {
        navMenu.classList.remove("_active");
        navMenuList.style.minWidth = "";
      }, 300);
    } else {
      navMenu.classList.add("_active");
    }
  };
  const handleClickLink = (e) => {
    const link = e.target.closest(".nav-menu__link");
    if (!link) return;
    const selector = link.dataset.flsScrollto;
    if (selector) {
      const targetSection = document.querySelector(selector);
      if (targetSection) {
        isManualNav = true;
        manualTargetId = targetSection.id || null;
      }
    }
    const btnTextSpan = navMenuBtn.querySelector("span");
    if (btnTextSpan) {
      btnTextSpan.textContent = link.textContent.trim();
    }
    slideUp(navMenuList, 300);
    setTimeout(() => {
      navMenu.classList.remove("_active");
    }, 300);
  };
  const handleClickOutside = (e) => {
    const isClickInside = e.target.closest(".nav-menu");
    const isClickOnBtn = e.target.closest(".nav-menu__btn");
    if (!isClickInside && !isClickOnBtn && navMenu.classList.contains("_active")) {
      slideUp(navMenuList, 300);
      setTimeout(() => {
        navMenu.classList.remove("_active");
      }, 300);
    }
  };
  function enable() {
    if (isActive) return;
    isActive = true;
    slideUp(navMenuList, 0);
    navMenuBtn.addEventListener("click", handleClickToggle);
    navMenuList.addEventListener("click", handleClickLink);
    document.addEventListener("click", handleClickOutside);
  }
  function disable() {
    if (!isActive) return;
    isActive = false;
    navMenu.classList.remove("_active");
    slideDown(navMenuList, 0);
    navMenuBtn.removeEventListener("click", handleClickToggle);
    navMenuList.removeEventListener("click", handleClickLink);
    document.removeEventListener("click", handleClickOutside);
  }
  function checkMedia(e) {
    if (e.matches) {
      enable();
    } else {
      disable();
    }
  }
  document.addEventListener("watcherCallback", (e) => {
    if (!mediaQuery.matches || !e.detail || !e.detail.entry.isIntersecting) return;
    const target = e.detail.entry.target;
    if (isManualNav && manualTargetId && target.id === manualTargetId) {
      isManualNav = false;
      manualTargetId = null;
    }
    if (isManualNav) return;
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
      const btnSpan = navMenuBtn.querySelector("span");
      if (btnSpan) {
        btnSpan.textContent = currentLink.textContent.trim();
      }
    }
  });
  document.addEventListener("click", (e) => {
    const el = e.target.closest("[data-fls-scrollto]");
    if (!el) return;
    if (el.closest(".nav-menu__list")) return;
    const selector = el.dataset.flsScrollto;
    if (!selector) return;
    const target = document.querySelector(selector);
    if (!target) return;
    if (!target.hasAttribute("data-fls-watcher") || target.dataset.flsWatcher !== "navigator") {
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
  mediaQuery.addEventListener("change", checkMedia);
}
window.addEventListener("load", initNavMenu);
addLoadedAttr();
document.addEventListener("DOMContentLoaded", function() {
  document.addEventListener("click", function(e) {
    const btn = e.target.closest('[data-fls-popup-link="popup-tea"]');
    if (!btn) return;
    const infoBlock = btn.closest("[data-info]");
    const popup = document.querySelector('[data-fls-popup="popup-tea"]');
    const popupContent = popup?.querySelector("[data-fls-popup-content]");
    if (!infoBlock || !popupContent) return;
    const dataBlock = infoBlock.querySelector("[data-popup-info]");
    if (!dataBlock) return;
    const title = dataBlock.querySelector("[data-popup-title]")?.textContent || "";
    const subtitle = dataBlock.querySelector("[data-popup-subtitle]")?.textContent || "";
    const descr = dataBlock.querySelector("[data-popup-descr]")?.innerHTML || "";
    const specs = dataBlock.querySelectorAll("[data-popup-specs-item]");
    const img = infoBlock.querySelector(".item-slider__pack img");
    let specsHTML = "";
    specs.forEach((specItem) => {
      const specTitle = specItem.querySelector("[data-popup-specs-title]")?.textContent || "";
      const specDescr = specItem.querySelector("[data-popup-specs-descr]")?.textContent || "";
      const isIngredients = specTitle.toLowerCase().includes("склад");
      specsHTML += `
        <li class="specification__item">
          <span class="specification__title">${specTitle}</span>
          <span class="${isIngredients ? "specification__text" : "specification__descr"}">${specDescr}</span>
        </li>
      `;
    });
    popupContent.innerHTML = `
      <div class="popup__picture">
        <img class="ibg-cn" src="${img?.src || ""}" width="${img?.width || 289}" height="${img?.height || 493}" alt="${img?.alt || "Image"}">
      </div>
      <div class="popup__description">
        <div class="popup__head">
          <h3 class="popup__title">${title}</h3>
          <p class="popup__subtitle">${subtitle}</p>
        </div>
        <div class="popup__about">
          ${descr}
        </div>
        <div class="popup__specification specification">
          <ul class="specification__list">
            ${specsHTML}
          </ul>
        </div>
      </div>
    `;
  });
});
export {
  bodyUnlock as a,
  bodyLock as b,
  bodyLockStatus as c,
  getHash as d,
  gotoBlock as g,
  isMobile as i,
  uniqArray as u
};
