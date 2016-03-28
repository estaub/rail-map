import aboutBox from './components/aboutBox/aboutBoxDuck.js';
import app from './components/app/appDuck.js';
import { combineReducers } from 'redux';

const appReducer = combineReducers({aboutBox, app});

export default appReducer;
