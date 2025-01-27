import {
	TFormErrors,
	IOrderUserInfo,
	IAppData,
	IProductItem,
	IOrder,
} from '../types';
import { Model } from './base/Model';

export class AppData extends Model<IAppData> {
	protected _items: string[] = [];
	_orderInfo: IOrderUserInfo = {
		payment: '',
		email: '',
		phone: '',
		address: '',
	};
	formErrors: TFormErrors = {};

	get orderInfo(): IOrderUserInfo | null {
		return this._orderInfo;
	}

	addItemToBasket(id: string): void {
		if (!this._items.includes(id)) {
			this._items.push(id);
			this.emitChanges('item:added');
		}
	}

	get items(): string[] {
		return this._items;
	}

	getItemCount(): number {
		return this._items.length;
	}

	removeItemFromBasket(id: string): void {
		this._items = this._items.filter((item) => item !== id);
		this.emitChanges('item:removed');
	}

	clearBasket(): void {
		this._items = [];
		this.emitChanges('basket:cleared');
	}

	calculateTotal(catalog: IProductItem[]): number {
		return this._items.reduce((total, itemId) => {
			const product = catalog.find((item) => item.id === itemId);
			return total + (product?.price || 0);
		}, 0);
	}

	setFormField(field: keyof IOrderUserInfo, value: string) {
		this._orderInfo[field] = value.trim();
		this.emitChanges('input:changed', this.orderInfo);

		if (this.checkOrderField()) {
			this.emitChanges('orderForm:ready', this.orderInfo);
		}
	}

	setFormFieldContacts(field: keyof IOrderUserInfo, value: string) {
		this._orderInfo[field] = value.trim();
		this.emitChanges('input:changed', this.orderInfo);

		if (this.checkContsctsField()) {
			this.emitChanges('contactsForm:ready', this.orderInfo);
		}
	}

	checkOrderField(): boolean {
		const errors: typeof this.formErrors = {};

		if (!this._orderInfo.payment) {
			errors.payment = 'Укажите способ оплаты';
		}
		if (!this._orderInfo.address) {
			errors.address = 'Укажите адрес доставки';
		}

		this.formErrors = errors;
		this.events.emit('orderFormErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	checkContsctsField(): boolean {
		const errors: typeof this.formErrors = {};

		if (!this._orderInfo.phone) {
			errors.phone = 'Укажите номер телефона';
		}
		if (!this._orderInfo.email) {
			errors.email = 'Укажите email';
		}

		this.formErrors = errors;
		this.events.emit('contactsFormErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	getOrderInfo(catalog: IProductItem[]): IOrder {
		return {
			payment: this.orderInfo.payment,
			email: this.orderInfo.email,
			phone: this.orderInfo.phone,
			address: this.orderInfo.address,
			total: this.calculateTotal(catalog),
			items: this._items,
		};
	}

	findIdPricelessProduct(catalog: IProductItem[]): string[] {
		const productsToRemove = this._items.filter((itemId) => {
			const product = catalog.find((product) => product.id === itemId);
			return product && product.price === null;
		});
		return productsToRemove || [];
	}
}
