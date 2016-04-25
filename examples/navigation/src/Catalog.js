import React from 'react';
import Search from './Search.js';
import Albums from './Albums.js';
import Tracks from './Tracks.js';

const Catalog = ({albums, search, album, side, stateNavigator}) => (
    <div id="catalog">
        <h1 className="hidden">Catalog</h1>
        <Search search={search} stateNavigator={stateNavigator} />
        <Albums
            albums={albums}
            search={search}
            stateNavigator={stateNavigator}
        />
        <Tracks
            album={album}
            side={side}
            stateNavigator={stateNavigator}
        />
    </div>
)
export default Catalog;
