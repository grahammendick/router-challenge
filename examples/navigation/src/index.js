import React from 'react';
import ReactDOM from 'react-dom';
import {NavigationHandler, NavigationContext} from 'navigation-react';
import createRouter from './createRouter.js';

const stateNavigator = createRouter();

var timeout;
stateNavigator.onNavigate((oldState, state, data) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
        stateNavigator.historyManager
            .addHistory(stateNavigator.stateContext.url);
    }, 1000);
    var album = ALBUMS.filter(album => album.slug === data.slug)[0];
    if (album) {
        stateNavigator.stateContext.title = `${album.title}, ${album.band}`;
    }
});

stateNavigator.start();

ReactDOM.render(
    <NavigationHandler stateNavigator={stateNavigator}>
        <NavigationContext.Consumer>
            {({state, data, stateNavigator}) => (
                state.renderView(data, stateNavigator)
            )}
        </NavigationContext.Consumer>
    </NavigationHandler>,
    document.getElementById('catalog')
)
