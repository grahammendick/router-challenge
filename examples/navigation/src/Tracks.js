import React from 'react';
import {RefreshLink} from 'navigation-react';

const Tracks = ({album, side, stateNavigator}) => {
    if (!album)
        return <p>None</p>;
    const oldData = stateNavigator.stateContext.oldData;
    const flipped = oldData.slug == album.slug && oldData.side !== side;
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
            <ul className={flipped ? 'side' + side : null}>
                {album['side' + side].map(track => 
                    <li key={track}>{track}</li>
                )}
            </ul>
        </div>
    );
}
export default Tracks;
