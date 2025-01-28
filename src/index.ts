import { EventEmitter } from './components/base/events';
import './scss/styles.scss';
import { ProductData } from './components/ProductData';
import { AppData } from './components/AppData';
import { LarekAPI } from './components/LarekAPI';
import { API_URL, CDN_URL } from './utils/constants';
import { Card, CardPreview } from './components/Card';
import { Page } from './components/Page';
import { cloneTemplate, ensureElement } from './utils/utils';
import { Modal } from './components/Modal';
import { Basket, CardInBasket } from './components/Basket';
import { OrderForm } from './components/OrderForm';
import { ContactsForm } from './components/ContactsForm';
import { Success } from './components/Success';
import {
	IBasketItem,
	IOrderResult,
	IProductItem,
	TContactsInputs,
	TOrderInputs,
} from './types';


const events = new EventEmitter();
const api = new LarekAPI(CDN_URL, API_URL);

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const productData = new ProductData({}, events);
const appData = new AppData({}, events);

const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

const basket = new Basket(cloneTemplate(basketTemplate), events);
const order = new OrderForm(cloneTemplate(orderTemplate), events);
const contacts = new ContactsForm(cloneTemplate(contactsTemplate), events);
const success = new Success(cloneTemplate(successTemplate), {
	onClick: () => {
		events.emit('modal:close'), modal.close();
	},
});

api
	.getProductList()
	.then((products) => {
		productData.catalog = products;
	})
	.catch((err) => {
		console.error(err);
	});

//Вывод каталога товаров
events.on('catalog:changed', () => {
	page.catalog = productData.catalog.map((item) => {
		const card = new Card('card', cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('preview:changed', item),
		});
		return card.render({
			id: item.id,
			title: item.title,
			category: item.category,
			image: item.image,
			price: item.price,
		});
	});
});

//Открытие превью карточки
events.on('preview:changed', (item: IProductItem) => {
	const card = new CardPreview(cloneTemplate(cardPreviewTemplate), {
		onClick: () => events.emit('item:add', item),
	});

	modal.render({
		content: card.render({
			id: item.id,
			title: item.title,
			category: item.category,
			image: item.image,
			price: item.price,
			description: item.description,
			isInBasket: item.isInBasket,
		}),
	});
});

// Добавление товара в корзину
events.on('item:add', (item: IProductItem) => {
	appData.addItemToBasket(item.id);
	page.counter = appData.getItemCount();
	item.isInBasket = true;
	basket.enableButton();
	modal.close();
});

//Открыть корзину
events.on('basket:open', () => {
	const list = appData.items.map((itemId, index) => {
		const item = productData.getItem(itemId);
		const newListItem = new CardInBasket(
			'card',
			cloneTemplate(cardBasketTemplate),
			{ onClick: () => events.emit('item:remove', item) }
		);

		return newListItem.render({
			index: index + 1,
			title: item.title,
			price: item.price,
		});
	});

	const basketContent = {
		items: list,
		total: appData.calculateTotal(productData.catalog),
	};

	if (appData.calculateTotal(productData.catalog) === 0) {
		basket.disableButton();
	}
	modal.render({ content: basket.render(basketContent) });
});

// Удалить из корзины
events.on('item:remove', (item: IBasketItem) => {
	appData.removeItemFromBasket(item.id);
	item.isInBasket = false;
	basket.total = appData.calculateTotal(productData.catalog);
	page.counter = appData.getItemCount();
	if (appData.calculateTotal(productData.catalog) === 0) {
		basket.disableButton();
	}
	basket.resetIndexes();
});

//Оформить
events.on('basket:order', () => {
	modal.render({
		content: order.render({
			address: '',
			valid: false,
			errors: [],
		}),
	});
});

// Изменилось состояние валидации формы заказ
events.on('orderFormErrors:change', (errors: Partial<TOrderInputs>) => {
	const { payment, address } = errors;
	order.valid = !(payment || address);
	order.errors = [payment, address].filter((error) => error).join('; ');
});

//Изменилось одно из полей формы заказ
events.on(
	/^order\..*:change/,
	(data: { field: keyof TOrderInputs; value: string }) => {
		appData.setFormField(data.field, data.value);
	}
);

// Изменилось состояние валидации формы контакты
events.on('contactsFormErrors:change', (errors: Partial<TContactsInputs>) => {
	const { phone, email } = errors;
	contacts.valid = !(phone || email);
	contacts.errors = [phone, email].filter((error) => error).join('; ');
});

// Изменилось одно из полей формы контакты
events.on(
	/^contacts\..*:change/,
	(data: { field: keyof TContactsInputs; value: string }) => {
		appData.setFormFieldContacts(data.field, data.value);
	}
);

// Далее
events.on('order:submit', () => {
	const orderData = appData.getOrderInfo(productData.catalog);
	orderData.total = appData.calculateTotal(productData.catalog);
	orderData.items = appData.items;

	modal.render({
		content: contacts.render({
			valid: false,
			errors: [],
		}),
	});
});

// Отправка заказа
events.on('contacts:submit', () => {
	const removingProducts = appData.findPricelissProductsIds(productData.catalog);
	removingProducts.forEach((item) => appData.removeItemFromBasket(item));

	api
		.orderProducts(appData.getOrderInfo(productData.catalog))
		.then((response) => {
			events.emit('order:success', response);
			productData.catalog.forEach((item) => {
				if (item) {
					item.isInBasket = false;
				}
			});

			appData.clearBasket();
			appData._orderInfo = {
				payment: '',
				email: '',
				phone: '',
				address: '',
			};
			page.counter = 0;
			order.reset();
			contacts.reset();
		})
		.catch((err) => {
			console.error(err);
		});
});

// Успех
events.on('order:success', (response: IOrderResult) => {
	modal.render({
		content: success.render({
			description: response.total,
		}),
	});
});

// Блокируем прокрутку страницы если открыта модалка
events.on('modal:open', () => {
	page.locked = true;
});

// ... и разблокируем
events.on('modal:close', () => {
	page.locked = false;
});
