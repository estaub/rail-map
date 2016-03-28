import { makeTypeFactory, APP } from '../../actions.js';

const makeType = makeTypeFactory(APP); // make type function

const DATA_READY = makeType('DATA_READY');

export function dataReady(data) {
  return { type: DATA_READY, data };
}

const appReducer = (state, action) => {
  if ( !state )
    return { };
  switch (action.type) {
    case DATA_READY:
      return { ...state, ...action.data };
    default:
      return state;
  }
};

export default appReducer;