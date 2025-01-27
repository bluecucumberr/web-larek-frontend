import { IProductItem } from '../types';
import { ensureElement } from '../utils/utils';
import { Component } from './base/Component';
import { IEvents } from './base/events';

enum CategoryOptions {
	SOFT_SKILLS = 'софт-скил',
	OTHER = 'другое',
	ADDITIONAL = 'дополнительное',
	BUTTON = 'кнопка',
	HARD_SKILLS = 'хард-скил',
}

type CategoryClassMap = {
	[key in CategoryOptions]: string;
};

const categoryClassMap: CategoryClassMap = {
	[CategoryOptions.SOFT_SKILLS]: 'card__category_soft',
	[CategoryOptions.OTHER]: 'card__category_other',
	[CategoryOptions.ADDITIONAL]: 'card__category_additional',
	[CategoryOptions.BUTTON]: 'card__category_button',
	[CategoryOptions.HARD_SKILLS]: 'card__category_hard',
};

interface ICardActions {
	onClick: (event: MouseEvent) => void;
}

export class Card extends Component<IProductItem> {
	protected _image?: HTMLImageElement;
	protected _title: HTMLElement;
	protected _category?: HTMLElement;
	protected _price: HTMLElement;
	protected events: IEvents;
	protected _button?: HTMLButtonElement;

	constructor(
		protected blockName: string,
		container: HTMLElement,
		actions?: ICardActions
	) {
		super(container);

		this._image = container.querySelector(`.${blockName}__image`);
		this._title = ensureElement<HTMLElement>(`.${blockName}__title`, container);
		this._category = container.querySelector(`.${blockName}__category`);
		this._price = ensureElement<HTMLElement>(`.${blockName}__price`, container);
		this._button = container.querySelector(`.${blockName}__button`);

		if (actions?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', actions.onClick);
			} else {
				container.addEventListener('click', actions.onClick);
			}
		}
	}

	set id(value: string) {
		this.container.dataset.id = value;
	}

	get id(): string {
		return this.container.dataset.id || '';
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	get title(): string {
		return this._title.textContent || '';
	}

	set image(value: string) {
		this.setImage(this._image, value, this.title);
	}

	set category(value: CategoryOptions) {
		this.setText(this._category, value);
		this._category.classList.add(categoryClassMap[value]);
	}

	set price(value: number) {
		this.setText(
			this._price,
			value === null ? 'Бесценно' : `${value} синапсов`
		);
	}

	set isInBasket(value: boolean) {
		if (!this._button.disabled) {
			this._button.disabled = value;
		}
	}
}

export class CardPreview extends Card {
	protected _description: HTMLElement;

	constructor(container: HTMLElement, actions?: ICardActions) {
		super('card', container, actions);
		this._description = ensureElement<HTMLElement>(`.${this.blockName}__text`);
	}

	set description(value: string) {
		this.setText(this._description, value);
	}

	get description(): string {
		return this._description.textContent || '';
	}
}
