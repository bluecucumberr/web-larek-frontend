import { TFormErrors, IOrderUserInfo, IOrderData, IProductItem, IOrder } from "../types"
import { Model } from "./base/Model";

export class OrderData extends Model<IOrderData> {
    protected _items: string[];
    protected _orderInfo: IOrderUserInfo = {
        payment: '',
        email: '',
        phone: '',
        address: ''
    };
    orderErrors: TFormErrors = {};

    get orderInfo(): IOrderUserInfo | null {
        return this._orderInfo;
    }

    addItemToCart(id: string): void {
        if (!this._items.includes(id)) {
            this._items.push(id); 
            this.emitChanges('item:add');
        }
    }

    get items(): string[] {
        return this._items;
    }

    getItemCount(): number {
        return this._items.length;
    }

    removeItemFromCart(id: string): void {
        this._items = this._items.filter(item => item !== id);
        this.emitChanges('item:remove');
    }

    clearCart(): void {
        this._items = [];
        this.emitChanges('basket:clear');
    }

    calculateTotal(catalog: IProductItem[]): number {
        return this._items.reduce((total, itemId) => {
            const product = catalog.find(item => item.id === itemId);
            return total + (product?.price || 0); 
        }, 0);
    }

    setFormField(field: keyof IOrderUserInfo, value: string) {
        this._orderInfo[field] = value.trim();

        if(this.checkOrderField()){
            this.emitChanges('orderForm:ready', this.orderInfo);
        }
        if(this.checkContsctsField()){
            this.emitChanges('contactsForm:ready', this.orderInfo);
        }
    }    

    checkOrderField(): boolean {
        const err: typeof this.orderErrors = {};

        if (!this._orderInfo.payment) {
            err.payment = 'Укажите способ оплаты';
        } else if (!this._orderInfo.address) {
            err.address = 'Укажите адрес доставки';
        } else return true;

        this.orderErrors = err;
        this.emitChanges('formErrors:change', this.orderErrors);
        return Object.keys(err).length === 0;
    }
    
    checkContsctsField(): boolean {
        const err: typeof this.orderErrors = {};

        if (!this._orderInfo.phone) {
            err.phone = 'Укажите номер телефона';
        } else if (!this._orderInfo.email) {
            err.email = 'Укажите email';
        } else return true;

        this.orderErrors = err;
        this.emitChanges('contactsFormErrors:change', this.orderErrors);
        return Object.keys(err).length === 0;
    }
    
    getOrderInfo(catalog: IProductItem[]): IOrder {
        return { 
            payment: this.orderInfo.payment,
            email: this.orderInfo.email,
            phone: this.orderInfo.phone,
            address: this.orderInfo.address,
            total: this.calculateTotal(catalog),
            items: this._items
        }
    }
}