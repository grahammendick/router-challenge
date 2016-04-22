import React from 'react';
import {RefreshLink} from 'navigation-react';

var Filter = ({sort, stateNavigator}) => {
    var newSort = sort !== 'earliest' ? 'earliest' : 'latest';
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
            <RefreshLink
                navigationData={{sort: newSort}}
                includeCurrentData={true}
                stateNavigator={stateNavigator}>
                Year
            </RefreshLink>
        </div>
    );
}
export default Filter;
