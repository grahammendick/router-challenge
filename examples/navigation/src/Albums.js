import React from 'react';
import {RefreshLink} from 'navigation-react';

const Albums = ({albums, search, stateNavigator}) => {
    albums = albums
        .filter(album => !search || album.title.indexOf(search) !== -1);
    return (
        <div id="albums">
            <ul>
            {albums.map(album => 
                <li key={album.slug}>
                    <RefreshLink
                        navigationData={{slug: album.slug, side: ''}}
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
       </div> 
    );
}
export default Albums;
