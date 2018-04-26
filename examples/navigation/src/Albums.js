import React from 'react';
import {RefreshLink} from 'navigation-react';

const Albums = ({albums, search, slug}) => {
    if (search) {
        albums = albums.filter(album => 
            album.title.toLowerCase().indexOf(search.toLowerCase()) !== -1
            || album.band.toLowerCase().indexOf(search.toLowerCase()) !== -1);
    }
    return (
        <div id="albums">
            <ul>
            {albums.map(album => 
                <li key={album.slug}>
                    <RefreshLink
                        navigationData={{slug: album.slug, side: ''}}
                        includeCurrentData={true}
                        historyAction={album.slug === slug ? 'replace' : 'add'}>
                        <img
                            src={`../../sleeves/${album.slug}.jpg`}
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
