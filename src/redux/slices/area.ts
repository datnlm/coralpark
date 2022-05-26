import { manageCoral } from '_apis_/coral';
import { map, filter } from 'lodash';
import { createSlice } from '@reduxjs/toolkit';
import { manageArea } from '_apis_/area';
import { dispatch } from '../store';
// utils
import { Area } from '../../@types/area';

// ----------------------------------------------------------------------

type AreaState = {
  isLoading: boolean;
  error: boolean;
  areaList: Area[];
};

const initialState: AreaState = {
  isLoading: false,
  error: false,
  areaList: []
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
      state.areaList = action.payload;
    }

    // DELETE DIVER
    // deleteDiver(state, action) {
    //   const deleteDiver = filter(state.areaList, (area) => area.id !== action.payload);
    //   state.areaList = deleteDiver;
    // }
  }
});
// Reducer
export default slice.reducer;

// Actions
// export const { deleteDiver } = slice.actions;

// ----------------------------------------------------------------------

// get area
export function getListArea() {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      await manageArea.getListArea().then((response) => {
        if (response.status == 200) {
          dispatch(slice.actions.getListDiver(response.data.items));
        }
      });
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
