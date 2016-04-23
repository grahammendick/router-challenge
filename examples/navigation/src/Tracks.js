import React from 'react';
import {RefreshLink} from 'navigation-react';

const Tracks = ({albums, id, stateNavigator}) => {
    if (!id)
        return <p>None</p>;
    const album = albums.filter(album => album.id === id)[0];
    return (
        <div>
            <h2>{album.title}</h2>
            <ul>
                {album.tracks.map(track => 
                    <li key={track}>{track}</li>
                )}
            </ul>
        </div>
    );
}
export default Tracks;
