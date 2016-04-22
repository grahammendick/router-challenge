import React from 'react';
import {RefreshLink} from 'navigation-react';

var bands = [
    {key: 'all', name: 'All'},
    {key: 'beatles', name: 'The Beatles'},
    {key: 'stones', name: 'The Rolling Stones'},
];

var Filter = ({search, sort, stateNavigator}) => {
    var newSort = sort !== 'earliest' ? 'earliest' : 'latest';
    var handleSearch = val => {
        var data = {search: val};
        data = stateNavigator.stateContext.includeCurrentData(data);
        stateNavigator.refresh(data, 'none');
    }
    return (
        <div>
            <input
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
            />
            {bands.map(band => 
                <RefreshLink
                    key={band.key}
                    navigationData={{band: band.key}}
                    includeCurrentData={true}
                    stateNavigator={stateNavigator}>
                    {band.name}
                </RefreshLink>
            )}
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
