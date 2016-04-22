import React from 'react';
import {RefreshLink} from 'navigation-react';

export default ({albums, stateNavigator}) => {
    var items = albums.map((album) => (
        <li>
            <RefreshLink
                navigationData={{id: album.id}}
                stateNavigator={stateNavigator}>
                {album.title}
            </RefreshLink>
        </li>
    ))
    return <ul>{items}</ul>;
}