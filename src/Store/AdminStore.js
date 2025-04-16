import { makeAutoObservable, runInAction } from "mobx";
import trainers from "../mock/Trainers";

class AdminStore {
    orders = {};
    userOrders = {};
    singleOrder = {};
    isLoadingOrders = false;
    isCreatingProduct = false;
    isUpdating = false;
    newProducts = {};
    searchQuery = '';
    searchStatus = '';
    
    orderStatuses = [
        {1 : 'Pending'},
        {2 : 'Shipped'},
        {3 : 'Delivered'},
        {4 : 'Unpaid'},
        {5 : 'Return'}
    ];

    constructor() {
        makeAutoObservable(this);
    }
    
        
}

export const adminStore = new AdminStore();
