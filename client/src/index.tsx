import React, {Suspense} from 'react';
import ReactDOM from 'react-dom/client';
import './reset.scss';
import App from './App';
import {BrowserRouter} from 'react-router-dom';
import {Provider} from "react-redux";
import {setupStore} from "./store/store";
import {Loader} from "./shared/loader/loader";

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
const store = setupStore();
root.render(
    <React.StrictMode>
        <Provider store={store}>
            <BrowserRouter>
                <Suspense fallback={<Loader circle/>}>
                    <App/>
                </Suspense>
            </BrowserRouter>
        </Provider>
    </React.StrictMode>
);


