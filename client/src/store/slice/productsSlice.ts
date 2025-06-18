import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {IProduct} from "../../types/types";

interface IProductsState {
    countProducts: number
    productsInCart: IProduct[]
};
const data = localStorage.getItem('productsInCart');
const parseData = JSON.parse(data ? data : '[]')
const initialState: IProductsState = {
    countProducts: parseData?.length,
    productsInCart: parseData
};

export const products = createSlice({
    name: "products",
    initialState,
    reducers: {
        getProducts: (state: IProductsState, action: PayloadAction<IProduct[]>) => {
            state.productsInCart = [...action.payload]
        },
        addProductToCart: (state: IProductsState, action: PayloadAction<IProduct>) => {
            const existingProduct = state.productsInCart.find(product => product.id === action.payload.id);
            if (existingProduct) {
                existingProduct.count = existingProduct.count + 1;
                localStorage.setItem('productsInCart', JSON.stringify(state.productsInCart));
            } else {
                state.productsInCart = [...state.productsInCart, action.payload];
                localStorage.setItem('productsInCart', JSON.stringify(state.productsInCart));
            }
            state.countProducts = state.productsInCart.length
        },
        decrement: (state: IProductsState, action: PayloadAction<IProduct>) => {
            const item = state.productsInCart.find((item: IProduct) => item.id === action.payload.id)
            if (item?.count !== 1) {
                if (item) item.count = item?.count && item?.count - 1
            } else {
                if (window.confirm('Удалить товар из корзины?')) {
                    const index = state.productsInCart.indexOf(item && item)
                    state.productsInCart.splice(index, 1)
                }

            }
            state.countProducts = state.productsInCart.length
            localStorage.setItem('productsInCart', JSON.stringify(state.productsInCart))
        },
        deleteSwipeProduct: (state: IProductsState, action: PayloadAction<IProduct>) => {
            const item = state.productsInCart.find((item: IProduct) => item.id === action.payload.id)
            if (window.confirm('Удалить товар из корзины?') && item) {
                const index = state.productsInCart.indexOf(item)
                state.productsInCart.splice(index, 1)
                state.countProducts = state.productsInCart.length
                localStorage.setItem('productsInCart', JSON.stringify(state.productsInCart))
                return
            }
        },
        deleteProductInCart(state: IProductsState) {
            state.productsInCart = []
            state.countProducts = 0
        }
    },
});

export const {getProducts, addProductToCart, decrement,deleteSwipeProduct, deleteProductInCart} = products.actions;
export default products.reducer;
