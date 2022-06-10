import { manageCoral } from '_apis_/coral';
import { map, filter } from 'lodash';
import { createSlice } from '@reduxjs/toolkit';
import { manageEmployee } from '_apis_/employee';
import { dispatch } from '../store';
// utils
import { Employee } from '../../@types/employee';

// ----------------------------------------------------------------------

type EmployeeState = {
  isLoading: boolean;
  isLoadingDiverTeam: boolean;
  error: boolean;
  totalCount: number;
  employeeList: Employee[];
};

const initialState: EmployeeState = {
  isLoading: false,
  isLoadingDiverTeam: false,
  error: false,
  totalCount: 0,
  employeeList: []
};

const slice = createSlice({
  name: 'emplpyee',
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

    // GET LIST
    getListEmployee(state, action) {
      state.isLoading = false;
      state.employeeList = action.payload;
    }
  }
});
// Reducer
export default slice.reducer;

// Actions
export const { totalCount } = slice.actions;

// ----------------------------------------------------------------------

// get Diver
export function getListEmployee(page: number, rowsPerPage: number) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      await manageEmployee.getListEmployee(1 + page, rowsPerPage).then((response) => {
        if (response.status == 200) {
          dispatch(slice.actions.totalCount(response.data.metaData.totalCount));
          dispatch(slice.actions.getListEmployee(response.data.items));
        }
      });
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
