/*
Документація по роботі у шаблоні: 
Документація слайдера: https://swiperjs.com/
Сніппет(HTML): swiper
*/

// Підключаємо слайдер Swiper з node_modules
// При необхідності підключаємо додаткові модулі слайдера, вказуючи їх у {} через кому
// Приклад: { Navigation, Autoplay }
import Swiper from 'swiper';
import { Navigation } from 'swiper/modules';
/*
Основні модулі слайдера:
Navigation, Pagination, Autoplay, 
EffectFade, Lazy, Manipulation
Детальніше дивись https://swiperjs.com/
*/

// Стилі Swiper
// Підключення базових стилів
import "./slider.scss";
// Повний набір стилів з node_modules
// import 'swiper/css/bundle';



const sliderConfigs = {
	// 'tea-bags': {
	// 	slidesPerView: 1,
	// },
};


// клонированние слайдов для loop -------------
function prepareSlides() {
	const sliders = document.querySelectorAll('[data-fls-slider]');
	if (!sliders.length) return;

	sliders.forEach((slider) => {
		const wrapper = slider.querySelector('.swiper-wrapper');
		if (!wrapper) return;

		const slides = wrapper.querySelectorAll('.swiper-slide');
		const count = slides.length;

		if (count === 3 || count === 4 || count === 5) {
			for (let i = 0; i < count; i++) {
				const clone = slides[i].cloneNode(true);
				wrapper.appendChild(clone);
			}
		}
	});
}


function initSliders() {
	const sliders = document.querySelectorAll('[data-fls-slider]');
	if (!sliders.length) return;
	
	sliders.forEach((slider) => {
		const customConfig = sliderConfigs[slider.dataset.slider] || {};

		const swiper = new Swiper(slider, {
			modules: [Navigation],
			observer: true,
			observeParents: true,
			speed: 500,
			slidesPerView: 1,
			spaceBetween: 10,
			loop: true,
			breakpoints: {
			768: { 
				slidesPerView: 2.5, 
				spaceBetween: 20, 
				initialSlide: 1, 
				centeredSlides: true,
				centeredSlidesBounds: true,
			},
			1024: { 
				slidesPerView: 3, 
				spaceBetween: 30, 
				initialSlide: 1, 
				centeredSlides: true,
				centeredSlidesBounds: true,
			},
		},
			navigation: {
				prevEl: slider.querySelector('.swiper-button-prev'),
				nextEl: slider.querySelector('.swiper-button-next'),
			},
			...customConfig,
			
		});
	});
}

if (document.querySelector('[data-fls-slider]')) {
	window.addEventListener('load', () => {
		prepareSlides(); // клоны до инициализации
		initSliders();   // запуск свайпера
	});
}