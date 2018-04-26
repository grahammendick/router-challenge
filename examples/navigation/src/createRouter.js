import React from 'react';
import {StateNavigator} from 'navigation';
import Catalog from './Catalog.js';

export default () => {
    const stateNavigator = new StateNavigator([
        {key: 'catalog', route: '{slug?}+/side/{side}', title: 'Catalog',
            defaults: {side: '1'}, trackTypes: false}
    ]);
    var {catalog} = stateNavigator.states;

    catalog.urlEncode = (state, key, val) => {
        val = encodeURIComponent(val);
        return key !== 'search' ? val : val.replace(/%20/g, '+');
    }
    catalog.urlDecode = (state, key, val) => {
        val = key !== 'search' ? val : val.replace(/\+/g, '%20');
        return decodeURIComponent(val);
    }

    catalog.renderView = ({search, slug, side}, stateNavigator) => (
        <Catalog
            albums={ALBUMS}
            search={search || ''}
            album={ALBUMS.filter(album => album.slug === slug)[0]}
            side={side}
            stateNavigator={stateNavigator}
        />
    );
    return stateNavigator;
}
