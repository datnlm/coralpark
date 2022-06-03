import { manageCoral } from '_apis_/coral';
import { map, filter } from 'lodash';
import { createSlice } from '@reduxjs/toolkit';
import { manageDiver } from '_apis_/diver';
import { dispatch } from '../store';
// utils
import { Diver } from '../../@types/diver';

// ----------------------------------------------------------------------

type DiverState = {
  isLoading: boolean;
  error: boolean;
  totalCount: number;
  diverList: Diver[];
};

const initialState: DiverState = {
  isLoading: false,
  error: false,
  totalCount: 0,
  diverList: []
};

const slice = createSlice({
  name: 'diver',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // END LOADING
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

    // GET LIST Diver
    getListDiver(state, action) {
      state.isLoading = false;
      state.diverList = action.payload;
    },

    // DELETE DIVER
    deleteDiver(state, action) {
      const deleteDiver = filter(state.diverList, (diver) => diver.id !== action.payload);
      state.diverList = deleteDiver;
    }
  }
});
// Reducer
export default slice.reducer;

// Actions
export const { totalCount } = slice.actions;

// ----------------------------------------------------------------------

// get Diver
export function getListDiver(page: number, rowsPerPage: number) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      await manageDiver.getListDiver(1 + page, rowsPerPage).then((response) => {
        if (response.status == 200) {
          dispatch(slice.actions.totalCount(response.data.metaData.totalCount));
          dispatch(slice.actions.getListDiver(response.data.items));
          dispatch(slice.actions.endLoading());
        }
      });
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
