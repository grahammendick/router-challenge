import React from 'react';
import Filter from './Filter.js';
import Albums from './Albums.js';
import Tracks from './Tracks.js';

var Catalog = ({albums, band, id, side, stateNavigator}) => (
    <div>
        <Filter stateNavigator={stateNavigator} />
        <Albums
            albums={albums}
            band={band}
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
