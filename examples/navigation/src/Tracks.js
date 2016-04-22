import React from 'react';
import {RefreshLink} from 'navigation-react';

export default ({albums, id, side, stateNavigator}) => {
    if (!id)
        return <p>None</p>;
    var album = albums.filter((album) => album.id === id)[0];
    var tracks = album['side' + side].map((track, i) => (
        <li key={i}>{track}</li>
    ))
    return (
        <div>
            <RefreshLink
                navigationData={{side: 1}}
                includeCurrentData={true}
                stateNavigator={stateNavigator}>
                Side 1
            </RefreshLink>
            <RefreshLink
                navigationData={{side: 2}}
                includeCurrentData={true}
                stateNavigator={stateNavigator}>
                Side 2
            </RefreshLink>
            <ul>{tracks}</ul>
        </div>
    );
}