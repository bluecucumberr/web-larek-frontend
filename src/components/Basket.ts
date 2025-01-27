import { IBasketItem, IProductItem } from '../types';
import { createElement, ensureElement, formatNumber } from '../utils/utils';
import { Component } from './base/Component';
import { EventEmitter } from './base/events';

export interface IBasketView {
	items: HTMLElement[];
	total: number;
}

export class Basket extends Component<IBasketView> {
	protected _list: HTMLElement;
	protected _total: HTMLElement;
	protected _button: HTMLButtonElement;

	constructor(container: HTMLElement, protected events: EventEmitter) {
		super(container);

		this._list = ensureElement<HTMLElement>('.basket__list', this.container);
		this._total = ensureElement<HTMLElement>('.basket__price', this.container);
		this._button = this.container.querySelector('.basket__button');

		if (this._button) {
			this._button.addEventListener('click', () => {
				events.emit('basket:order');
			});
		}
	}

	set items(items: HTMLElement[]) {
		if (items.length) {
			this._list.replaceChildren(...items);
		} else {
			this._list.replaceChildren(
				createElement<HTMLParagraphElement>('p', {
					textContent: 'Корзина пуста',
				})
			);
		}
	}

	disableButton() {
		this._button.disabled = true;
	}
	
	enableButton() {
		this._button.disabled = false;
	}

	set total(total: number) {
		this.setText(this._total, formatNumber(total) + ' синапсов');
	}

	indexReset() {
		[...this._list.children].forEach((item, index) => {
			const indexElement = item.querySelector<HTMLElement>(
				'.basket__item-index'
			);
			if (indexElement) {
				indexElement.textContent = (index + 1).toString();
			}
		});
	}
}

export class CardInBasket extends Component<IBasketItem> {
	protected _index: HTMLElement;
	protected _title: HTMLElement;
	protected _price: HTMLElement;
	protected _button: HTMLButtonElement;

	constructor(
		protected blockName: string,
		container: HTMLElement,
		actions?: { onClick: (event: MouseEvent) => void }
	) {
		super(container);
		this._index = ensureElement<HTMLElement>(
			'.basket__item-index',
			this.container
		);
		this._title = ensureElement<HTMLElement>(
			`.${blockName}__title`,
			this.container
		);
		this._price = ensureElement<HTMLElement>(
			`.${blockName}__price`,
			this.container
		);
		this._button = ensureElement<HTMLButtonElement>(
			`.${blockName}__button`,
			this.container
		);

		if (this._button) {
			this._button.addEventListener('click', (evt) => {
				this.container.remove();
				actions?.onClick(evt);
			});
		}
	}
	set index(value: string) {
		this.setText(this._index, value);
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	set price(value: number) {
		this.setText(
			this._price,
			value === null ? 'Бесценно' : `${value} синапсов`
		);
	}
}
