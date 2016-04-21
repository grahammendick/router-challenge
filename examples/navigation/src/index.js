import {StateNavigator} from 'navigation';
import React from 'react';
import ReactDOM from 'react-dom';
import Catalog from './Catalog.js';

var stateNavigator = new StateNavigator([
    {key: 'catalog', route: ''}
]);

stateNavigator.states.catalog.navigated = (data) => {
    ReactDOM.render(
        <Catalog
            albums={data.albums}
            filter={data.filter}
            band={data.band}
            sort={data.sort}
        />,
        document.getElementById('catalog')
    );
}

stateNavigator.start();
