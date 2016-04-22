import React from 'react';
import {RefreshLink} from 'navigation-react';

var Filter = ({stateNavigator}) => {
    return (
        <div>
            <RefreshLink
                navigationData={{band: 'all'}}
                includeCurrentData={true}
                stateNavigator={stateNavigator}>
                All
            </RefreshLink>
            <RefreshLink
                navigationData={{band: 'beatles'}}
                includeCurrentData={true}
                stateNavigator={stateNavigator}>
                The Beatles
            </RefreshLink>
            <RefreshLink
                navigationData={{band: 'stones'}}
                includeCurrentData={true}
                stateNavigator={stateNavigator}>
                The Rolling Stones
            </RefreshLink>
        </div>
    );
}
export default Filter;
