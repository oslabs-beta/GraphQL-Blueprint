import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import store from './store';

// Material UI
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

// Components
import App from './components/app.jsx';

const muiTheme = getMuiTheme({
  fontFamily: 'Ubuntu, sans-serif',
  textField: {
    floatingLabelColor: '#848393',
    focusColor: '#194A9A',
  },
  toggle: {
    thumbOnColor: '#194A9A',
    thumbOffColor: '#FFFFFF',
    trackOffColor: '#8C8C8C',
    trackOnColor: '#BBCBE0'
  },
  palette: {
    accent1Color: '#194A9A',
    accent2Color: '#194A9A',
    accent3Color: '#194A9A'
  },
  tabs: {
    backgroundColor: '#194A9A',
    textColor: '#FFF',
  },
  checkbox: {
    boxColor: '#194A9A',
  },
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
