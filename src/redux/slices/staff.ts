import { manageCoral } from '_apis_/coral';
import { map, filter } from 'lodash';
import { createSlice } from '@reduxjs/toolkit';
import { manageStaff } from '_apis_/staff';
import { dispatch } from '../store';
// utils
import { Staff } from '../../@types/staff';

// ----------------------------------------------------------------------

type StaffState = {
  isLoading: boolean;
  isLoadingDiverTeam: boolean;
  error: boolean;
  totalCount: number;
  staffList: Staff[];
};

const initialState: StaffState = {
  isLoading: false,
  isLoadingDiverTeam: false,
  error: false,
  totalCount: 0,
  staffList: []
};

const slice = createSlice({
  name: 'diver',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // START LOADING
    startLoadingDiverTeam(state) {
      state.isLoadingDiverTeam = true;
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
    getListStaff(state, action) {
      state.isLoading = false;
      state.staffList = action.payload;
    }
  }
});
// Reducer
export default slice.reducer;

// Actions
export const { totalCount } = slice.actions;

// ----------------------------------------------------------------------

// get Diver
export function getListStaff(page: number, rowsPerPage: number) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      await manageStaff.getListStaff(1 + page, rowsPerPage).then((response) => {
        if (response.status == 200) {
          dispatch(slice.actions.totalCount(response.data.metaData.totalCount));
          dispatch(slice.actions.getListStaff(response.data.items));
        }
      });
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
