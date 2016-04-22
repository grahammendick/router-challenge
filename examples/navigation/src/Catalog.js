import React from 'react';
import Filter from './Filter.js';
import Albums from './Albums.js';
import Tracks from './Tracks.js';

var Catalog = ({albums, band, sort, id, side, stateNavigator}) => (
    <div>
        <Filter sort={sort} stateNavigator={stateNavigator} />
        <Albums
            albums={albums}
            band={band}
            sort={sort}
            stateNavigator={stateNavigator}
        />
        <Tracks
            albums={albums}
            id={id}
            side={side}
            stateNavigator={stateNavigator}
        />
    </div>
)
export default Catalog;
