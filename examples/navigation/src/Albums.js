import React from 'react';
import {RefreshLink} from 'navigation-react';

var Albums = ({albums, band, stateNavigator}) => {
    var items = albums
        .filter((album) => {
            if (band === 'all')
                return true;
            return album.band.toLowerCase().indexOf(band.toLowerCase()) !== -1
        }).map((album) => (
            <li key={album.id}>
                <RefreshLink
                    navigationData={{id: album.id, side: null}}
                    includeCurrentData={true}
                    stateNavigator={stateNavigator}>
                    {album.title}
                </RefreshLink>
            </li>
        )
    )
    return <ul>{items}</ul>;
}
export default Albums;
