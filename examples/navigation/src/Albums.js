import React from 'react';
import {RefreshLink} from 'navigation-react';

const Albums = ({albums, search, band, sort, stateNavigator}) => {
    const mult = sort === 'earliest' ? 1 : -1;
    albums = albums
        .filter(album => !search || album.title.indexOf(search) !== -1)
        .sort((albumA, albumB) => (albumA.year - albumB.year) * mult);
    return (
        <ul>
            {albums.map(album => 
                <li key={album.slug}>
                    <RefreshLink
                        navigationData={{slug: album.slug}}
                        includeCurrentData={true}
                        activeCssClass="selected"
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
