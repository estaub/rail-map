

export
const logger = store => next => action => {

  // Emit beginning of log entry
  console.group(action.type);
  console.info('dispatching', action);

  // Call nested dispatch()
  let result = next(action);

  // Emit end of log entry
  console.log('next state', store.getState());
  console.groupEnd(action.type);

  // Return result of nested dispatch()
  return result;
};
