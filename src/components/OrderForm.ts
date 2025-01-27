import { TOrderInputs } from '../types';
import { IEvents } from './base/events';
import { Form } from './Form';

export class OrderForm extends Form<TOrderInputs> {
	protected _onlineButton: HTMLButtonElement;
	protected _postPayButton: HTMLButtonElement;

	constructor(protected container: HTMLFormElement, protected events: IEvents) {
		super(container, events);

		this._onlineButton = container.elements.namedItem(
			'card'
		) as HTMLButtonElement;
		this._postPayButton = container.elements.namedItem(
			'cash'
		) as HTMLButtonElement;

		this._onlineButton.addEventListener('click', () => {
			this.togglePaymentMethod('online');
		});

		this._postPayButton.addEventListener('click', () => {
			this.togglePaymentMethod('postPay');
		});
	}

	togglePaymentMethod(method: 'online' | 'postPay') {
		if (method === 'online') {
			this._onlineButton.classList.add('button_alt-active');
			this._postPayButton.classList.remove('button_alt-active');
			this.onInputChange('payment', 'online');
		} else {
			this._postPayButton.classList.add('button_alt-active');
			this._onlineButton.classList.remove('button_alt-active');
			this.onInputChange('payment', 'postPay');
		}
	}

	buttonsDisabled() {
		this._onlineButton.classList.remove('button_alt-active');
		this._postPayButton.classList.remove('button_alt-active');
	}

	reset() {
		this.container.reset();
		this.buttonsDisabled();
	}
}
