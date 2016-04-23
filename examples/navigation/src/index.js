import React from 'react';
import ReactDOM from 'react-dom';
import Catalog from './Catalog.js';
import createStateNavigator from './router.js';

const stateNavigator = createStateNavigator();

stateNavigator.states.catalog.navigated = (data) => {
    const album = ALBUMS.filter(album => album.slug === data.slug)[0];
    ReactDOM.render(
        <Catalog
            albums={ALBUMS}
            search={data.search || ''}
            sort={data.sort}
            album={album}
            stateNavigator={stateNavigator}
        />,
        document.getElementById('catalog')
    );
    stateNavigator.stateContext.title = album ? album.title : 'Catalog';
    checkHistory();
}

var timeout;
const checkHistory = () => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
        const currentUrl = stateNavigator.historyManager.getCurrentUrl();
        if (currentUrl !== stateNavigator.stateContext.url) {
            stateNavigator.navigateLink(stateNavigator.stateContext.url);
        }
    }, 1000);
}

stateNavigator.start();
