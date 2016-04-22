import React from 'react';
import {RefreshLink} from 'navigation-react';
import {ALL, EARLIEST} from './constants.js';

const Albums = ({albums, search, band, sort, stateNavigator}) => {
    const mult = sort === EARLIEST ? 1 : -1;
    albums = albums
        .filter(album => 
            (!search || album.title.indexOf(search) !== -1) &&
            (band === ALL || album.band.toLowerCase().indexOf(band) !== -1)
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
