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
  diverList: Diver[];
};

const initialState: DiverState = {
  isLoading: false,
  error: false,
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
export const { deleteDiver } = slice.actions;

// ----------------------------------------------------------------------

// get Diver
export function getListDiver() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      await manageDiver.getListDiver().then((response) => {
        if (response.status == 200) {
          dispatch(slice.actions.getListDiver(response.data.items));
        }
      });
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
