import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import {RefreshLink} from 'navigation-react';

const Tracks = ({album, side, stateNavigator}) => {
    if (!album)
        return <p>None</p>;
    const flipped = stateNavigator.stateContext.oldData.slug === album.slug;
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
            <ReactCSSTransitionGroup
                transitionName="flip"
                transitionEnter={flipped}
                transitionLeave={flipped}
                transitionEnterTimeout={300}
                transitionLeaveTimeout={300}>
                <ol key={side}>
                {album['side' + side].map(track => 
                    <li key={track}>{track}</li>
                )}
                </ol>
            </ReactCSSTransitionGroup>
        </div>
    );
}
export default Tracks;
