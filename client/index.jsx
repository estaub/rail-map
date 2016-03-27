import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './app.jsx';
import injectTapEventPlugin from 'react-tap-event-plugin';
import {createStore, applyMiddleware} from 'redux';
import { Provider } from 'react-redux';
import appReducer from './reducers.js';
import { logger } from './middleware.js';

/* global Meteor */
Meteor.startup(
  () => {
    // Needed for material-ui's onTouchTap events
    injectTapEventPlugin();

    // If running with Redux Dev Tools, let them wrap the store
    const creator = window.devToolsExtension
      ? window.devToolsExtension()(createStore)
      : createStore;

    // Create the global redux store, wrapping the dispatcher with our logger.
    const store = creator(appReducer, {}, applyMiddleware(logger));

    ReactDOM.render((
      // provide the store to all components
      <Provider store={store}>
        {/* invoke the root component */}
        <App />
      </Provider>
    ), document.getElementById('my-render-target'));
  }
);
