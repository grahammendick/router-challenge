import React from 'react';
import {RefreshLink} from 'navigation-react';

const Search = ({search, stateNavigator}) => (
    <div id="search">
        <label htmlFor="field" className="hidden">Search</label>
        <input
            id="field"
            placeholder="Search"
            value={search}
            onChange={e => {
                var data = {search: e.target.value};
                const stateContext = stateNavigator.stateContext; 
                data = stateContext.includeCurrentData(data);
                stateNavigator.refresh(data, 'none');
            }}
        />
    </div>
)
export default Search;
