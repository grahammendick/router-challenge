import React from 'react';
import ReactDOM from 'react-dom';
import {NavigationHandler, NavigationContext} from 'navigation-react';
import Catalog from './Catalog.js';
import createStateNavigator from './router.js';

const stateNavigator = createStateNavigator();
var {catalog} = stateNavigator.states;

catalog.renderView = (data, stateNavigator) => (
    <Catalog
        albums={ALBUMS}
        search={data.search || ''}
        album={ALBUMS.filter(album => album.slug === data.slug)[0]}
        side={data.side}
        stateNavigator={stateNavigator}
    />
);

/*
    if (album) {
        stateNavigator.stateContext.title = `${album.title}, ${album.band}`;
    }

    clearTimeout(stateNavigator.states.catalog.timeout);
    stateNavigator.states.catalog.timeout = setTimeout(() => {
        stateNavigator.historyManager
            .addHistory(stateNavigator.stateContext.url);
    }, 1000);
*/

stateNavigator.start();

ReactDOM.render(
    <NavigationHandler stateNavigator={stateNavigator}>
        <NavigationContext.Consumer>
            {({state, data, stateNavigator}) => state.renderView(data, stateNavigator)}
        </NavigationContext.Consumer>
    </NavigationHandler>,
    document.getElementById('catalog')
)
