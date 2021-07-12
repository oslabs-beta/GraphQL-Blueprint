import * as types from '../actions/action-types';

const initialState = {
  statusMessage: '',
  modalProps: {},
  authError: null,
};

const generalReducers = (state = initialState, action) => {
  switch (action.type) {
    //  NOT USED
    case types.MESSAGE:
      return {
        ...state,
      };
    
    //  NOT USED
    case types.SHOW_MODAL:
      return {
        ...state,
      };

    //  NOT USED
    case types.HIDE_MODAL:
      return initialState;

    //  used in APP prop, to reset "snackbar" state (displayed message) within Snackbar back to '' on close.
    case types.HANDLE_SNACKBAR_UPDATE:
      const newState = action.payload;

      return {
        ...state,
        statusMessage: newState,
      };

    // Used for sign in, if sign in action is successful
    case types.LOGIN_SUCCESS:
      console.log('login success')
      return {
        ...state,
        authError: null,
      }

    // Used for sign in, if sign in action is NOT successful
    case types.LOGIN_ERROR:
      console.log('Username or password is incorrect.')
      return {
        ...state,
        authError: 'Username or password is incorrect.',
      }

    case types.SIGNOUT_SUCCESS:
      console.log('Signout success')
      return state

    case types.SIGNUP_SUCCESS:
      console.log('signup success')
      return {
        ...state,
        authError: null,
      }

    case types.SIGNUP_ERROR:
      console.log('signup error')
      return {
        ...state,
        authError: action.payload.message,
      }

    default:
      return state;
  }
};

export default generalReducers;
