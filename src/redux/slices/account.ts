import { createSlice } from '@reduxjs/toolkit';
// utils
import { manageAccount } from '_apis_/account';
import { Account } from '../../@types/account';
import { dispatch } from '../store';
// ----------------------------------------------------------------------

type AccountState = {
  isLoading: boolean;
  error: boolean;
  accountList: Account[];
};

const initialState: AccountState = {
  isLoading: false,
  error: false,
  accountList: []
};

const slice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
    // GET LISTCORAL
    getListAccount(state, action) {
      state.isLoading = false;
      state.accountList = action.payload;
    }
  }
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export function getAccounts() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      await manageAccount.getListAccount().then((response) => {
        if (response.status == 200) {
          dispatch(slice.actions.getListAccount(response.data.items));
        }
      });
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
