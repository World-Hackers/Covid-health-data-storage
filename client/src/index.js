import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter } from 'react-router-dom'
import {Provider} from 'react-redux';
import {createStore} from 'redux';
import rootReducer from './reducers/rootReducer';
// import persistedState from './reducers/LOAD_INITIAL_STATE';
// import saveToLocalStorage from './reducers/SAVE_INITIAL_STATE';
import SetContract from './setContract';

const store = createStore(rootReducer);

// store.subscribe(() => saveToLocalStorage(store.getState()))


ReactDOM.render((
    <Provider store={store}>
    <BrowserRouter>
        <SetContract/>
    </BrowserRouter>
    </Provider>
), document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
