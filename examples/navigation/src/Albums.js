import React from 'react';
import {RefreshLink} from 'navigation-react';

export default ({albums, stateNavigator}) => {
    var items = albums.map((album) => (
        <li key={album.id}>
            <RefreshLink
                navigationData={{id: album.id, side: null}}
                includeCurrentData={true}
                stateNavigator={stateNavigator}>
                {album.title}
            </RefreshLink>
        </li>
    ))
    return <ul>{items}</ul>;
}