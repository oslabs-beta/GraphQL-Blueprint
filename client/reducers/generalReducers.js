import * as types from '../actions/action-types';

const initialState = {
  statusMessage: '',
  modalProps: {},
  open: false
};

const generalReducers = (state = initialState, action) => {
  switch (action.type) {
    //  NOT USED
    case types.MESSAGE:
      return {
        ...state,
      };
    
    // to show tree modal
    case types.SHOW_MODAL:
      return {
        ...state,
        open: true
      };

    //  to hide tree modal
    case types.HIDE_MODAL:
      return {
        ...state,
        open: false
      };

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
