import { IProductItem, IProductData } from "../types"
import { Model } from "./base/Model";

export class ProductData extends Model<IProductData> {
    protected _catalog: IProductItem[];
    protected _preview: string | null;

    set catalog(items: IProductItem[]) {
        this._catalog = items;
        this.emitChanges('catalog:changed');
    }

    get catalog(): IProductItem[] {
        return this._catalog;
    }

    set preview(itemId: string | null) {
        if (!itemId) {
            this._preview = null;
            return;
        }
        const selectedItem = this.getItem(itemId);
        if (selectedItem) {
            this._preview = itemId;
            this.emitChanges('preview:changed')
        }
    }
    
    get preview (): string {
        return this._preview;
    }
    
    getItem(itemId: string): IProductItem | null {
        return this._catalog.find((item) => item.id === itemId) || null;
    }
}