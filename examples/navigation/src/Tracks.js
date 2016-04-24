import React from 'react';
import {RefreshLink} from 'navigation-react';

const Tracks = ({album, side, stateNavigator}) => {
    if (!album)
        return <p>None</p>;
    const oldData = stateNavigator.stateContext.oldData;
    const data = stateNavigator.stateContext.data;
    const flipped = oldData.slug == data.slug && oldData.side !== data.side;
    return (
        <div>
            <h2>{album.title}</h2>
            {[1,2].map(side =>
                <RefreshLink
                    key={side}
                    navigationData={{side: side}}
                    includeCurrentData={true}
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
