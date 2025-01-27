import { TContactsInputs } from '../types';
import { IEvents } from './base/events';
import { Form } from './Form';

export class ContactsForm extends Form<TContactsInputs> {
	constructor(protected container: HTMLFormElement, protected events: IEvents) {
		super(container, events);
	}

	set phone(value: string) {
		(this.container.elements.namedItem('phone') as HTMLInputElement).value =
			value;
	}

	set email(value: string) {
		(this.container.elements.namedItem('email') as HTMLInputElement).value =
			value;
	}

	reset() {
		this.container.reset();
	}
}
