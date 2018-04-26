import React from 'react';
import {RefreshLink} from 'navigation-react';

const Albums = ({albums, search, slug}) => {
    var filteredAlbums = albums.filter(({title, band}) => (!search
        || title.toLowerCase().indexOf(search.toLowerCase()) !== -1
        || band.toLowerCase().indexOf(search.toLowerCase()) !== -1
    ));
    return (
        <div id="albums">
            <ul>
            {filteredAlbums.map(album => 
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
