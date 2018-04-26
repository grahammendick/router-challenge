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
            {filteredAlbums.map(({slug: albumSlug, title, band}) => 
                <li key={albumSlug}>
                    <RefreshLink
                        navigationData={{slug: albumSlug, side: ''}}
                        includeCurrentData={true}
                        historyAction={albumSlug === slug ? 'replace' : 'add'}>
                        <img
                            src={`../../sleeves/${albumSlug}.jpg`}
                            alt={title}
                        />
                        <div>{title}</div>
                        <div>{band}</div>
                    </RefreshLink>
                </li>
            )}
            </ul>
       </div> 
    );
}
export default Albums;
