import { manageCoral } from '_apis_/coral';
import { map, filter } from 'lodash';
import { createSlice } from '@reduxjs/toolkit';
import { manageEmployee } from '_apis_/employee';
import { dispatch } from '../store';
// utils
import { Employee } from '../../@types/employee';
import { EmployeePartner } from '../../@types/staff';

// ----------------------------------------------------------------------

type EmployeeState = {
  isLoading: boolean;
  isLoadingDiverTeam: boolean;
  error: boolean;
  totalCount: number;
  employeeList: Employee[];
  employeePartnerList: EmployeePartner[];
};

const initialState: EmployeeState = {
  isLoading: false,
  isLoadingDiverTeam: false,
  error: false,
  totalCount: 0,
  employeeList: [],
  employeePartnerList: []
};

const slice = createSlice({
  name: 'emplpyee',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    endLoading(state) {
      state.isLoading = false;
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
    },
    // GET LIST
    getListEmployeePartner(state, action) {
      state.isLoading = false;
      state.employeePartnerList = action.payload;
    }
  }
});
// Reducer
export default slice.reducer;

// Actions
export const { totalCount } = slice.actions;

// ----------------------------------------------------------------------

export function getListEmployee(roleId: string, page: number, rowsPerPage: number) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      await manageEmployee.getListEmployee(roleId, 1 + page, rowsPerPage).then((response) => {
        if (response.status == 200) {
          dispatch(slice.actions.totalCount(response.data.metaData.totalCount));
          dispatch(slice.actions.getListEmployee(response.data.items));
        } else {
          dispatch(slice.actions.endLoading());
        }
      });
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getListSiteManagerById(
  siteId: string,
  roleId: string,
  page: number,
  rowsPerPage: number
) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      await manageEmployee
        .getListSiteManagerById(siteId, roleId, 1 + page, rowsPerPage)
        .then((response) => {
          if (response.status == 200) {
            dispatch(slice.actions.totalCount(response.data.metaData.totalCount));
            dispatch(slice.actions.getListEmployee(response.data.items));
          } else {
            dispatch(slice.actions.endLoading());
            dispatch(slice.actions.getListEmployee([]));
          }
        });
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// get employee partner
export function getListEmployeePartner(page: number, rowsPerPage: number) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      await manageEmployee.getListEmployeePartner(1 + page, rowsPerPage).then((response) => {
        if (response.status == 200) {
          dispatch(slice.actions.totalCount(response.data.metaData.totalCount));
          dispatch(slice.actions.getListEmployeePartner(response.data.items));
        } else {
          dispatch(slice.actions.endLoading());
          dispatch(slice.actions.getListEmployeePartner([]));
        }
      });
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function getListEmployeePartnerById(partnerId: string, page: number, rowsPerPage: number) {
  return async () => {
    dispatch(slice.actions.startLoading());
    try {
      await manageEmployee
        .getListEmployeePartnerById(partnerId, 1 + page, rowsPerPage)
        .then((response) => {
          if (response.status == 200) {
            dispatch(slice.actions.totalCount(response.data.metaData.totalCount));
            dispatch(slice.actions.getListEmployeePartner(response.data.items));
          } else {
            dispatch(slice.actions.endLoading());
          }
        });
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
