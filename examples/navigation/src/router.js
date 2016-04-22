import {StateNavigator} from 'navigation';
import {ALL, EARLIEST} from './constants.js';

export default () => {
    const stateNavigator = new StateNavigator([
        {key: 'catalog', route: '{band?}+/from/{sort}', 
            defaults: {band: ALL, side: '1', sort: EARLIEST}, 
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
