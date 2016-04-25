import {StateNavigator} from 'navigation';

export default () => {
    const stateNavigator = new StateNavigator([
        {key: 'catalog', route: '{slug?}+/side/{side}', title: 'Catalog',
            defaults: {side: '1'}, trackTypes: false}
    ]);
    stateNavigator.states.catalog.urlEncode = (state, key, val) => {
        val = encodeURIComponent(val);
        return key !== 'search' ? val : val.replace(/%20/g, '+');
    }
    stateNavigator.states.catalog.urlDecode = (state, key, val) => {
        val = key !== 'search' ? val : val.replace(/\+/g, ' ');
        return decodeURIComponent(val);
    }
    return stateNavigator;
}
