import { createSlice } from '@reduxjs/toolkit';
// utils
import { manageAccount } from '_apis_/account';
import { Account } from '../../@types/account';
import { dispatch } from '../store';
// ----------------------------------------------------------------------

type AccountState = {
  isLoading: boolean;
  error: boolean;
  totalCount: number;
  accountList: Account[];
};

const initialState: AccountState = {
  isLoading: false,
  error: false,
  totalCount: 0,
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

    endLoading(state) {
      state.isLoading = false;
    },

    // TOTOAL COUNT
    totalCount(state, action) {
      state.totalCount = action.payload;
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

export function getAccounts(page: number, rowsPerPage: number) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      await manageAccount.getListAccount(1 + page, rowsPerPage).then((response) => {
        if (response.status == 200) {
          dispatch(slice.actions.totalCount(response.data.metaData.totalCount));
          dispatch(slice.actions.getListAccount(response.data.items));
        } else {
          dispatch(slice.actions.endLoading());
        }
      });
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
