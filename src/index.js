import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {YMaps} from "@pbe/react-yandex-maps";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <YMaps
        query={{
            ns: "use-load-option", load: "Map,Placemark,geoObject.addon.hint",
        }}
    >
        <App/>
    </YMaps>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
