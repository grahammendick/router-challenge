import React from 'react';
import {RefreshLink} from 'navigation-react';

const Search = ({search, stateNavigator}) => (
    <div id="search">
        <label htmlFor="field" className="hidden">Search</label>
        <input
            id="field"
            placeholder="Search"
            autoFocus={true}
            value={search}
            onChange={e => {
                var data = {search: e.target.value};
                data = stateNavigator.stateContext.includeCurrentData(data);
                stateNavigator.refresh(data, 'none');
            }}
        />
    </div>
);
export default Search;
