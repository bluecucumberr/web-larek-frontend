export interface IProductItem {
    id: string;
    description: string;
    img: string;
    title: string;
    category: string;
    price: number | null;   
}

export interface IOrderResult {
    id: string;
    total: number;
}

export interface IOrder {
    paymentMethod: 'online' | 'offline';
    deliveryAddress: string;
    customerEmail: string;
    customerPhone: string;
}

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

export type TProductItemCard = Pick<IProductItem, 'id' | 'category' | 'title' | 'img' | 'price'>;

export type IOrderContactForm = Pick<IOrder, 'customerEmail' | 'customerPhone'>;
export type IOrderPayAndAdressForm = Pick<IOrder, 'paymentMethod' | 'deliveryAddress'>;
 
export type FormErrors = Partial<Record<keyof IOrder, string>>;

export type IBusketItem = Pick<IProductItem, 'id' | 'title' | 'price'>;
