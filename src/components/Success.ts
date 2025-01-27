import { ISuccess } from '../types';
import { Component } from './base/Component';

export interface ISuccessActions {
	onClick: () => void;
}
export class Success extends Component<ISuccess> {
	protected _close: HTMLElement;
	protected _description: HTMLElement;

	constructor(container: HTMLElement, actions: ISuccessActions) {
		super(container);

		this._close = container.querySelector('.order-success__close');
		this._description = container.querySelector('.order-success__description');

		if (actions?.onClick) {
			this._close.addEventListener('click', actions.onClick);
		}
	}

	set description(value: number) {
		this._description.textContent = `Списано ${value} синапсов`;
	}
}
