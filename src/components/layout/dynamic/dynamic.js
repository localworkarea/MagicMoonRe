import { FLS } from "@js/common/functions.js";

class DynamicAdapt {
	constructor() {
		this.daClassname = '--dynamic';
		this.init();
	}

	init() {
		this.objects = [];
		this.nodes = [...document.querySelectorAll('[data-fls-dynamic]')];

		FLS('_FLS_DA_START', this.nodes.length);

		this.nodes.forEach((node) => {
			const data = node.dataset.flsDynamic.trim();
			const dataArray = data.split(',');
			const object = {};

			object.element = node;
			object.parent = node.parentNode;

			const selector = dataArray[0]?.trim();                  // .popup-details__text
			const breakpoint = dataArray[1]?.trim() || '767.98';   // 992.98
			const place = dataArray[2]?.trim() || 'last';          // first
			const type = dataArray[3]?.trim() || 'max';            // min/max

			object.breakpoint = breakpoint;
			object.place = place;
			object.type = type;
			object.index = this.indexInParent(object.parent, object.element);

			// Куда вставлять
			const destination = document.querySelector(selector);
			if (destination) {
				object.destination = destination;
			} else {
				FLS('_FLS_DA_NONODE', selector);
			}

			this.objects.push(object);
		});

		this.arraySort(this.objects);

		// Создаём media-запросы отдельно по каждому типу
		const mediaGroups = {};

		this.objects.forEach((obj) => {
			const mediaKey = `(${obj.type}-width: ${obj.breakpoint / 16}em),${obj.breakpoint},${obj.type}`;
			if (!mediaGroups[mediaKey]) {
				mediaGroups[mediaKey] = [];
			}
			mediaGroups[mediaKey].push(obj);
		});

		Object.entries(mediaGroups).forEach(([media, objects]) => {
			const [mediaQuery, breakpoint, type] = media.split(',');
			const matchMedia = window.matchMedia(mediaQuery);
			matchMedia.addEventListener('change', () => {
				this.mediaHandler(matchMedia, objects);
			});
			this.mediaHandler(matchMedia, objects);
		});
	}

	mediaHandler(matchMedia, objects) {
		if (matchMedia.matches) {
			objects.forEach((object) => {
				if (object.destination) {
					this.moveTo(object.place, object.element, object.destination);
				}
			});
		} else {
			objects.forEach(({ parent, element, index }) => {
				if (element.classList.contains(this.daClassname)) {
					this.moveBack(parent, element, index);
				}
			});
		}
	}

	moveTo(place, element, destination) {
		FLS('_FLS_DA_MOVETO', [element.classList[0], destination.classList[0]]);
		element.classList.add(this.daClassname);

		const index = place === 'last' || place === 'first' ? place : parseInt(place, 10);
		if (index === 'last' || index >= destination.children.length) {
			destination.append(element);
		} else if (index === 'first') {
			destination.prepend(element);
		} else {
			destination.children[index].before(element);
		}
	}

	moveBack(parent, element, index) {
		element.classList.remove(this.daClassname);
		if (parent.children[index] !== undefined) {
			parent.children[index].before(element);
		} else {
			parent.append(element);
		}
		FLS('_FLS_DA_MOVEBACK', [element.classList[0], parent.classList[0]]);
	}

	indexInParent(parent, element) {
		return [...parent.children].indexOf(element);
	}

	arraySort(arr) {
		arr.sort((a, b) => {
			if (a.breakpoint === b.breakpoint) {
				if (a.place === b.place) {
					return 0;
				}
				if (a.place === 'first' || b.place === 'last') {
					return -1;
				}
				if (a.place === 'last' || b.place === 'first') {
					return 1;
				}
				return 0;
			}
			return a.breakpoint - b.breakpoint;
		});
	}
}

if (document.querySelector('[data-fls-dynamic]')) {
	window.addEventListener('load', () => new DynamicAdapt());
}
