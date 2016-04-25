import React from 'react';
import ReactDOM from 'react-dom';
import Catalog from './Catalog.js';
import createStateNavigator from './router.js';

const stateNavigator = createStateNavigator();

stateNavigator.states.catalog.navigated = (data) => {
    const album = ALBUMS.filter(album => album.slug === data.slug)[0];
    stateNavigator.stateContext.title = album ? album.title : 'Catalog';
    ReactDOM.render(
        <Catalog
            albums={ALBUMS}
            search={data.search || ''}
            album={album}
            side={data.side}
            stateNavigator={stateNavigator}
        />,
        document.getElementById('catalog')
    );
}

stateNavigator.start();
