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

Интерфейс для объекта товар:
    
```
export interface IProductItem {
    id: string;
    description?: string;
    img?: string;
    title: string;
    category?: string;
    price: number | null;   
}
 ```

Интерфейс для объекта заказ:
```
export interface IOrder {
    paymentMethod: 'Онлайн' | 'При получении';
    deliveryAddress: string;
    customerEmail: string;
    customerPhone: string;
}
```

Интерфейс состояния приложения:
```
export interface IAppState {
    catalog: TProductItemCard[];
    basket: string[];
    preview: string | null;
    order: IOrder | null;

    toggleOrderedProduct(id: string, isIncluded: boolean): void;
    clearBasket(): void;
    getTotal(): number;
    setCatalog(items: TProductItemCard): void;
    setPreview(item: IProductItem): void;
    setOrderField<T extends keyof IOrder>(field: T, value: IOrder[T]): void;
    checkValidation(): boolean;
}
```
Данные, используемые в карточке товара в каталоге:
```
type TProductItemCard = Pick<IProductItem, 'id' | 'category' | 'title' | 'img' | 'price'>;
```

Данные, используемые для модального окна с формой указания способа оплаты и адреса:
```
export type IOrderPayAndAdressForm = Pick<IOrder, 'paymentMethod' | 'deliveryAddress'>;
```

Данные, используемые для модального окна с формой указания контактов заказчика:
```
export type IOrderContactForm = Pick<IOrder, 'customerEmail' | 'customerPhone'>;
```

Данные для валидации:
```
export type FormErrors = Partial<Record<keyof IOrder, string>>;

```

Данные товара для корзины:
```
export type IBusketItem = Pick<IProductItem, 'id' | 'title' | 'price'>;
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

### Класс `AppState`
Отвечает за управление состоянием приложения.\
Поля:
- catalog: TProductItemCard[] - массив объектов товаров
- basket: string[] - массив id товаров, добавленных в корзину
- preview: string | null - id товара для просмотра его описания в модальном окне
- order: IOrder | null - объект, описывающий текущий заказ, т.е. данные пользователя

Методы:
- toggleOrderedProduct(id: string, isIncluded: boolean): void - добавление/удаление товара из корзины
- clearBasket(): void - очистка корзины
- getTotal(): number - расчет стоимости заказа 
- setCatalog(items: TProductItemCard): void - выводит каталог товаров (тут вопросы)
- setPreview(item: IProductItem): void - устанавливает, какой товар находится в модальном окне предпросмотра
- setOrderField<T extends keyof IOrder>(field: T, value: - IOrder[T]): void - установка значений данных пользователя
- checkValidation(): boolean - проверка данных пользователя

### Класс `ProductItem`
Отвечает за хранение и логику карточки товара.\
Поля:
- id: string - id товара 
- description?: string - описание товара
- img?: string - картинка товара
- title: string - название товара
- category?: string - категория товара
- price: number | null - цена товара

## Слой представления

### Класс `Page` 
Отвечает за отображение компонентов на главной странице, наследуется от абстрактного класса Component.\

Конструктор `constructor(container: HTMLElement, protected events: IEvents)` принимает контейнер в виде HTML элемента и экземпляр класса `EventEmitter` для возможности инициализации событий. Внутри конструктора находим и устанавливаем все необходимые DOM-элементы.\

Поля:
- _counter: HTMLElement - счетчик товаров в корзине
- _catalog: HTMLElement - элемент с каталогом товаров
- _basket: HTMLElement - элемент для открытия корзины  

Сеттеры:
- set counter(value: number) - для обновления счетчика
- set catalog(items: HTMLElement) 

### Класс `Card`
Класс для отображения карточек с товарами, наследуется класса Component.\
Поля:
_category: HTMLElement
_title: HTMLElement
_image: HTMLImageElement
_price: HTMLElement

- setData(cardData: TProductItemCard): void - заполняет атрибуты элементов карточки данными
- render(): HTMLElement - метод возвращает полностью заполненную карточку с установленными слушателями
- геттер id возвращает уникальный id карточки

#### Класс `CardsContainer`
Отвечает за отображение каталога с карточками на главной странице. В конструктор принимает контейнер, в котором размещаются карточки.
- сеттер `container` для отображения каталога. 


### Класс `Modal` 
Отвечает за отображение модальных окон.\

constructor(container: HTMLElement, protected events: IEvents) Конструктор принимает контейнер в виде HTML элемента и экземпляр класса `EventEmitter` для возможности инициализации событий.\

Поля: 
- _closeButton: HTMLButtonElement - кнопка для закрытия окна
- _content: HTMLElement - элемент, внутри которого будет размещено содержимое окна

Методы:
- set content(value: HTMLElement) - устанавливает контент конкретного модального окна в шаблон
- open() - открывает модальное окно
- close() - закрывает модальное окно
- render(data: HTMLElement): HTMLElement - рендерит содержимое модального окна


### Класс `Busket`
Класс для отображения корзины.\
Поля:
- _items: HTMLElement[] - список товаров
- _total: HTMLElement - общая сумма покупки
- _deleteButton: HTMLElement - удаление товара из корзины
- _orderButton: HTMLElement - кнопка для оформления заказа

constructor(container: HTMLElement, protected events: IEvents) Конструктор принимает контейнер в виде HTML элемента и экземпляр класса `EventEmitter` для возможности инициализации событий.\

Методы:
- set items[] - отображение товаров в корзине
- set total - отображает итоговую сумму

### Класс `OrderForm`
Класс для отображения формы с выбором способа оплаты и адресом
- _paymentMethodCard
- _paymentMethodCash
- _adress

### Класс `ContactForm`
Класс для отображения формы ввода почты и телефона
- _email
- _phone

### Класс `SuccessOrder`
Класс для отображения модального окна, сообщающего об успешном оформлении заказа
Поля:
_img
_title
_total
_button

## Слой коммуникации
### Класс `AppApi`
Принимает в конструктор экземпляр класса Api и предоставляет методы реализующие взаимодействие с бэкендом сервиса.

## Взаимодействие компонентов
Роль презентера выполняет код файле `index.ts`. Взаимодействие осуществляется за счет событий генерируемых с помощью брокера событий и обработчиков этих событий, описанных в `index.ts`. В `index.ts` сначала создаются экземпляры всех необходимых классов, а затем настраивается обработка событий.

*События:*
- `cards:changed` - изменились элементы каталога
- `card:selected` - изменение открываемой в модальном окне карточки товара
- `card:open` - открытие модального окна с описанием товара
- `item:add` - добавление товара в корзину
- `item:remove` - удаление товара из корзины
- `order:open` - открытие модального окна со способом оплаты и адресом
- `order:selectPayment` - отслеживание выбора способа оплаты
- `order:changeAdress` - отслеживание изменения адреса
- `formError:payment` - валидация способа оплаты
- `formError:adress` - валидация адреса
- `contscts:open` - открытие модального окна с контактами
- `contacts:changeEmail` - отслеживание изменения почты
- `contacts:changePhone` - отслеживание изменения номера
- `formError:сontacts` - валидация контактов
- `success:open` - открытие модального окна в случае успешного завершения заказа
- `modal:open` `modal:close`- блок прокрутки страницы при открытии модального окна и разблок при закрытии