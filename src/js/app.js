import { addTouchAttr, addLoadedAttr, isMobile, FLS } from "@js/common/functions.js"


addLoadedAttr();

document.addEventListener('DOMContentLoaded', function () {
  document.addEventListener('click', function (e) {
    const btn = e.target.closest('[data-fls-popup-link="popup-tea"]');
    if (!btn) return;
  
    const infoBlock = btn.closest('[data-info]');
    const popup = document.querySelector('[data-fls-popup="popup-tea"]');
    const popupContent = popup?.querySelector('[data-fls-popup-content]');
    if (!infoBlock || !popupContent) return;
  
    // Получаем элементы с данными
    const dataBlock = infoBlock.querySelector('[data-popup-info]');
    if (!dataBlock) return;
  
    const title = dataBlock.querySelector('[data-popup-title]')?.textContent || '';
    const subtitle = dataBlock.querySelector('[data-popup-subtitle]')?.textContent || '';
    const descr = dataBlock.querySelector('[data-popup-descr]')?.innerHTML || '';
    const specs = dataBlock.querySelectorAll('[data-popup-specs-item]');
    const img = infoBlock.querySelector('.item-slider__pack img');
  
    // Сборка списка характеристик
    let specsHTML = '';
    specs.forEach(specItem => {
      const specTitle = specItem.querySelector('[data-popup-specs-title]')?.textContent || '';
      const specDescr = specItem.querySelector('[data-popup-specs-descr]')?.textContent || '';
      const isIngredients = specTitle.toLowerCase().includes('склад');
      specsHTML += `
        <li class="specification__item">
          <span class="specification__title">${specTitle}</span>
          <span class="${isIngredients ? 'specification__text' : 'specification__descr'}">${specDescr}</span>
        </li>
      `;
    });
  
    // Генерация всей разметки попапа
    popupContent.innerHTML = `
      <div class="popup__picture">
        <img class="ibg-cn" src="${img?.src || ''}" width="${img?.width || 289}" height="${img?.height || 493}" alt="${img?.alt || 'Image'}">
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
