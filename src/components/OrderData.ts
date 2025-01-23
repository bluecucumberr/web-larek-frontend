import { TFormErrors, IOrderUserInfo, IAppData, IProductItem, IOrder } from "../types"
import { Model } from "./base/Model";

export class AppData extends Model<IAppData> {
    protected _items: string[] = [];
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

        if (!Array.isArray(catalog)) {
            console.error('catalog должен быть массивом', catalog);
            return 0;
        }

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
        if (!Array.isArray(catalog)) {
            console.error('catalog должен быть массивом', catalog);
        }
        return { 
            payment: this.orderInfo.payment,
            email: this.orderInfo.email,
            phone: this.orderInfo.phone,
            address: this.orderInfo.address,
            total: this.calculateTotal(catalog),
            items: this._items
        }
    }

    removePricelessProductFromCart(catalog: IProductItem[]):void {
        const productsToRemove = this._items.filter(itemId => {
            const product = catalog.find(product => product.id === itemId);
            return product && product.price === null;
        });
    
        if (productsToRemove.length > 0) {
            productsToRemove.forEach(itemId => {
                this.removeItemFromCart(itemId); 
            });
        }
    }

    checkBasket(catalog: IProductItem[]): boolean {
        const itemsInCart = this._items.map(itemId => 
            catalog.find(product => product.id === itemId)
        ).filter(product => product !== undefined); 
        const total = this.getOrderInfo(itemsInCart).total;
        return !(total === 0 || total === null);
    }
}