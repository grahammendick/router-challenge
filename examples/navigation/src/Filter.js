import React from 'react';
import {RefreshLink} from 'navigation-react';

const Filter = ({search, sort, stateNavigator}) => {
    var newSort = sort !== 'earliest' ? 'earliest' : 'latest';
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
                navigationData={{sort: newSort}}
                includeCurrentData={true}
                stateNavigator={stateNavigator}>
                Year
            </RefreshLink>
        </div>
    );
}
export default Filter;
