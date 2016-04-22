import {StateNavigator} from 'navigation';
import React from 'react';
import ReactDOM from 'react-dom';
import Catalog from './Catalog.js';

var stateNavigator = new StateNavigator([
    {key: 'catalog', route: '', defaults: {side: 1}, defaultTypes: {id: 'number'}}
]);

stateNavigator.states.catalog.navigated = (data) => {
    ReactDOM.render(
        <Catalog
            albums={ALBUMS}
            search={data.search}
            band={data.band}
            sort={data.sort}
            id={data.id}
            side={data.side}
            stateNavigator={stateNavigator}
        />,
        document.getElementById('catalog')
    );
}

stateNavigator.start();
