import React from 'react';
import {RefreshLink} from 'navigation-react';

const Albums = ({albums, search, stateNavigator}) => {
    if (search) {
        albums = albums.filter(album => 
            album.title.toLowerCase().indexOf(search.toLowerCase()) !== -1);
    }
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
                        <div>{album.title}</div>
                        <div>{album.band}</div>
                    </RefreshLink>
                </li>
            )}
            </ul>
       </div> 
    );
}
export default Albums;
