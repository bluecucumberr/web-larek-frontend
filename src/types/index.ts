// Данные о товаре, получаемые с сервера
export interface IProductItem {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
	isInBasket: boolean;
}

// Интерфейс для работы с товаром
export interface IProductData {
	catalog: IProductItem[];
	preview: string | null;

	getItem(itemId: string): IProductItem | null;
}

// Данные пользователя
export interface IOrderUserInfo {
	payment: string;
	email: string;
	phone: string;
	address: string;
}

// Поля в форме заказ
export type TOrderInputs = Pick<IOrderUserInfo, 'payment' | 'address'>;

// Поля в форме контакты
export type TContactsInputs = Pick<IOrderUserInfo, 'phone' | 'email'>;

// Интерфейс для работы с основными функциями магазина
export interface IAppData {
	items: string[];
	orderInfo: IOrderUserInfo | null;

	addItemToCart(id: string): void;
	removeItemFromCart(id: string): void;
	getItemCount(): number;
	clearBasket(): void;
	calculateTotal(catalog: IProductItem[]): number;

	checkOrderField(): boolean;
	checkContsctsField(): boolean;
	setFormField(field: keyof IOrderUserInfo, value: string):void;
	setFormFieldContacts(field: keyof IOrderUserInfo, value: string):void;

	getOrderInfo(catalog: IProductItem[]): IOrder;

	findIdPricelessProduct(catalog: IProductItem[]): string[];
}

// Данные о заказе, отправляемые на сервер
export interface IOrder extends IOrderUserInfo {
	total: number;
	items: string[];
}

// Данные оформленного заказа, возвращаемые сервером
export interface IOrderResult {
	id: string;
	total: number;
}

// Данные ошибки
export type TFormErrors = Partial<Record<keyof IOrderUserInfo, string>>;

// Данные товара, используемые в корзине
export interface IBasketItem extends IProductItem {
	index: number;
}

// Данные модального окна успешного заказа
export interface ISuccess {
	description: number;
}

// Интерфейс формы
export interface IFormState {
	valid: boolean;
	errors: string[];
}
