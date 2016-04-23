import React from 'react';
import ReactDOM from 'react-dom';
import Catalog from './Catalog.js';
import createStateNavigator from './router.js';

const stateNavigator = createStateNavigator();

var timeout;
stateNavigator.states.catalog.navigated = (data) => {
    ReactDOM.render(
        <Catalog
            albums={ALBUMS}
            search={data.search || ''}
            sort={data.sort}
            id={data.id}
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

stateNavigator.start();
