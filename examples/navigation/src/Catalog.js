import React from 'react';
import Albums from './Albums.js';
import Tracks from './Tracks.js';

export default ({albums, id, stateNavigator}) => (
    <div>
        <Albums
            albums={albums}
            stateNavigator={stateNavigator}
        />
        <Tracks
            albums={albums}
            id={id}
            stateNavigator={stateNavigator}
        />
    </div>
)
