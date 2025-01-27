# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```
## Описание проекта и выбор архитектуры:
 Web-ларёк — интернет-магазин с товарами для веб-разработчиков. Функционал включает просмотр каталога товаров, добавление товаров в корзину и соверешние заказа. 

 Для реализации веб-приложения выбран архитектурный паттерн MVP:
 - Слой Model (M) содержит данные, с которыми работает приложение;
 - Слой View (V) используется для отображения интерфейса для взаимодействия с пользователем;
 - Слой Presenter (P) управляет приложением, организовывает работу слоя данных и отображения, при этом оставляя их независимыми и не связанными друг с другом.

## Данные и типы данных, используемые в приложении

Данные о товаре получаемые с сервера
```
export interface IProductItem {
    id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number | null;
	isInBasket: boolean;  
}
```
Интерфейс для работы с товаром
```
export interface IProductData {
    catalog: IProductItem[];
    preview: string | null;

    getItem(itemId: string): IProductItem | null;
}
```
Данные пользователя
```
export interface IOrderUserInfo {
    payment: string;
    email: string;
    phone: string;
    address: string;
}
```
Поля в форме заказ
```
export type TOrderInputs = Pick<IOrderUserInfo, 'payment' | 'address'>;
```
Поля в форме контакты
```
export type TContactsInputs = Pick<IOrderUserInfo, 'phone' | 'email'>;
```
Интерфейс для работы с основными функциями магазина
```
export interface IOrderData {
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
```
Данные о заказе, отправляемые на сервер
```
export interface IOrder extends IOrderUserInfo {
    total: number;
    items: string[];
}
```
Данные оформленного заказа, возвращаемые сервером
```
export interface IOrderResult {
    id: string;
    total: number;
}
```
Данные ошибки
```
export type TFormErrors = Partial<Record<keyof IOrderUserInfo, string>>;
```
Данные товара, используемые в корзине
```
export interface IBasketItem extends IProductItem {
	index: number;
}
```
Данные модального окна успешного заказа
```
export interface ISuccess {
	description: number;
}
```
Интерфейс формы
```
export interface IFormState {
	valid: boolean;
	errors: string[];
}
```

## Базовый код

### Класс Api 
Предназначен для отправки HTTP-запросов. Он принимает базовый URL для API и опциональные параметры запросов. Класс предоставляет методы для отправки `GET` и `POST` запросов с данными в формате JSON.

### Класс EventEmitter

Предназначен для управления событиями. Используется в презентере для обработки событий и в слоях для генерации событий. Основные методы:
- `on` подписывает обработчик на событие
- `emit`: инициирует событие и вызывает обработчики
- `trigger`: генерирует событие при вызове

### Класс Model
Абстрактный класс, который служит базой для всех моделей данных. Он помогает отличить модели от простых объектов, предоставляя дополнительные возможности, такие как обработка событий.
- `emitChanges` метод сообщает, что модель поменялась

### Класс Component 
Абстрактный класс, который представляет собой базовый компонент для работы с DOM. Методы этого класса предоставляют набор инструментов для работы с элементами DOM: изменение текста, переключение классов, скрытие/показ элементов 

## Слой данных

### Класс `ProductData`
Отвечает за хранение и логику работы с товарами. Наследуется от класса Model.

Поля:
protected _catalog: IProductItem[] - каталог товаров
protected _preview: string | null - id товара, выбранного для просмотра в модальном окне

Методы:
- set catalog(items: TProductItemCard[]): void - устанавливает каталог товаров
- get catalog(): TProductItemCard[] - передает каталог товаров
- set preview(itemId: string | null) - устанавливает id элемента для предпросмотра
- get preview (): string - возвращает id элемента для предпросмотра
- getItem(itemId: string): IProductItem | null - возвращает объект товара по его id


### Класс `AppData`
Отвечает за хранение данных пользователя, массива id заказанных товаров и за логику работы с ними. Наследуется от класса Model.\

Поля:
protected _items: string[]; - массив id товаров в корзине
protected _order: IOrderUserInfo = {
    payment: '',
    email: '',
    phone: '',
    address: ''
} - данные пользователя
orderErrors: TFormErrors = {} - ошибки

Методы:
- get orderInfo(): IOrderUserInfo | null - получить данные пользователя
- addItemToBasket(id: string): void - добавление товара в корзину
- get items(): string[] - получение всех товаров в корзине
- getItemCount(): number - получение количества товаров в корзине
- removeItemFromCart(id: string): void - удалить товар из корзины
- clearBasket(): void - очистить корзину
- calculateTotal(catalog: IProductItem[]): number - подсчитать общую сумму товаров в корзине
- setFormField(field: keyof IOrderUserInfo, value: string) - заполнение полей формы заказа
- setFormFieldContacts(field: keyof IOrderUserInfo, value: string) - заполнение полей формы контактов
- checkOrderField(): boolean - проверяет поля формы заказа
- checkContsctsField(): boolean - проверяет поля формы контакты
- getOrderInfo(catalog: IProductItem[]): IOrder  - возвращает информацию о заказе, включая данные пользователя, список товаров и общую сумму
- findIdPricelessProduct(catalog: IProductItem[]): string[] - находит в корзине товары с нулевой ценой


## Слой представления

### Класс `Page` 
Отвечает за отображение компонентов на главной странице, наследуется от абстрактного класса Component.\

Конструктор `constructor(container: HTMLElement, protected events: IEvents)` принимает контейнер в виде HTML элемента и экземпляр класса `EventEmitter` для возможности инициализации событий. Внутри конструктора находим и устанавливаем все необходимые DOM-элементы.

Поля:
- _counter: HTMLElement - счетчик товаров в корзине
- _catalog: HTMLElement[] - элемент с каталогом товаров
- _basket: HTMLElement - элемент для открытия корзины  
- protected _wrapper: HTMLElement - элемент обертки

Сеттеры:
- set counter(value: number) - для обновления счетчика
- set catalog(items: HTMLElement) - каталог
- set locked(value: boolean) - для блокировки прокрутки

### Класс `Card`
Класс для отображения карточки товара, наследуется от класса Component.\

Поля:
- protected _image?: HTMLImageElement;
- protected _title: HTMLElement;
- protected _category?: HTMLElement;
- protected _price: HTMLElement;
- protected events: IEvents;
- protected _button?: HTMLButtonElement;

Методы:
- set id(value: string)
- get id(): string
- set title(value: string)
- get title(): string 
- set category(value: string)
- set image(value: string)
- set category(value: CategoryOptions)
- set price(value: number | null)
- set isInBasket(value: boolean)

### Класс `CardPreview`
Класс для отображения описания товара на превью, наследуется от класса `Card`, позволяет добавить товар в корзину.
- _description: HTMLElement
- set description(value: string) 
- get description(): string

### Класс `CardInBasket`
Класс для отображения товара в корзине. Наследуется от класса `Component`.\
Поля:
- protected _index: HTMLElement;
- protected _title: HTMLElement;
- protected _price: HTMLElement;
- protected _button: HTMLButtonElement;

Методы:
- set index(value: string)
- set title(value: string)
- set price(value: number)

### Класс `Modal` 
Отвечает за отображение модальных окон. Наследуется от класса `Component`.

constructor(container: HTMLElement, protected events: IEvents) Конструктор принимает контейнер в виде HTML элемента и экземпляр класса `EventEmitter` для возможности инициализации событий.

Поля: 
- _closeButton: HTMLButtonElement - кнопка для закрытия окна
- _content: HTMLElement - элемент, внутри которого будет размещено содержимое окна

Методы:
- set content(value: HTMLElement) - устанавливает контент конкретного модального окна в шаблон
- open() - открывает модальное окно
- close() - закрывает модальное окно
- render(data: IModalData): HTMLElement: HTMLElement 

### Класс `Basket`
Класс для отображения корзины.  Наследуется от класса `Component`.\

constructor(container: HTMLElement, protected events: IEvents) Конструктор принимает контейнер в виде HTML элемента и экземпляр класса `EventEmitter` для возможности инициализации событий.\

Поля:
- _list: HTMLElement[] - список товаров
- _total: HTMLElement - общая сумма покупки
- _orderButton: HTMLElement - кнопка для оформления заказа

Методы:
- set items(items: HTMLElement[]) - товары в корзине
- set total - итоговая сумма
- disableButton() - деактивирует кнопку оформить
- enableButton() - активирует кнопку оформить
- indexReset() - сбрасывает индексы товаров

### Класс `OrderForm`
Класс для отображения формы с выбором способа оплаты и адресом
- protected _onlineButton: HTMLButtonElement;
- protected _postPayButton: HTMLButtonElement;

- togglePaymentMethod(method: 'online' | 'postPay') - пееключение методов оплаты
- buttonsDisabled() - убрать стиль выбранной кнопки
- reset() - сброс данных

### Класс `ContactForm`
Класс для отображения формы ввода почты и телефона. Наследуется от класса `Form`.
- set phone
- set email
- reset()

### Класс `Success`
Класс для отображения модального окна, сообщающего об успешном оформлении заказа
Поля:
_close: HTMLElement;
_description: HTMLElement;

Методы:
- set description(value: number)

## Слой коммуникации
### Класс `LarekApi`
Класс наследуется от базового класса  `Api`, предоставляет методы реализующие взаимодействие с бэкендом сервиса.

## Взаимодействие компонентов
Роль презентера выполняет код файле `index.ts`. Взаимодействие осуществляется за счет событий генерируемых с помощью брокера событий и обработчиков этих событий, описанных в `index.ts`. В `index.ts` сначала создаются экземпляры всех необходимых классов, а затем настраивается обработка событий.

*События:*
- `cards:changed` - изменение элементов каталога
- `preview:changed` - изменение открываемой в модальном окне карточки товара
- `item:add` - добавление товара в корзину
- `basket:open` - открытие корзины
- `item:remove` - удаление товара из корзины
- `basket:order` - нажатие кнопки оформить
- `orderFormErrors:change` - изменилось состояние валидации формы заказ
- `/^contacts\..*:change/`/`/^order\..*:change/` - изменилось одно из полей формы контакты/заказ
- `contactsFormErrors:change` - изменилось состояние валидации формы контакты
- `order:submit` - нажатие кнопки далее в форме заказа
- `contacts:submit` - отправка заказа
- `order:success` - успешное завершенее заказа
- `modal:open`/`modal:close`- блок прокрутки страницы при открытии модального окна и разблок при закрытии