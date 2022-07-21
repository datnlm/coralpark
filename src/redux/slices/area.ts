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
  totalCount: number;
  areaList: Area[];
};

const initialState: AreaState = {
  isLoading: false,
  error: false,
  totalCount: 0,
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

    // GET LIST AREA
    getListArea(state, action) {
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
export function getListArea(page: number, rowsPerPage: number) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      await manageArea.getListArea(1 + page, rowsPerPage).then((response) => {
        if (response.status == 200) {
          dispatch(slice.actions.totalCount(response.data.metaData.totalCount));
          dispatch(slice.actions.getListArea(response.data.items));
        } else {
          dispatch(slice.actions.endLoading());
        }
      });
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
