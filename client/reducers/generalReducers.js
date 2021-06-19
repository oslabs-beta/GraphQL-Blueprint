import * as types from '../actions/action-types';

const initialState = {
  statusMessage: '',
  modalProps: {},
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

    default:
      return state;
  }
};

export default generalReducers;
