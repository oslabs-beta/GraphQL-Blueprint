import { createStore, applyMiddleware, compose } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import reducers from './reducers/index.js';
import { loadState, saveState } from './actions/localStorage';
import thunk from 'redux-thunk';
import { reduxFirestore, getFirestore } from 'redux-firestore';
import { reactReduxFirebase, getFirebase } from 'react-redux-firebase';
import fbConfig from './config/fbConfig.js'


// we are adding composeWithDevTools here to get easy access to the Redux dev tools
const persistedState = loadState();

const composedEnhancers = composeWithDevTools(
  applyMiddleware(thunk.withExtraArgument({ getFirebase, getFirestore })),
  reduxFirestore(fbConfig),
  reactReduxFirebase(fbConfig, { attachAuthIsReady: true }),
)

const store = createStore(
  reducers,
  persistedState,
  composedEnhancers
);

// Save state anytime store state changes. Invokes every time there's a change 
store.subscribe(() => {
  saveState(store.getState())
})

export default store;
