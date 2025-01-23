// Данные о товаре, получаемые с сервера
export interface IProductItem {
    id: string;
    description: string;
    image: string;
    title: string;
    category: string;
    price: number | null;   
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

// Интерфейс для работы с основными функциями магазина
export interface IOrderData {
    items: string[];
    orderInfo: IOrderUserInfo | null;

    addItemToCart(id: string): void;
    removeItemFromCart(id: string): void;
    getItemCount(): number;
    clearCart(): void;
    calculateTotal(catalog: IProductItem[]): number;

    checkOrderField(): boolean;
    checkContsctsField(): boolean;
    setFormField(field: keyof IOrderUserInfo, value: string): void;
  
    getOrderInfo(catalog: IProductItem[]): IOrder;
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

// Данные товара в карточке в каталоге на главной странице
export type TProductItemCard = Pick<IProductItem, 'id' | 'category' | 'title' | 'image' | 'price'>;

// Данные товара, используемые в корзине
export type IBusketItem = Pick<IProductItem, 'id' | 'title' | 'price'>;