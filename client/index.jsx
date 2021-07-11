import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import store from './store';

// Material UI
import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

// Components
import App from './components/app.jsx';

const muiTheme = getMuiTheme({
  fontFamily: 'Ubuntu, sans-serif',
});

const ThemedIndex = () => (
  <MuiThemeProvider muiTheme={muiTheme}>
    <App />
  </MuiThemeProvider>
);

render(
  <Provider store={store}>
    <ThemedIndex />
  </Provider>, document.getElementById('app'),
);
