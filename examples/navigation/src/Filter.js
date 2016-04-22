import React from 'react';
import {RefreshLink} from 'navigation-react';
import {EARLIEST, LATEST, BANDS} from './constants.js';

const Filter = ({search, sort, stateNavigator}) => {
    const newSort = sort !== EARLIEST ? EARLIEST : LATEST;
    const handleSearch = val => {
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
            {BANDS.map(band => 
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
