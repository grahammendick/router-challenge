import React from 'react';
import {RefreshLink} from 'navigation-react';

const Tracks = ({album, side, stateNavigator}) => {
    if (!album)
        return <p>None</p>;
    return (
        <div id="tracks">
            <h2>{album.title}</h2>
            {[1,2].map(side =>
                <RefreshLink
                    key={side}
                    navigationData={{side: side}}
                    includeCurrentData={true}
                    historyAction="replace"
                    activeCssClass="selected"
                    stateNavigator={stateNavigator}>
                    Side {side}
                </RefreshLink>
            )}
            <ol>
                {album['side' + side].map(track => 
                    <li key={track}>{track}</li>
                )}
            </ol>
        </div>
    );
}
export default Tracks;
