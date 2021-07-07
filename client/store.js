import { createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import reducers from './reducers/index.js';
import { loadState, saveState } from './actions/localStorage';


// we are adding composeWithDevTools here to get easy access to the Redux dev tools
const persistedState = loadState();

const store = createStore(
  reducers,
  persistedState,
  composeWithDevTools(),
);

// Save state anytime store state changes. Invokes every time there's a change 
store.subscribe(() => {
  saveState(store.getState())
})
export default store;
