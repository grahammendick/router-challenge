import {StateNavigator} from 'navigation';

export default () => {
    const stateNavigator = new StateNavigator([
        {key: 'catalog', route: '{sort?}+/from/{id}', 
            title: 'Catalog', defaults: {sort: 'earliest'}, 
            defaultTypes: {id: 'number'}, trackTypes: false}
    ]);
    stateNavigator.states.catalog.urlEncode = (state, key, val) => {
        val = encodeURIComponent(val);
        return key !== 'search' ? val : val.replace(/%20/g, '+');
    }
    stateNavigator.states.catalog.urlDecode = (state, key, val) => {
        val = decodeURIComponent(val);
        return key !== 'search' ? val : val.replace(/\+/g, ' ');
    }
    return stateNavigator;
}
