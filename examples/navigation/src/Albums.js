import React from 'react';
import {RefreshLink} from 'navigation-react';
import {ALL, EARLIEST, BANDS} from './constants.js';

const Albums = ({albums, search, band, sort, stateNavigator}) => {
    const mult = sort === EARLIEST ? 1 : -1;
    const bandName = BANDS.filter(item => item.key === band)[0].name; 
    albums = albums
        .filter(album => !search || album.title.indexOf(search) !== -1)
        .filter(album => band === ALL || album.band === bandName)
        .sort((albumA, albumB) => (albumA.year - albumB.year) * mult);
    return (
        <ul>
            {albums.map(album => 
                <li key={album.id}>
                    <RefreshLink
                        navigationData={{id: album.id, side: null}}
                        includeCurrentData={true}
                        stateNavigator={stateNavigator}>
                        <img
                            src={'../../sleeves/' + album.sleeve}
                            alt={album.title}
                        />
                        {album.title}
                    </RefreshLink>
                </li>
            )}
        </ul>
    );
}
export default Albums;
