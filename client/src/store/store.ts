import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { productsApi } from "./API/productsApi";
import { categoriesApi } from "./API/categoriesApi";
import productReducer from "./slice/productsSlice";
import userReducer from "./slice/userSlice";
import { ordersApi } from "./API/ordersApi";
import { searchApi } from "./API/searchApi";
import { userApi } from "./API/userApi";
import { contactsApi } from "./API/contactsApi";
import notificationReducer from "./slice/notificationSlice";
import { maintenanceApi } from "./API/maintenanceApi";
import { settingsApi } from "./API/settingsApi";


const rootReducer = combineReducers({
    [productsApi.reducerPath]: productsApi.reducer,
    [categoriesApi.reducerPath]: categoriesApi.reducer,
    [ordersApi.reducerPath]: ordersApi.reducer,
    [searchApi.reducerPath]: searchApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [contactsApi.reducerPath]: contactsApi.reducer,
    [maintenanceApi.reducerPath]: maintenanceApi.reducer,
    [settingsApi.reducerPath]: settingsApi.reducer,
    productReducer,
    userReducer,
    notificationReducer,
});

export const setupStore = () =>
    configureStore({
        reducer: rootReducer,
        middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(
            productsApi.middleware,
            categoriesApi.middleware,
            ordersApi.middleware,
            searchApi.middleware,
            userApi.middleware,
            contactsApi.middleware,
            maintenanceApi.middleware,
            settingsApi.middleware,
        ),
    });

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];