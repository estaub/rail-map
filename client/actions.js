// names (types) of actions follow Duck standard: https://github.com/erikras/ducks-modular-redux
// app-name/module/action

export const APP = 'example';

// modules with their own reducer/duck
export const ABOUT_BOX = 'aboutBox';

// used in ducks to generate action type
export const makeTypeFactory = (module) => (action) => `${APP}/${module}/${action}`;
