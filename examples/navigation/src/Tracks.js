import React from 'react';
import {RefreshLink} from 'navigation-react';

const Tracks = ({album, stateNavigator}) => {
    if (!album)
        return <p>None</p>;
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
