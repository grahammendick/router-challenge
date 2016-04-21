(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
var StateContext = require('./StateContext');
var StateNavigator = require('./StateNavigator');
var State = require('./config/State');
var HashHistoryManager = require('./history/HashHistoryManager');
var HTML5HistoryManager = require('./history/HTML5HistoryManager');
var Crumb = require('./config/Crumb');
var Navigation = (function () {
    function Navigation() {
    }
    Navigation.State = State;
    Navigation.HashHistoryManager = HashHistoryManager;
    Navigation.HTML5HistoryManager = HTML5HistoryManager;
    Navigation.Crumb = Crumb;
    Navigation.StateContext = StateContext;
    Navigation.StateNavigator = StateNavigator;
    return Navigation;
}());
module.exports = Navigation;

},{"./StateContext":4,"./StateNavigator":6,"./config/Crumb":8,"./config/State":9,"./history/HTML5HistoryManager":17,"./history/HashHistoryManager":18}],2:[function(require,module,exports){
"use strict";
var NavigationDataManager = (function () {
    function NavigationDataManager() {
    }
    NavigationDataManager.formatData = function (converterFactory, state, navigationData, crumbTrail) {
        var data = {};
        var arrayData = {};
        for (var key in navigationData) {
            var val = navigationData[key];
            if (val != null && val.toString())
                this.formatDataItem(converterFactory, state, key, val, data, arrayData);
        }
        if (state.trackCrumbTrail && crumbTrail.length > 0)
            this.formatDataItem(converterFactory, state, state.crumbTrailKey, crumbTrail, data, arrayData);
        return { data: data, arrayData: arrayData };
    };
    NavigationDataManager.formatDataItem = function (converterFactory, state, key, val, data, arrayData) {
        var formattedData = this.formatURLObject(converterFactory, key, val, state);
        val = formattedData.val;
        if (val !== state.formattedDefaults[key]) {
            data[key] = val;
            arrayData[key] = formattedData.arrayVal;
        }
    };
    NavigationDataManager.decodeUrlValue = function (urlValue) {
        return urlValue.replace(new RegExp('0' + this.SEPARATOR, 'g'), this.SEPARATOR);
    };
    NavigationDataManager.encodeUrlValue = function (urlValue) {
        return urlValue.replace(new RegExp(this.SEPARATOR, 'g'), '0' + this.SEPARATOR);
    };
    NavigationDataManager.formatURLObject = function (converterFactory, key, urlObject, state, encode) {
        if (encode === void 0) { encode = false; }
        encode = encode || state.trackTypes;
        var defaultType = state.defaultTypes[key] ? state.defaultTypes[key] : 'string';
        var converter = converterFactory.getConverter(urlObject);
        var convertedValue = converter.convertTo(urlObject);
        var formattedValue = convertedValue.val;
        var formattedArray = convertedValue.arrayVal;
        if (encode) {
            formattedValue = this.encodeUrlValue(formattedValue);
            if (formattedArray)
                formattedArray[0] = this.encodeUrlValue(formattedArray[0]);
        }
        if (state.trackTypes && converter.name !== defaultType) {
            formattedValue += this.SEPARATOR1 + converter.key;
            if (formattedArray)
                formattedArray[0] = formattedArray[0] + this.SEPARATOR1 + converter.key;
        }
        return { val: formattedValue, arrayVal: formattedArray };
    };
    NavigationDataManager.parseData = function (converterFactory, data, state, separableData) {
        var newData = {};
        for (var key in data) {
            if (!this.isDefault(key, data, state, !!separableData[key]))
                newData[key] = this.parseURLString(converterFactory, key, data[key], state, false, !!separableData[key]);
        }
        for (var key in state.defaults) {
            if (newData[key] == null || !newData[key].toString())
                newData[key] = state.defaults[key];
        }
        return newData;
    };
    NavigationDataManager.isDefault = function (key, data, state, separable) {
        var val = data[key];
        var arrayDefaultVal = state.formattedArrayDefaults[key];
        if (!separable || !arrayDefaultVal) {
            return val === state.formattedDefaults[key];
        }
        else {
            if (typeof val === 'string')
                val = [val];
            if (val.length !== arrayDefaultVal.length)
                return false;
            for (var i = 0; i < val.length; i++) {
                if (val[i] !== arrayDefaultVal[i])
                    return false;
            }
            return true;
        }
    };
    NavigationDataManager.parseURLString = function (converterFactory, key, val, state, decode, separable) {
        if (decode === void 0) { decode = false; }
        if (separable === void 0) { separable = false; }
        decode = decode || state.trackTypes;
        var defaultType = state.defaultTypes[key] ? state.defaultTypes[key] : 'string';
        var urlValue = typeof val === 'string' ? val : val[0];
        var converterKey = converterFactory.getConverterFromName(defaultType).key;
        if (state.trackTypes && urlValue.indexOf(this.SEPARATOR1) > -1) {
            var arr = urlValue.split(this.SEPARATOR1);
            urlValue = arr[0];
            converterKey = arr[1];
        }
        if (decode)
            urlValue = this.decodeUrlValue(urlValue);
        if (typeof val === 'string')
            val = urlValue;
        else
            val[0] = urlValue;
        return converterFactory.getConverterFromKey(converterKey).convertFrom(val, separable);
    };
    NavigationDataManager.SEPARATOR = '_';
    NavigationDataManager.SEPARATOR1 = '1_';
    return NavigationDataManager;
}());
module.exports = NavigationDataManager;

},{}],3:[function(require,module,exports){
"use strict";
var NavigationDataManager = require('./NavigationDataManager');
var State = require('./config/State');
var StateConfig = (function () {
    function StateConfig() {
    }
    StateConfig.build = function (states, converterFactory) {
        var builtStates = [];
        var stateKeys = {};
        for (var i = 0; i < states.length; i++) {
            var stateObject = states[i];
            var state = new State();
            for (var key in stateObject)
                state[key] = stateObject[key];
            if (!state.key)
                throw new Error('State key is mandatory');
            if (state.route == null)
                state.route = state.key;
            if (state.trackCrumbTrail) {
                state.trackCrumbTrail = true;
                var trackCrumbTrail = stateObject.trackCrumbTrail;
                if (typeof trackCrumbTrail === 'string')
                    state.crumbTrailKey = trackCrumbTrail;
                state.defaultTypes[state.crumbTrailKey] = 'stringarray';
            }
            for (var key in state.defaults) {
                if (!state.defaultTypes[key])
                    state.defaultTypes[key] = converterFactory.getConverter(state.defaults[key]).name;
                var formattedData = NavigationDataManager.formatURLObject(converterFactory, key, state.defaults[key], state);
                state.formattedDefaults[key] = formattedData.val;
                if (formattedData.arrayVal)
                    state.formattedArrayDefaults[key] = formattedData.arrayVal;
            }
            for (var key in state.defaultTypes) {
                converterFactory.getConverterFromName(state.defaultTypes[key]);
            }
            if (stateKeys[state.key])
                throw new Error('A State with key ' + state.key + ' already exists');
            stateKeys[state.key] = true;
            builtStates.push(state);
        }
        return builtStates;
    };
    return StateConfig;
}());
module.exports = StateConfig;

},{"./NavigationDataManager":2,"./config/State":9}],4:[function(require,module,exports){
"use strict";
var StateContext = (function () {
    function StateContext() {
        this.oldState = null;
        this.oldData = {};
        this.previousState = null;
        this.previousData = {};
        this.state = null;
        this.data = {};
        this.url = null;
        this.title = null;
        this.crumbs = [];
        this.crumbTrail = [];
        this.nextCrumb = null;
    }
    StateContext.prototype.clear = function () {
        this.oldState = null;
        this.oldData = {};
        this.previousState = null;
        this.previousData = {};
        this.state = null;
        this.data = {};
        this.url = null;
        this.title = null;
        this.crumbs = [];
        this.crumbTrail = [];
        this.nextCrumb = null;
    };
    StateContext.prototype.includeCurrentData = function (data, keys) {
        if (!keys) {
            keys = [];
            for (var key in this.data)
                keys.push(key);
        }
        var newData = {};
        for (var i = 0; i < keys.length; i++)
            newData[keys[i]] = this.data[keys[i]];
        for (var key in data)
            newData[key] = data[key];
        return newData;
    };
    return StateContext;
}());
module.exports = StateContext;

},{}],5:[function(require,module,exports){
"use strict";
var StateHandler = (function () {
    function StateHandler() {
    }
    StateHandler.getNavigationLink = function (router, state, data, arrayData) {
        if (arrayData === void 0) { arrayData = {}; }
        var routeInfo = router.getRoute(state, data, arrayData);
        if (routeInfo.route == null)
            return null;
        var query = [];
        for (var key in data) {
            if (!routeInfo.data[key]) {
                var arr = arrayData[key];
                var encodedKey = state.urlEncode(state, null, key, true);
                if (!arr) {
                    query.push(encodedKey + '=' + state.urlEncode(state, key, data[key], true));
                }
                else {
                    for (var i = 0; i < arr.length; i++)
                        query.push(encodedKey + '=' + state.urlEncode(state, key, arr[i], true));
                }
            }
        }
        if (query.length > 0)
            routeInfo.route += '?' + query.join('&');
        return routeInfo.route;
    };
    StateHandler.getNavigationData = function (router, state, url) {
        var queryIndex = url.indexOf('?');
        var route = queryIndex < 0 ? url : url.substring(0, queryIndex);
        var _a = router.getData(route), data = _a.data, separableData = _a.separableData;
        data = data ? data : {};
        if (queryIndex >= 0) {
            var query = url.substring(queryIndex + 1);
            var params = query.split('&');
            for (var i = 0; i < params.length; i++) {
                var param = params[i].split('=');
                var key = state.urlDecode(state, null, param[0], true);
                var val = state.urlDecode(state, key, param[1], true);
                separableData[key] = true;
                var arr = data[key];
                if (!arr) {
                    data[key] = val;
                }
                else {
                    if (typeof arr === 'string')
                        data[key] = arr = [arr];
                    arr.push(val);
                }
            }
        }
        return { data: data, separableData: separableData };
    };
    return StateHandler;
}());
module.exports = StateHandler;

},{}],6:[function(require,module,exports){
"use strict";
var ConverterFactory = require('./converter/ConverterFactory');
var Crumb = require('./config/Crumb');
var HashHistoryManager = require('./history/HashHistoryManager');
var NavigationDataManager = require('./NavigationDataManager');
var StateContext = require('./StateContext');
var StateConfig = require('./StateConfig');
var StateHandler = require('./StateHandler');
var StateRouter = require('./StateRouter');
var StateNavigator = (function () {
    function StateNavigator(states, historyManager) {
        this.NAVIGATE_HANDLER_ID = 'navigateHandlerId';
        this.navigateHandlerId = 1;
        this.navigateHandlers = {};
        this.converterFactory = new ConverterFactory();
        this.router = new StateRouter();
        this.stateContext = new StateContext();
        this.states = {};
        if (states)
            this.configure(states, historyManager);
    }
    StateNavigator.prototype.configure = function (stateInfos, historyManager) {
        var _this = this;
        if (this.historyManager)
            this.historyManager.stop();
        this.historyManager = historyManager ? historyManager : new HashHistoryManager();
        this.historyManager.init(function () {
            if (_this.stateContext.url === _this.historyManager.getCurrentUrl())
                return;
            _this.navigateLink(_this.historyManager.getCurrentUrl(), undefined, true);
        });
        var states = StateConfig.build(stateInfos, this.converterFactory);
        this.states = {};
        for (var i = 0; i < states.length; i++)
            this.states[states[i].key] = states[i];
        this.router.addRoutes(states);
    };
    StateNavigator.prototype.setStateContext = function (state, data, url) {
        this.stateContext.oldState = this.stateContext.state;
        this.stateContext.oldData = this.stateContext.data;
        this.stateContext.state = state;
        this.stateContext.url = url;
        this.stateContext.title = state.title;
        this.stateContext.data = data;
        this.buildCrumbTrail(false);
        this.stateContext.previousState = null;
        this.stateContext.previousData = {};
        if (this.stateContext.crumbs.length > 0) {
            var previousStateCrumb = this.stateContext.crumbs.slice(-1)[0];
            this.stateContext.previousState = previousStateCrumb.state;
            this.stateContext.previousData = previousStateCrumb.data;
        }
    };
    StateNavigator.prototype.buildCrumbTrail = function (uncombined) {
        this.stateContext.crumbTrail = [];
        var crumbTrail = this.stateContext.data[this.stateContext.state.crumbTrailKey];
        if (crumbTrail)
            this.stateContext.crumbTrail = crumbTrail;
        delete this.stateContext.data[this.stateContext.state.crumbTrailKey];
        this.stateContext.crumbs = this.getCrumbs();
        var crumblessUrl = this.getLink(this.stateContext.state, this.stateContext.data, []);
        if (!crumblessUrl)
            throw new Error(this.stateContext.state.crumbTrailKey + ' cannot be a mandatory route parameter');
        this.stateContext.nextCrumb = new Crumb(this.stateContext.data, this.stateContext.state, this.stateContext.url, crumblessUrl, false);
    };
    StateNavigator.prototype.getCrumbs = function () {
        var crumbs = [];
        var len = this.stateContext.crumbTrail.length;
        for (var i = 0; i < len; i++) {
            var crumblessUrl = this.stateContext.crumbTrail[i];
            var _a = this.parseLink(crumblessUrl), state = _a.state, data = _a.data;
            var url = this.getLink(state, data, this.stateContext.crumbTrail.slice(0, i));
            crumbs.push(new Crumb(data, state, url, crumblessUrl, i + 1 === len));
        }
        return crumbs;
    };
    StateNavigator.prototype.onNavigate = function (handler) {
        if (!handler[this.NAVIGATE_HANDLER_ID]) {
            var id = this.NAVIGATE_HANDLER_ID + this.navigateHandlerId++;
            handler[this.NAVIGATE_HANDLER_ID] = id;
            this.navigateHandlers[id] = handler;
        }
        else {
            throw new Error('Cannot add the same handler more than once');
        }
    };
    StateNavigator.prototype.offNavigate = function (handler) {
        delete this.navigateHandlers[handler[this.NAVIGATE_HANDLER_ID]];
        delete handler[this.NAVIGATE_HANDLER_ID];
    };
    StateNavigator.prototype.navigate = function (stateKey, navigationData, historyAction) {
        var url = this.getNavigationLink(stateKey, navigationData);
        if (url == null)
            throw new Error('Invalid route data, a mandatory route parameter has not been supplied a value');
        this.navigateLink(url, historyAction);
    };
    StateNavigator.prototype.getNavigationLink = function (stateKey, navigationData) {
        if (!this.states[stateKey])
            throw new Error(stateKey + ' is not a valid State');
        return this.getLink(this.states[stateKey], navigationData);
    };
    StateNavigator.prototype.getLink = function (state, navigationData, crumbTrail) {
        if (!crumbTrail) {
            crumbTrail = [];
            var crumbs = this.stateContext.crumbs.slice();
            if (this.stateContext.nextCrumb)
                crumbs.push(this.stateContext.nextCrumb);
            crumbs = state.truncateCrumbTrail(state, crumbs);
            for (var i = 0; i < crumbs.length; i++)
                crumbTrail.push(crumbs[i].crumblessUrl);
        }
        var _a = NavigationDataManager.formatData(this.converterFactory, state, navigationData, crumbTrail), data = _a.data, arrayData = _a.arrayData;
        return StateHandler.getNavigationLink(this.router, state, data, arrayData);
    };
    StateNavigator.prototype.canNavigateBack = function (distance) {
        return distance <= this.stateContext.crumbs.length && distance > 0;
    };
    StateNavigator.prototype.navigateBack = function (distance, historyAction) {
        var url = this.getNavigationBackLink(distance);
        if (url == null)
            throw new Error('Invalid route data, a mandatory route parameter has not been supplied a value');
        this.navigateLink(url, historyAction);
    };
    StateNavigator.prototype.getNavigationBackLink = function (distance) {
        if (!this.canNavigateBack(distance))
            throw new Error('The distance parameter must be greater than zero and less than or equal to the number of Crumbs (' + this.stateContext.crumbs.length + ')');
        return this.stateContext.crumbs[this.stateContext.crumbs.length - distance].url;
    };
    StateNavigator.prototype.refresh = function (navigationData, historyAction) {
        var url = this.getRefreshLink(navigationData);
        if (url == null)
            throw new Error('Invalid route data, a mandatory route parameter has not been supplied a value');
        this.navigateLink(url, historyAction);
    };
    StateNavigator.prototype.getRefreshLink = function (navigationData) {
        return this.getLink(this.stateContext.state, navigationData);
    };
    StateNavigator.prototype.navigateLink = function (url, historyAction, history) {
        var _this = this;
        if (historyAction === void 0) { historyAction = 'add'; }
        if (history === void 0) { history = false; }
        var oldUrl = this.stateContext.url;
        var _a = this.parseLink(url), state = _a.state, data = _a.data;
        var navigateContinuation = this.getNavigateContinuation(oldUrl, state, data, url, historyAction);
        var unloadContinuation = function () {
            if (oldUrl === _this.stateContext.url)
                state.navigating(data, url, navigateContinuation, history);
        };
        if (this.stateContext.state)
            this.stateContext.state.unloading(state, data, url, unloadContinuation, history);
        else
            state.navigating(data, url, navigateContinuation, history);
    };
    StateNavigator.prototype.getNavigateContinuation = function (oldUrl, state, data, url, historyAction) {
        var _this = this;
        return function (asyncData) {
            if (oldUrl === _this.stateContext.url) {
                _this.setStateContext(state, data, url);
                if (_this.stateContext.oldState && _this.stateContext.oldState !== state)
                    _this.stateContext.oldState.dispose();
                state.navigated(_this.stateContext.data, asyncData);
                for (var id in _this.navigateHandlers) {
                    if (url === _this.stateContext.url)
                        _this.navigateHandlers[id](_this.stateContext.oldState, state, _this.stateContext.data);
                }
                if (url === _this.stateContext.url) {
                    if (historyAction !== 'none')
                        _this.historyManager.addHistory(url, historyAction === 'replace');
                    if (_this.stateContext.title && (typeof document !== 'undefined'))
                        document.title = _this.stateContext.title;
                }
            }
        };
    };
    StateNavigator.prototype.parseLink = function (url) {
        try {
            var state = this.router.getData(url.split('?')[0]).state;
            var _a = StateHandler.getNavigationData(this.router, state, url), data = _a.data, separableData = _a.separableData;
            data = NavigationDataManager.parseData(this.converterFactory, data, state, separableData);
            var crumbTrail = data[state.crumbTrailKey];
            if (crumbTrail) {
                for (var i = 0; i < crumbTrail.length; i++) {
                    var crumb = crumbTrail[i];
                    if (crumb.substring(0, 1) !== '/')
                        throw new Error(crumb + ' is not a valid crumb');
                }
            }
            return { state: state, data: data };
        }
        catch (e) {
            throw new Error('The Url is invalid\n' + e.message);
        }
    };
    StateNavigator.prototype.start = function (url) {
        this.navigateLink(url ? url : this.historyManager.getCurrentUrl());
    };
    ;
    return StateNavigator;
}());
module.exports = StateNavigator;

},{"./NavigationDataManager":2,"./StateConfig":3,"./StateContext":4,"./StateHandler":5,"./StateRouter":7,"./config/Crumb":8,"./converter/ConverterFactory":12,"./history/HashHistoryManager":18}],7:[function(require,module,exports){
"use strict";
var Router = require('./routing/Router');
var StateRouter = (function () {
    function StateRouter() {
    }
    StateRouter.prototype.getData = function (route) {
        var match = this.router.match(route, StateRouter.urlDecode);
        var separableData = {};
        if (match.route['_splat']) {
            for (var i = 0; i < match.route.params.length; i++) {
                var param = match.route.params[i];
                if (param.splat)
                    separableData[param.name] = true;
            }
        }
        return { state: match.route['_state'], data: match.data, separableData: separableData };
    };
    StateRouter.prototype.getRoute = function (state, data, arrayData) {
        if (arrayData === void 0) { arrayData = {}; }
        var routeInfo = state['_routeInfo'];
        var paramsKey = '';
        for (var key in routeInfo.params) {
            if (data[key])
                paramsKey += routeInfo.params[key] + ',';
        }
        paramsKey = paramsKey.slice(0, -1);
        var routeMatch = routeInfo.matches[paramsKey];
        var routePath = null;
        if (routeMatch) {
            var combinedData = StateRouter.getCombinedData(routeMatch.route, data, arrayData);
            routePath = routeMatch.route.build(combinedData, StateRouter.urlEncode);
        }
        else {
            var bestMatch = StateRouter.findBestMatch(routeInfo.routes, data, arrayData);
            if (bestMatch) {
                routePath = bestMatch.routePath;
                routeMatch = { route: bestMatch.route, data: bestMatch.data };
                routeInfo.matches[paramsKey] = routeMatch;
            }
        }
        return { route: routePath, data: routeMatch ? routeMatch.data : {} };
    };
    StateRouter.findBestMatch = function (routes, data, arrayData) {
        var bestMatch;
        var bestMatchCount = -1;
        var bestMatchParamCount = -1;
        for (var i = 0; i < routes.length; i++) {
            var route = routes[i];
            var combinedData = StateRouter.getCombinedData(route, data, arrayData);
            var routePath = route.build(combinedData, StateRouter.urlEncode);
            if (routePath) {
                var count = 0;
                var routeData = {};
                for (var j = 0; j < route.params.length; j++) {
                    if (combinedData[route.params[j].name]) {
                        routeData[route.params[j].name] = {};
                        count++;
                    }
                }
                if (count > bestMatchCount || (count === bestMatchCount && route.params.length < bestMatchParamCount)) {
                    bestMatch = { route: route, data: routeData, routePath: routePath };
                    bestMatchCount = count;
                    bestMatchParamCount = route.params.length;
                }
            }
        }
        return bestMatch;
    };
    StateRouter.getCombinedData = function (route, data, arrayData) {
        if (!route['_splat'])
            return data;
        var combinedData = {};
        for (var key in data)
            combinedData[key] = data[key];
        for (var i = 0; i < route.params.length; i++) {
            var param = route.params[i];
            var arr = arrayData[param.name];
            if (param.splat && arr)
                combinedData[param.name] = arr;
        }
        return combinedData;
    };
    StateRouter.urlEncode = function (route, name, val) {
        var state = route['_state'];
        if (state.urlEncode)
            return state.urlEncode(state, name, val, false);
        else
            return encodeURIComponent(val);
    };
    StateRouter.urlDecode = function (route, name, val) {
        var state = route['_state'];
        if (state.urlDecode)
            return state.urlDecode(state, name, val, false);
        else
            return decodeURIComponent(val);
    };
    StateRouter.prototype.addRoutes = function (states) {
        this.router = new Router();
        for (var i = 0; i < states.length; i++) {
            this.addStateRoutes(states[i]);
        }
        this.router.sort(function (routeA, routeB) {
            var routeANumber = routeA.path.charAt(0) === '{' ? -1 : 0;
            var routeBNumber = routeB.path.charAt(0) === '{' ? -1 : 0;
            return routeBNumber - routeANumber;
        });
    };
    StateRouter.prototype.addStateRoutes = function (state) {
        var routeInfo = { routes: [], params: {}, matches: {} };
        var count = 0;
        var routes = StateRouter.getRoutes(state);
        for (var i = 0; i < routes.length; i++) {
            var route = this.router.addRoute(routes[i], state.formattedDefaults);
            var splat = false;
            for (var j = 0; j < route.params.length; j++) {
                var param = route.params[j];
                if (!routeInfo.params[param.name]) {
                    routeInfo.params[param.name] = count;
                    count++;
                }
                splat = splat || param.splat;
            }
            routeInfo.routes.push(route);
            route['_state'] = state;
            route['_splat'] = splat;
            route.defaults = StateRouter.getCombinedData(route, state.formattedDefaults, state.formattedArrayDefaults);
        }
        state['_routeInfo'] = routeInfo;
    };
    StateRouter.getRoutes = function (state) {
        var routes = [];
        var route = state.route;
        if (typeof route === 'string') {
            routes = routes.concat(StateRouter.expandRoute(route));
        }
        else {
            for (var i = 0; i < route.length; i++) {
                routes = routes.concat(StateRouter.expandRoute(route[i]));
            }
        }
        return routes;
    };
    StateRouter.expandRoute = function (route) {
        var routes = [];
        var subRoutes = route.split('+');
        var expandedRoute = '';
        for (var i = 0; i < subRoutes.length; i++) {
            expandedRoute += subRoutes[i];
            routes.push(expandedRoute);
        }
        return routes;
    };
    return StateRouter;
}());
module.exports = StateRouter;

},{"./routing/Router":20}],8:[function(require,module,exports){
"use strict";
var Crumb = (function () {
    function Crumb(data, state, url, crumblessUrl, last) {
        this.data = data ? data : {};
        this.state = state;
        this.last = last;
        this.title = state.title;
        this.url = url;
        this.crumblessUrl = crumblessUrl;
    }
    return Crumb;
}());
module.exports = Crumb;

},{}],9:[function(require,module,exports){
"use strict";
var State = (function () {
    function State() {
        this.defaults = {};
        this.defaultTypes = {};
        this.formattedDefaults = {};
        this.formattedArrayDefaults = {};
        this.trackCrumbTrail = false;
        this.crumbTrailKey = 'crumb';
        this.trackTypes = true;
    }
    State.prototype.unloading = function (state, data, url, unload, history) {
        unload();
    };
    ;
    State.prototype.navigating = function (data, url, navigate, history) {
        navigate();
    };
    ;
    State.prototype.dispose = function () {
    };
    ;
    State.prototype.navigated = function (data, asyncData) {
    };
    ;
    State.prototype.urlEncode = function (state, key, val, queryString) {
        return encodeURIComponent(val);
    };
    State.prototype.urlDecode = function (state, key, val, queryString) {
        return decodeURIComponent(val);
    };
    State.prototype.truncateCrumbTrail = function (state, crumbs) {
        var newCrumbs = [];
        for (var i = 0; i < crumbs.length; i++) {
            if (crumbs[i].state === state)
                break;
            newCrumbs.push(crumbs[i]);
        }
        return newCrumbs;
    };
    return State;
}());
module.exports = State;

},{}],10:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var TypeConverter = require('./TypeConverter');
var ArrayConverter = (function (_super) {
    __extends(ArrayConverter, _super);
    function ArrayConverter(converter, key) {
        _super.call(this, key, converter.name + 'array');
        this.converter = converter;
    }
    ArrayConverter.prototype.convertFrom = function (val, separable) {
        var arr = [];
        if (typeof val === 'string') {
            if (!separable) {
                var vals = val.split(ArrayConverter.SEPARATOR1);
                for (var i = 0; i < vals.length; i++) {
                    if (vals[i].length !== 0)
                        arr.push(this.converter.convertFrom(vals[i].replace(new RegExp('0' + ArrayConverter.SEPARATOR, 'g'), ArrayConverter.SEPARATOR)));
                    else
                        arr.push(null);
                }
            }
            else {
                arr.push(this.converter.convertFrom(val));
            }
        }
        else {
            for (var i = 0; i < val.length; i++) {
                if (val[i].length !== 0)
                    arr.push(this.converter.convertFrom(val[i]));
                else
                    arr.push(null);
            }
        }
        return arr;
    };
    ArrayConverter.prototype.convertTo = function (val) {
        var vals = [];
        var arr = [];
        for (var i = 0; i < val.length; i++) {
            if (val[i] != null && val[i].toString()) {
                var convertedValue = this.converter.convertTo(val[i]).val;
                arr.push(convertedValue);
                vals.push(convertedValue.replace(new RegExp(ArrayConverter.SEPARATOR, 'g'), '0' + ArrayConverter.SEPARATOR));
            }
            else {
                arr.push('');
                vals.push('');
            }
        }
        return { val: vals.join(ArrayConverter.SEPARATOR1), arrayVal: arr };
    };
    ArrayConverter.SEPARATOR = '-';
    ArrayConverter.SEPARATOR1 = '1-';
    return ArrayConverter;
}(TypeConverter));
module.exports = ArrayConverter;

},{"./TypeConverter":16}],11:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var TypeConverter = require('./TypeConverter');
var BooleanConverter = (function (_super) {
    __extends(BooleanConverter, _super);
    function BooleanConverter(key) {
        _super.call(this, key, 'boolean');
    }
    BooleanConverter.prototype.convertFrom = function (val) {
        if (val !== 'true' && val !== 'false')
            throw Error(val + ' is not a valid boolean');
        return val === 'true';
    };
    BooleanConverter.prototype.convertTo = function (val) {
        return { val: val.toString() };
    };
    return BooleanConverter;
}(TypeConverter));
module.exports = BooleanConverter;

},{"./TypeConverter":16}],12:[function(require,module,exports){
"use strict";
var ArrayConverter = require('./ArrayConverter');
var BooleanConverter = require('./BooleanConverter');
var DateConverter = require('./DateConverter');
var NumberConverter = require('./NumberConverter');
var StringConverter = require('./StringConverter');
var TypeConverter = require('./TypeConverter');
var ConverterFactory = (function () {
    function ConverterFactory() {
        this.keyToConverterList = {};
        this.nameToKeyList = {};
        var converterArray = [
            new StringConverter('0'), new BooleanConverter('1'),
            new NumberConverter('2'), new DateConverter('3')];
        for (var i = 0; i < converterArray.length; i++) {
            var converter = converterArray[i];
            var arrayConverter = new ArrayConverter(converter, 'a' + converter.key);
            this.keyToConverterList[converter.key] = converter;
            this.keyToConverterList[arrayConverter.key] = arrayConverter;
            this.nameToKeyList[converter.name] = converter.key;
            this.nameToKeyList[arrayConverter.name] = arrayConverter.key;
        }
    }
    ConverterFactory.prototype.getConverter = function (obj) {
        return this.getConverterFromName(TypeConverter.getName(obj));
    };
    ConverterFactory.prototype.getConverterFromKey = function (key) {
        return this.keyToConverterList[key];
    };
    ConverterFactory.prototype.getConverterFromName = function (name) {
        var key = this.nameToKeyList[name];
        if (!key)
            throw new Error('No TypeConverter found for ' + name);
        return this.getConverterFromKey(key);
    };
    return ConverterFactory;
}());
module.exports = ConverterFactory;

},{"./ArrayConverter":10,"./BooleanConverter":11,"./DateConverter":13,"./NumberConverter":14,"./StringConverter":15,"./TypeConverter":16}],13:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var TypeConverter = require('./TypeConverter');
var DateConverter = (function (_super) {
    __extends(DateConverter, _super);
    function DateConverter(key) {
        _super.call(this, key, 'date');
    }
    DateConverter.prototype.convertFrom = function (val) {
        var dateParts = val.split('-');
        if (dateParts.length !== 3)
            throw Error(val + ' is not a valid date');
        var date = new Date(+dateParts[0], +dateParts[1] - 1, +dateParts[2]);
        if (isNaN(+date))
            throw Error(val + ' is not a valid date');
        return date;
    };
    DateConverter.prototype.convertTo = function (val) {
        var year = val.getFullYear();
        var month = ('0' + (val.getMonth() + 1)).slice(-2);
        var day = ('0' + val.getDate()).slice(-2);
        return { val: year + '-' + month + '-' + day };
    };
    return DateConverter;
}(TypeConverter));
module.exports = DateConverter;

},{"./TypeConverter":16}],14:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var TypeConverter = require('./TypeConverter');
var NumberConverter = (function (_super) {
    __extends(NumberConverter, _super);
    function NumberConverter(key) {
        _super.call(this, key, 'number');
    }
    NumberConverter.prototype.convertFrom = function (val) {
        if (isNaN(+val))
            throw Error(val + ' is not a valid number');
        return +val;
    };
    NumberConverter.prototype.convertTo = function (val) {
        return { val: val.toString() };
    };
    return NumberConverter;
}(TypeConverter));
module.exports = NumberConverter;

},{"./TypeConverter":16}],15:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var TypeConverter = require('./TypeConverter');
var StringConverter = (function (_super) {
    __extends(StringConverter, _super);
    function StringConverter(key) {
        _super.call(this, key, 'string');
    }
    StringConverter.prototype.convertFrom = function (val) {
        if (typeof val !== 'string')
            throw Error(val + ' is not a valid string');
        return val;
    };
    StringConverter.prototype.convertTo = function (val) {
        return { val: val.toString() };
    };
    return StringConverter;
}(TypeConverter));
module.exports = StringConverter;

},{"./TypeConverter":16}],16:[function(require,module,exports){
"use strict";
var TypeConverter = (function () {
    function TypeConverter(key, name) {
        this.key = key;
        this.name = name;
    }
    TypeConverter.prototype.convertFrom = function (val, separable) {
        if (separable === void 0) { separable = false; }
        return null;
    };
    TypeConverter.prototype.convertTo = function (val) {
        return null;
    };
    TypeConverter.getTypeName = function (obj) {
        var typeName = Object.prototype.toString.call(obj);
        return typeName.substring(8, typeName.length - 1).toLowerCase();
    };
    TypeConverter.getName = function (obj) {
        var fullName = this.getTypeName(obj);
        if (fullName === 'array') {
            var arr = obj;
            var subName = 'string';
            for (var i = 0; i < arr.length; i++) {
                if (arr[i] != null && arr[i].toString()) {
                    subName = this.getTypeName(arr[i]);
                    break;
                }
            }
            fullName = subName + fullName;
        }
        return fullName;
    };
    return TypeConverter;
}());
module.exports = TypeConverter;

},{}],17:[function(require,module,exports){
"use strict";
var HTML5HistoryManager = (function () {
    function HTML5HistoryManager(applicationPath) {
        if (applicationPath === void 0) { applicationPath = ''; }
        this.applicationPath = '';
        this.disabled = (typeof window === 'undefined') || !(window.history && window.history.pushState);
        this.applicationPath = applicationPath;
    }
    HTML5HistoryManager.prototype.init = function (navigateHistory) {
        this.navigateHistory = navigateHistory;
        if (!this.disabled)
            window.addEventListener('popstate', this.navigateHistory);
    };
    HTML5HistoryManager.prototype.addHistory = function (url, replace) {
        var href = this.getHref(url);
        if (!this.disabled && location.pathname + location.search !== href) {
            if (!replace)
                window.history.pushState(null, null, href);
            else
                window.history.replaceState(null, null, href);
        }
    };
    HTML5HistoryManager.prototype.getCurrentUrl = function () {
        return location.pathname.substring(this.applicationPath.length) + location.search;
    };
    HTML5HistoryManager.prototype.getHref = function (url) {
        if (url == null)
            throw new Error('The Url is invalid');
        return this.applicationPath + url;
    };
    HTML5HistoryManager.prototype.getUrl = function (anchor) {
        return anchor.pathname.substring(this.applicationPath.length) + anchor.search;
    };
    HTML5HistoryManager.prototype.stop = function () {
        if (!this.disabled)
            window.removeEventListener('popstate', this.navigateHistory);
    };
    return HTML5HistoryManager;
}());
module.exports = HTML5HistoryManager;

},{}],18:[function(require,module,exports){
"use strict";
var HashHistoryManager = (function () {
    function HashHistoryManager(replaceQueryIdentifier) {
        if (replaceQueryIdentifier === void 0) { replaceQueryIdentifier = false; }
        this.replaceQueryIdentifier = false;
        this.disabled = (typeof window === 'undefined') || !('onhashchange' in window);
        this.replaceQueryIdentifier = replaceQueryIdentifier;
    }
    HashHistoryManager.prototype.init = function (navigateHistory) {
        this.navigateHistory = navigateHistory;
        if (!this.disabled) {
            if (window.addEventListener)
                window.addEventListener('hashchange', this.navigateHistory);
            else
                window['attachEvent']('onhashchange', this.navigateHistory);
        }
    };
    HashHistoryManager.prototype.addHistory = function (url, replace) {
        var href = this.getHref(url);
        if (!this.disabled && location.hash !== href) {
            if (!replace)
                location.hash = href;
            else
                location.replace(href);
        }
    };
    HashHistoryManager.prototype.getCurrentUrl = function () {
        return this.decode(location.hash.substring(1));
    };
    HashHistoryManager.prototype.getHref = function (url) {
        if (url == null)
            throw new Error('The Url is invalid');
        return '#' + this.encode(url);
    };
    HashHistoryManager.prototype.getUrl = function (anchor) {
        return this.decode(anchor.hash.substring(1));
    };
    HashHistoryManager.prototype.stop = function () {
        if (!this.disabled) {
            if (window.removeEventListener)
                window.removeEventListener('hashchange', this.navigateHistory);
            else
                window['detachEvent']('onhashchange', this.navigateHistory);
        }
    };
    HashHistoryManager.prototype.encode = function (url) {
        if (!this.replaceQueryIdentifier)
            return url;
        return url.replace('?', '#');
    };
    HashHistoryManager.prototype.decode = function (hash) {
        if (!this.replaceQueryIdentifier)
            return hash;
        return hash.replace('#', '?');
    };
    return HashHistoryManager;
}());
module.exports = HashHistoryManager;

},{}],19:[function(require,module,exports){
"use strict";
var Segment = require('./Segment');
var Route = (function () {
    function Route(path, defaults) {
        this.segments = [];
        this.params = [];
        this.path = path;
        this.defaults = defaults ? defaults : {};
        this.parse();
    }
    Route.prototype.parse = function () {
        var subPaths = this.path.split('/').reverse();
        var segment;
        var pattern = '';
        for (var i = 0; i < subPaths.length; i++) {
            segment = new Segment(subPaths[i], segment ? segment.optional : true, this.defaults);
            this.segments.unshift(segment);
            pattern = segment.pattern + pattern;
            var params = [];
            for (var j = 0; j < segment.params.length; j++) {
                var param = segment.params[j];
                params.push({ name: param.name, optional: segment.optional, splat: param.splat });
            }
            this.params = params.concat(this.params);
        }
        this.pattern = new RegExp('^' + pattern + '$', 'i');
    };
    Route.prototype.match = function (path, urlDecode) {
        if (!urlDecode)
            urlDecode = function (route, name, val) { return decodeURIComponent(val); };
        var matches = this.pattern.exec(path);
        if (!matches)
            return null;
        var data = {};
        for (var i = 1; i < matches.length; i++) {
            var param = this.params[i - 1];
            if (matches[i]) {
                var val = !param.optional ? matches[i] : matches[i].substring(1);
                if (val.indexOf('/') === -1) {
                    data[param.name] = urlDecode(this, param.name, val);
                }
                else {
                    var vals = val.split('/');
                    var decodedVals = [];
                    for (var j = 0; j < vals.length; j++)
                        decodedVals[j] = urlDecode(this, param.name, vals[j]);
                    data[param.name] = decodedVals;
                }
            }
        }
        return data;
    };
    Route.prototype.build = function (data, urlEncode) {
        var _this = this;
        if (!urlEncode)
            urlEncode = function (route, name, val) { return encodeURIComponent(val); };
        data = data != null ? data : {};
        var route = '';
        var optional = true;
        for (var i = this.segments.length - 1; i >= 0; i--) {
            var segment = this.segments[i];
            var pathInfo = segment.build(data, this.defaults, function (name, val) { return urlEncode(_this, name, val); });
            optional = optional && pathInfo.optional;
            if (!optional) {
                if (pathInfo.path == null)
                    return null;
                route = '/' + pathInfo.path + route;
            }
        }
        return route.length !== 0 ? route : '/';
    };
    return Route;
}());
module.exports = Route;

},{"./Segment":21}],20:[function(require,module,exports){
"use strict";
var Route = require('./Route');
var Router = (function () {
    function Router() {
        this.routes = [];
    }
    Router.prototype.addRoute = function (path, defaults) {
        path = path.slice(-1) === '/' ? path.substring(0, path.length - 1) : path;
        path = path.substring(0, 1) === '/' ? path.substring(1) : path;
        var route = new Route(path, defaults);
        this.routes.push(route);
        return route;
    };
    Router.prototype.match = function (path, urlDecode) {
        path = path.slice(-1) === '/' ? path.substring(0, path.length - 1) : path;
        path = (path.substring(0, 1) === '/' || path.length === 0) ? path : '/' + path;
        for (var i = 0; i < this.routes.length; i++) {
            var route = this.routes[i];
            var data = route.match(path, urlDecode);
            if (data)
                return { route: route, data: data };
        }
        return null;
    };
    Router.prototype.sort = function (compare) {
        this.routes.sort(compare);
    };
    return Router;
}());
module.exports = Router;

},{"./Route":19}],21:[function(require,module,exports){
"use strict";
var Segment = (function () {
    function Segment(path, optional, defaults) {
        this.pattern = '';
        this.params = [];
        this.subSegments = [];
        this.subSegmentPattern = /[{]{0,1}[^{}]+[}]{0,1}/g;
        this.escapePattern = /[\.+*\^$\[\](){}']/g;
        this.path = path;
        this.optional = optional;
        this.parse(defaults);
    }
    Segment.prototype.parse = function (defaults) {
        if (this.path.length === 0)
            return;
        var matches = this.path.match(this.subSegmentPattern);
        for (var i = 0; i < matches.length; i++) {
            var subSegment = matches[i];
            if (subSegment.slice(0, 1) === '{') {
                var param = subSegment.substring(1, subSegment.length - 1);
                var optional = param.slice(-1) === '?';
                var splat = param.slice(0, 1) === '*';
                var name = optional ? param.slice(0, -1) : param;
                name = splat ? name.slice(1) : name;
                this.params.push({ name: name, splat: splat });
                this.optional = this.optional && optional && this.path.length === subSegment.length;
                if (this.path.length === subSegment.length)
                    optional = this.optional;
                this.subSegments.push({ name: name, param: true, splat: splat, optional: optional });
                var subPattern = !splat ? '[^/]+' : '.+';
                this.pattern += !this.optional ? "(" + subPattern + ")" : "(/" + subPattern + ")";
                this.pattern += optional ? '?' : '';
            }
            else {
                this.optional = false;
                this.subSegments.push({ name: subSegment, param: false, splat: false, optional: false });
                this.pattern += subSegment.replace(this.escapePattern, '\\$&');
            }
        }
        if (!this.optional)
            this.pattern = '\/' + this.pattern;
    };
    Segment.prototype.build = function (data, defaults, urlEncode) {
        var routePath = '';
        var blank = false;
        var optional = false;
        for (var i = 0; i < this.subSegments.length; i++) {
            var subSegment = this.subSegments[i];
            if (!subSegment.param) {
                routePath += subSegment.name;
            }
            else {
                var val = data[subSegment.name];
                var defaultVal = defaults[subSegment.name];
                optional = subSegment.optional && (!val || val === defaultVal);
                if (this.optional || !optional) {
                    val = val ? val : defaultVal;
                    blank = blank || !val;
                    if (val) {
                        if (!subSegment.splat || typeof val === 'string') {
                            routePath += urlEncode(subSegment.name, val);
                        }
                        else {
                            var encodedVals = [];
                            for (var i = 0; i < val.length; i++)
                                encodedVals[i] = urlEncode(subSegment.name, val[i]);
                            routePath += encodedVals.join('/');
                            if (routePath.slice(-1) === '/')
                                routePath += '/';
                        }
                    }
                }
            }
        }
        return { path: !blank ? routePath : null, optional: optional && this.optional };
    };
    return Segment;
}());
module.exports = Segment;

},{}],22:[function(require,module,exports){
module.exports = require('./lib/Navigation');

},{"./lib/Navigation":1}],23:[function(require,module,exports){
'use strict';

var _navigation = require('navigation');

var stateNavigator = new _navigation.StateNavigator([{ key: 'catalog', route: '' }]);

},{"navigation":22}]},{},[23]);
