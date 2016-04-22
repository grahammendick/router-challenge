import React from 'react';
import {RefreshLink} from 'navigation-react';

var Albums = ({albums, search, band, sort, stateNavigator}) => {
    var mult = sort === 'earliest' ? 1 : -1;
    albums = albums
        .filter((album) => 
            (!search || album.title.indexOf(search) !== -1) &&
            (band === 'all' || album.band.toLowerCase().indexOf(band) !== -1)
        )
        .sort((albumA, albumB) => (albumA.year - albumB.year) * mult);
    return (
        <ul>
            {albums.map(album => 
                <li key={album.id}>
                    <RefreshLink
                        navigationData={{id: album.id, side: null}}
                        includeCurrentData={true}
                        stateNavigator={stateNavigator}>
                        {album.title}
                    </RefreshLink>
                </li>
            )}
        </ul>
    );
}
export default Albums;
