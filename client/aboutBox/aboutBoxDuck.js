import { makeTypeFactory, ABOUT_BOX } from '../actions.js';

const makeType = makeTypeFactory(ABOUT_BOX); // make type function

const SHOW_ABOUT_BOX = makeType('SHOW');

export function showAboutBox(show) {
  return { type: SHOW_ABOUT_BOX, show };
}

const aboutBoxReducer = (state, action) => {
  if ( !state )
    return { enableAboutBox: action.show };
  switch (action.type) {
    case SHOW_ABOUT_BOX:
      return { ...state, enableAboutBox: action.show };
    default:
      return state;
  }
};

export default aboutBoxReducer;