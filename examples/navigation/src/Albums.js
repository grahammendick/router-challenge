import React from 'react';
import {RefreshLink} from 'navigation-react';

var Albums = ({albums, band, sort, stateNavigator}) => {
    var mult = sort === 'earliest' ? 1 : -1;
    var items = albums
        .sort((albumA, albumB) => (albumA.year - albumB.year) * mult)
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
