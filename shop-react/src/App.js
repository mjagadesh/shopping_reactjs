import React from 'react';
// import logo from './logo.svg';
// import './App.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import ShoppingMenu from './containers/ShopContainers';

function App() {
    return (

        <
        BrowserRouter >
        <
        Switch >

        <
        Route path = "/"
        component = { ShoppingMenu }
        /> < /
        Switch > <
        /BrowserRouter>

    );
}

export default App;