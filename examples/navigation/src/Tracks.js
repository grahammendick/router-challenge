import React from 'react';
import {RefreshLink} from 'navigation-react';

var sides = [
    {key: '1', name: 'Side One'},
    {key: '2', name: 'Side Two'}
];

var Tracks = ({albums, id, side, stateNavigator}) => {
    if (!id)
        return <p>None</p>;
    var album = albums.filter(album => album.id === id)[0];
    var tracks = album['side' + side];
    return (
        <div>
            {sides.map(side => 
                <RefreshLink
                    key={side.key}
                    navigationData={{side: side.key}}
                    includeCurrentData={true}
                    historyAction="replace"
                    stateNavigator={stateNavigator}>
                    {side.name}
                </RefreshLink>
            )}
            <h2>{album.title}</h2>
            <ul>
                {tracks.map(track => 
                    <li key={track}>{track}</li>
                )}
            </ul>
        </div>
    );
}
export default Tracks;
