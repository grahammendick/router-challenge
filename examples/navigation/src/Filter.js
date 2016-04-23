import React from 'react';
import {RefreshLink} from 'navigation-react';
import {EARLIEST, LATEST} from './constants.js';

const Filter = ({search, sort, stateNavigator}) => {
    return (
        <div>
            <input
                value={search}
                onChange={e => {
                    var data = {search: e.target.value};
                    const stateContext = stateNavigator.stateContext; 
                    data = stateContext.includeCurrentData(data);
                    stateNavigator.refresh(data, 'none');
                }}
            />
            <RefreshLink
                navigationData={{sort: sort !== EARLIEST ? EARLIEST : LATEST}}
                includeCurrentData={true}
                stateNavigator={stateNavigator}>
                Year
            </RefreshLink>
        </div>
    );
}
export default Filter;
