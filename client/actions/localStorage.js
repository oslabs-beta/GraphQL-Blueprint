// LOADING STATE TO APP
export const loadState = () => {
  // We put this in try catch because calls to local storage can fail
  try {
    const serializedState = localStorage.getItem('state');
    // State doesn't exist
    if (serializedState === null) {
      return undefined;
    }
    // State exists
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
}; 

// SAVE STATE TO APP
export const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('state', serializedState);
  } catch (err) {
    // ignore write errors
  }
};