import {StateNavigator} from 'navigation';
import React from 'react';
import ReactDOM from 'react-dom';
import Catalog from './Catalog.js';
import {ALL, EARLIEST} from './constants.js';

const stateNavigator = new StateNavigator([
    {key: 'catalog', route: '{band?}+/from/{sort}', 
        defaults: {band: ALL, side: '1', sort: EARLIEST}, 
        defaultTypes: {id: 'number'}, trackTypes: false}
]);

var timeout;
stateNavigator.states.catalog.navigated = (data) => {
    ReactDOM.render(
        <Catalog
            albums={ALBUMS}
            search={data.search || ''}
            band={data.band}
            sort={data.sort}
            id={data.id}
            side={data.side}
            stateNavigator={stateNavigator}
        />,
        document.getElementById('catalog')
    );
    clearTimeout(timeout);
    timeout = setTimeout(() => {
        const currentUrl = stateNavigator.historyManager.getCurrentUrl();
        if (currentUrl !== stateNavigator.stateContext.url) {
            stateNavigator.navigateLink(stateNavigator.stateContext.url);
        }
    }, 1000);
}

stateNavigator.states.catalog.urlEncode = (state, key, val) => {
    val = encodeURIComponent(val);
    return key !== 'search' ? val : val.replace(/%20/g, '+');
}

stateNavigator.states.catalog.urlDecode = (state, key, val) => {
    val = decodeURIComponent(val);
    return key !== 'search' ? val : val.replace(/\+/g, ' ');
}

stateNavigator.start();
